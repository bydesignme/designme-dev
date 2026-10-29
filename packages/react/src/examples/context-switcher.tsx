'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ContextSwitcher, type ContextSwitcherItem, type ContextSwitcherSegment, type ContextSwitcherValue } from '../components/context-switcher/ContextSwitcher';
import { useStory } from './useScript';

/* ---------- Context switcher: open the project's switcher, search for "inv" and pick Invoice reader; the environment
   follows it from eu-live in Production to staging ---------- */
type Project = ContextSwitcherItem & { envs: ContextSwitcherItem[] };
type Org = ContextSwitcherItem & { projects: Project[] };
const env = (id: string, kind: 'Production' | 'Staging' | 'Development', isDefault = false): ContextSwitcherItem =>
  ({ id, name: id, badge: { label: kind, tone: kind === 'Production' ? 'warning' : kind === 'Staging' ? 'blue' : 'neutral' }, isDefault });
const envs = (on: string) => [env('live', 'Production', on === 'live'), env('staging', 'Staging', on === 'staging'), env('sandbox', 'Development', on === 'sandbox')];
const ORGS: Org[] = [
  { id: 'fernhill', name: 'Fernhill Labs', tile: 'blue', badge: { label: 'Pro', tone: 'accent' }, projects: [
    { id: 'triage', name: 'Support triage agent', envs: [env('eu-live', 'Production', true), env('us-live', 'Production'), env('staging', 'Staging'), env('sandbox', 'Development')] },
    { id: 'invoice', name: 'Invoice reader', badge: { label: 'Beta', tone: 'teal' }, envs: envs('staging') },
    { id: 'research', name: 'Sales research agent', envs: envs('live') },
    { id: 'onboard', name: 'Onboarding copilot', badge: 'Paused', envs: envs('sandbox') },
    { id: 'notes', name: 'Release notes writer', envs: envs('live') }
  ] },
  { id: 'quillwork', name: 'Quillwork', tile: 'orange', badge: 'Free', projects: [
    { id: 'coach', name: 'Essay coach', envs: envs('live') },
    { id: 'cite', name: 'Citation checker', badge: { label: 'Beta', tone: 'teal' }, envs: envs('staging') }
  ] },
  { id: 'otterline', name: 'Otterline Health', tile: 'green', badge: { label: 'Enterprise', tone: 'violet' }, projects: [
    { id: 'intake', name: 'Intake assistant', envs: envs('live') },
    { id: 'claims', name: 'Claims summariser', envs: envs('live') },
    { id: 'handover', name: 'Shift handover notes', badge: { label: 'Beta', tone: 'teal' }, envs: envs('sandbox') }
  ] }
];

export default function ContextSwitcherDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [orgs, setOrgs] = useState(ORGS);
  const [value, setValue] = useState<ContextSwitcherValue>({ org: 'fernhill', project: 'triage', env: 'eu-live' });
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const org = (v: ContextSwitcherValue) => orgs.find(o => o.id === v.org) ?? orgs[0];
  const project = (v: ContextSwitcherValue) => org(v).projects.find(p => p.id === v.project) ?? org(v).projects[0];
  // each part's list comes from the parts before it, so picking an organisation brings its projects
  const segments: ContextSwitcherSegment[] = [
    { key: 'org', label: 'Organisation', items: orgs, heading: 'Your organisations' },
    { key: 'project', label: 'Project', items: v => org(v).projects, heading: v => `Projects in ${org(v).name}` },
    { key: 'env', label: 'Environment', items: v => project(v).envs, heading: v => `Environments of ${project(v).name}` }
  ];
  // Create new adds one by the name typed (an organisation comes with a first project) and picks it
  const create = (key: string, name: string) => {
    const id = `new-${Date.now()}`;
    const next = orgs.map(o => ({ ...o, projects: o.projects.map(p => ({ ...p, envs: [...p.envs] })) }));
    const o = next.find(x => x.id === value.org) ?? next[0], p = o.projects.find(x => x.id === value.project) ?? o.projects[0];
    if (key === 'org') next.push({ id, name: name || 'New organisation', tile: 'violet', badge: 'Free', projects: [{ id: id + '-p', name: 'First project', envs: envs('sandbox') }] });
    else if (key === 'project') o.projects.push({ id, name: name || 'New project', envs: envs('sandbox') });
    else p.envs.push(env(name || 'new-environment', 'Development'));
    setOrgs(next); setValue({ ...value, [key]: key === 'env' ? name || 'new-environment' : id });
  };
  // the story stops at the visitor's first click or key, so it never types into their search or picks over their choice
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); setOpen('project');
    await wait(1000);
    let typed = '';
    for (const ch of 'inv') { typed += ch; setQuery(typed); await wait(200); }
    await wait(1000); press('.dm-csw-o.dm-hl');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ContextSwitcher segments={segments} value={value} onChange={setValue} onCreate={create}
        open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} />
    </div>
  );
}
