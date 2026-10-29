'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { StepLibrary, type StepLibraryFlowStep, type StepLibraryGroup } from '../components/step-library/StepLibrary';
import { useStory } from './useScript';

const GROUPS: StepLibraryGroup[] = [
  { id: 'ai', label: 'AI', color: 'var(--dm-accent-mark)', iconColor: 'var(--dm-accent-fg)', steps: [
    { id: 'summarize', icon: 'spark', name: 'Summarize text', description: 'Turns long text into a short summary or a few bullet points, at the length you set.', takes: 'Any text, like a thread or a transcript', gives: 'A summary' },
    { id: 'classify', icon: 'hash', name: 'Classify', description: 'Sorts what comes in into one of the labels you list, with how sure it is.', takes: 'Text and your labels', gives: 'A label and a score' },
    { id: 'extract', icon: 'table', name: 'Extract fields', description: 'Pulls named fields, like a date or an order number, out of free text.', takes: 'Text and the fields to find', gives: 'A record with those fields' },
    { id: 'draft', icon: 'edit', name: 'Write a draft', description: 'Writes a first draft from your instructions and what the earlier steps found.', takes: 'Instructions and context', gives: 'Draft text to review' }] },
  { id: 'tools', label: 'Tools', color: 'var(--dm-pb)', steps: [
    { id: 'web', icon: 'globe', name: 'Search the web', description: 'Runs a web search and passes on the top results with their links.', takes: 'A query', gives: 'Results with titles and links' },
    { id: 'file', icon: 'file-text', name: 'Read a file', description: 'Opens a document from the workspace and passes on its text.', takes: 'A file', gives: 'The text of the file' },
    { id: 'db', icon: 'db', name: 'Query a database', description: 'Runs a read-only query and returns the rows that match.', takes: 'A query', gives: 'Rows as a table' },
    { id: 'api', icon: 'link', name: 'Call an API', description: 'Sends an HTTP request and hands the response to the next step.', takes: 'A URL, a method and a body', gives: 'The response' }] },
  { id: 'logic', label: 'Logic', color: 'var(--dm-pl)', steps: [
    { id: 'if', icon: 'branch', name: 'If / else', description: 'Sends the run down one of two paths, depending on a condition.', takes: 'A condition', gives: 'One of two paths' },
    { id: 'loop', icon: 'refresh', name: 'Loop over items', description: 'Runs the steps inside it once for each item in a list.', takes: 'A list', gives: 'One result per item' },
    { id: 'wait', icon: 'clock', name: 'Wait', description: 'Pauses the run for a set time, or until a date and time.', takes: 'A duration or a date', gives: 'The run, later' },
    { id: 'approve', icon: 'shield', name: 'Ask for approval', description: 'Holds the run until a person approves or rejects what happens next.', takes: 'Who to ask, and what', gives: 'Approved or rejected' }] },
  { id: 'actions', label: 'Actions', color: 'var(--dm-pm)', steps: [
    { id: 'email', icon: 'mail', name: 'Send an email', description: 'Sends an email from your workspace to one or more people.', takes: 'To, subject and body', gives: 'The sent email' },
    { id: 'post', icon: 'send', name: 'Post a message', description: 'Posts a message in a team chat channel.', takes: 'A channel and the message', gives: 'The posted message' },
    { id: 'ticket', icon: 'flag', name: 'Create a ticket', description: 'Opens a ticket in your tracker with a title, details and an owner.', takes: 'Title, details and owner', gives: 'The new ticket' },
    { id: 'record', icon: 'sliders', name: 'Update a record', description: 'Changes fields on a record in your CRM or database.', takes: 'The record and its new values', gives: 'The updated record' }] }
];
const START: StepLibraryFlowStep[] = [
  { key: 'trigger', icon: 'bolt', color: 'var(--dm-py)', name: 'When a ticket arrives', detail: 'Trigger' },
  { key: 'classify', icon: 'hash', color: 'var(--dm-accent-fg)', name: 'Classify', detail: 'AI' },
  { key: 'db', icon: 'db', color: 'var(--dm-pb)', name: 'Query a database', detail: 'Tools' }
];

/* ---------- Step library: search for "sum", read what Summarize text does, add it, clear the search, fold Tools ---------- */
export default function StepLibraryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [steps, setSteps] = useState(START);

  // the preview's story. Your first click or key stops it, and the panel is yours from wherever it got to
  useStory(ref, async ({ wait, press, taken }) => {
    taken(() => setQuery(''));
    await wait(1500);
    for (const ch of 'sum') { setQuery(q => q + ch); await wait(110); }
    await wait(1000);
    ref.current?.querySelector('.dm-slb-s')?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    await wait(2000); press('.dm-slb-s');
    await wait(1500); setQuery('');
    await wait(1000); setCollapsed(['tools']);
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <StepLibrary groups={GROUPS} query={query} onQueryChange={setQuery} collapsed={collapsed} onCollapsedChange={setCollapsed}
        workflow={{ title: 'Support triage', steps }}
        onAdd={(step, group) => setSteps(s => [...s, { key: step.id + '-' + s.length, icon: step.icon, color: group.iconColor ?? group.color, name: step.name, detail: group.label }])} />
    </div>
  );
}
