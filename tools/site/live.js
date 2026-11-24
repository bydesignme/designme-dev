// The components that are live on designme.dev (owner, 24 Nov), by their page name (/components/<name>, the registry name).
// Only these are in the library, the sidebar, search, the registry and installs, the sitemap and llms.txt, and every count
// in the copy follows this list; the others stay in the code, unlisted, and their pages send visitors on to /library.
// To make a component live, add its name here and rebuild (tools/site: npm run build, react, astro, pages).
module.exports = [
  'agent-tree', 'trace-view', 'agent-lanes', 'agent-inbox', 'thinking', 'composer', 'context-meter', 'web-search',
  'decision-prompt', 'attachment-tray', 'agent-run-timeline', 'run-cost', 'scheduled-runs', 'reasoning-trail', 'model-picker',
  'permission-gate', 'plan-review', 'event-calendar', 'file-explorer', 'command-palette', 'memory-panel', 'inline-text-diff',
  'terminal-stream', 'live-answer', 'step-loader', 'thinking-states', 'source-stack', 'citation-hover-card', 'answer-action-bar',
  'response-versions', 'feedback-sheet', 'tool-connections', 'knowledge-sources', 'run-drawer', 'status-pill',
];
