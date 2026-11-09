-- designme.dev roadmap and sign-ups (Supabase project udqdwspscjsrtftucueo), applied 9 November 2026 in the SQL Editor.
-- A record of what runs in production, not run by any build. What it does:
--   1. removes leftover TRUNCATE, REFERENCES and TRIGGER grants: anon and authenticated have no direct table rights
--   2. makes rls_auto_enable() uncallable through the API
--   3. adds a private rate_hits log (a salted md5 of the visitor's IP and a time; rows delete themselves after 2 days)
--   4. keeps that hash on each vote, to allow at most 3 votes per idea from one IP
--   5. per-visitor limits in the three public functions: 5 sign-ups an hour, 60 vote clicks an hour, 5 ideas a day
--      (the site-wide caps stay). The IP comes from Cloudflare's cf-connecting-ip, falling back to x-forwarded-for.
-- The privacy notice (tools/site/site-main.html, privacy()) says the hashed IP is kept for this.

begin;

-- 1. Remove leftover table permissions
revoke truncate, references, trigger on table public.ideas, public.subscribers, public.votes from anon, authenticated;

-- 2. Internal helper: no longer callable through the API
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- 3. Private per-visitor log (scrambled IP + time), not reachable from outside
create table public.rate_hits (
  id bigint generated always as identity primary key,
  action text not null,
  client_key text not null,
  key_source text not null,
  at timestamptz not null default now()
);
create index rate_hits_lookup on public.rate_hits (action, client_key, at);
create index rate_hits_at on public.rate_hits (at);
alter table public.rate_hits enable row level security;
revoke all on table public.rate_hits from anon, authenticated;
revoke all on sequence public.rate_hits_id_seq from anon, authenticated;

create function public._client_key() returns text
language plpgsql stable set search_path = public as $$
declare
  h json := nullif(current_setting('request.headers', true), '')::json;
  ip text;
  src text := 'cf';
begin
  ip := nullif(trim(h->>'cf-connecting-ip'), '');
  if ip is null then
    ip := nullif(trim(split_part(h->>'x-forwarded-for', ',', 1)), '');
    src := 'xff';
  end if;
  if ip is null then
    return 'none:';
  end if;
  return src || ':' || md5('designme-rl:' || ip);
end $$;

create function public._rate_ok(p_action text, p_max int, p_window interval) returns boolean
language plpgsql volatile set search_path = public as $$
declare
  k text := public._client_key();
begin
  delete from rate_hits where at < now() - interval '2 days';
  if k = 'none:' then
    return true; -- visitor can't be identified: only the site-wide caps apply
  end if;
  if (select count(*) from rate_hits
      where action = p_action and client_key = k and at > now() - p_window) >= p_max then
    return false;
  end if;
  insert into rate_hits (action, client_key, key_source)
  values (p_action, k, split_part(k, ':', 1));
  return true;
end $$;

revoke execute on function public._client_key() from public, anon, authenticated;
revoke execute on function public._rate_ok(text, int, interval) from public, anon, authenticated;

-- 4. Votes remember the scrambled IP (max 3 votes per idea per IP)
alter table public.votes add column client_key text;
create index votes_idea_client on public.votes (idea_id, client_key);

-- 5. Functions with per-visitor limits (site-wide caps kept)
create or replace function public.subscribe(p_email text, p_source text default 'site')
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from subscribers where created_at > now() - interval '1 minute') >= 120 then
    raise exception 'busy, try again shortly';
  end if;
  if not public._rate_ok('subscribe', 5, interval '1 hour') then
    raise exception 'too many sign-ups, try again later';
  end if;
  insert into subscribers (email, source)
  values (lower(trim(p_email)), case when p_source in ('hero', 'card') then p_source else 'site' end)
  on conflict (email) do nothing;
  return true;
end $$;

create or replace function public.toggle_vote(p_idea text, p_voter uuid)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  k text := public._client_key();
begin
  if not exists (select 1 from ideas where id = p_idea and approved) then
    raise exception 'unknown idea';
  end if;
  if not public._rate_ok('vote', 60, interval '1 hour') then
    raise exception 'too many votes, try again later';
  end if;
  if exists (select 1 from votes where idea_id = p_idea and voter = p_voter) then
    delete from votes where idea_id = p_idea and voter = p_voter;
  else
    if k <> 'none:' and (select count(*) from votes where idea_id = p_idea and client_key = k) >= 3 then
      raise exception 'vote limit reached for this idea';
    end if;
    insert into votes (idea_id, voter, client_key) values (p_idea, p_voter, nullif(k, 'none:'));
  end if;
  return (select count(*) from votes where idea_id = p_idea);
end $$;

create or replace function public.suggest_idea(p_title text, p_voter uuid)
returns text language plpgsql security definer set search_path = public as $$
declare
  new_id text;
begin
  if (select count(*) from ideas where created_at > now() - interval '1 hour' and not approved) > 50 then
    raise exception 'too many suggestions, try later';
  end if;
  if not public._rate_ok('suggest', 5, interval '1 day') then
    raise exception 'too many suggestions, try again tomorrow';
  end if;
  insert into ideas (title, description, status, tag, approved)
  values (left(trim(p_title), 120), 'Suggested by the community', 'idea', 'Idea', false)
  returning id into new_id;
  insert into votes (idea_id, voter, client_key) values (new_id, p_voter, nullif(public._client_key(), 'none:'));
  return new_id;
end $$;

commit;

notify pgrst, 'reload schema';
