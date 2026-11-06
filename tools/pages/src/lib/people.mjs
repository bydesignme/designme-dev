// The people in the templates: one list, and one helper that draws each of them. Every person in a template's own markup
// (the app's sidebar, its top bar, a page's header, a list of chats) goes through avatar(), so their face is drawn in one
// place. It draws the components' own initials avatar (.av, coloured from the --av- palette), and marks it with
// data-person="<slug>". To change how people look, change this helper, nothing else.
// Agents keep their icons: they are not people, and they never go through here.

// the sixteen people in the templates, with the colour of their initials avatar
export const PEOPLE = {
  'Maya Kim':    { role:'Design lead',        av:'l' },
  'Jon Ortiz':   { role:'Product designer',   av:'m' },
  'Ari Reyes':   { role:'Brand designer',     av:'p' },
  'Dev Kumar':   { role:'Design engineer',    av:'b' },
  'Felix Gray':  { role:'Frontend engineer',  av:'t' },
  'Iris Bell':   { role:'Content designer',   av:'k' },
  'Kofi Mensah': { role:'Account lead',       av:'y' },
  'Lena Novak':  { role:'Research lead',      av:'r' },
  'Leo Marsh':   { role:'Founder, Orbit',     av:'b' },
  'Nina Cole':   { role:'Head of product, Northwind', av:'m' },
  'Omar Haddad': { role:'Engineering manager', av:'l' },
  'Pia Alvarez': { role:'Growth designer',    av:'k' },
  'Ruby Fox':    { role:'Billing',            av:'r' },
  'Sam Lowe':    { role:'Support lead',       av:'t' },
  'Theo Reed':   { role:'CTO, Kite Health',   av:'y' },
  'Zoe Park':    { role:'Design ops',         av:'p' },
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const slug = name => name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
export const initials = name => name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
export const role = name => (PEOPLE[name] || {}).role || '';

// one person. size: 'xs' 18px, 's' 22px (the components' own), 'm' 28px, 'l' 32px. label: read out on its own (a face
// with no name beside it); leave it off where the name is written next to the face. status: 'on' or 'away', a dot
export function avatar(name, { size = 's', label = false, status = '' } = {}){
  const p = PEOPLE[name];
  if (!p) throw new Error('templates: no person called ' + name + ' (add them to PEOPLE in src/lib/people.mjs)');
  const a11y = label ? ` role="img" aria-label="${esc(name)}"` : ' aria-hidden="true"';
  const face = `<span class="av tp-av ${size}" data-person="${slug(name)}" style="background:var(--av-${p.av});color:var(--av-${p.av}-ink)"${a11y} title="${esc(name)}">${initials(name)}</span>`;
  return status ? `<span class="tp-avs-wrap">${face}<i class="tp-st ${status}" aria-hidden="true"></i></span>` : face;
}

// a row of overlapping faces, with "+n" for the rest
export function facepile(names, { size = 's', max = 5, label = '' } = {}){
  const shown = names.slice(0, max), more = names.length - shown.length;
  const text = label || names.join(', ');
  return `<span class="tp-pile ${size}" role="img" aria-label="${esc(text)}">${shown.map(n => avatar(n, { size })).join('')}${more > 0 ? `<span class="tp-more" aria-hidden="true">+${more}</span>` : ''}</span>`;
}
