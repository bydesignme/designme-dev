'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { DeckGlyph, Toast, type DeckGlyphPhase, type ToastAction, type ToastData, type ToastStep, type ToastStepStatus } from '../components/toast/Toast';
import { Icon } from '../lib/icons';
import { useStory, useWait } from './useScript';

/* ---------- Toast: the Job toast. "Make slides" starts a job the agent runs in the background; one toast holds it from start
   to finish. It reads the notes, outlines and drafts twelve slides, and the check stops on slide 7: the toast becomes the
   problem with its fix, then the finished deck with Undo and Open. An agent at work, so it keeps playing under the pointer ---------- */
type Phase = 'idle' | 'read' | 'outline' | 'draft' | 'check' | 'error' | 'fix' | 'done' | 'stopped' | 'removed';
interface Job { phase: Phase; at: 'read' | 'outline' | 'draft' | 'check'; n: number; checking: number; fixed: boolean; skipped: boolean; run: number }
const N = 12;
const SEC = ['Cover', 'Agenda', 'Revenue', 'North', 'South', 'Plan vs actual', 'By region', 'Hiring', 'Open roles', 'Risks', 'Data move', 'Next steps'];
const STEPS = ['Read the notes', 'Outline 12 slides', 'Draft the slides', 'Check the numbers'];
const START: Job = { phase: 'idle', at: 'read', n: 0, checking: -1, fixed: false, skipped: false, run: 0 };

export default function ToastDemo() {
  const ref = useRef<HTMLDivElement>(null), make = useRef<HTMLButtonElement>(null);
  const [job, setJob] = useState<Job>(START);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  // the job's own clock, cleared on unmount; a newer run (a fix, a stop) cancels an older one
  const wait = useWait(), live = useRef(0), J = useRef(job);
  const set = (patch: Partial<Job>) => { J.current = { ...J.current, ...patch }; setJob(J.current); };

  async function run(tok: number, from: 'read' | 'outline' | 'draft' | 'check' | 'recheck') {
    const ok = () => tok === live.current;
    if (from === 'read') { set({ phase: 'read', at: 'read' }); await wait(1700); if (!ok()) return; from = 'outline'; }
    if (from === 'outline') { set({ phase: 'outline', at: 'outline' }); await wait(1300); if (!ok()) return; from = 'draft'; }
    if (from === 'draft') {
      set({ phase: 'draft', at: 'draft' });
      while (J.current.n < N) { await wait(400); if (!ok()) return; set({ n: J.current.n + 1 }); }
      from = 'check';
    }
    set({ phase: 'check', at: 'check' });
    for (let i = from === 'recheck' ? 7 : 0; i < N; i++) {
      if (i === 6 && !J.current.fixed && !J.current.skipped) { set({ phase: 'error', checking: -1 }); return; }
      if (i === 6 && J.current.skipped) continue;
      set({ checking: i }); await wait(120); if (!ok()) return;
    }
    set({ checking: -1 }); await wait(150); if (!ok()) return;
    set({ phase: 'done' });
  }
  const start = () => {
    if (shown) return;
    // a job whose toast was closed before it finished: the button brings its toast back
    if (J.current.phase !== 'idle') { setShown(true); return; }
    live.current++; J.current = { ...START, run: J.current.run + 1 }; setOpen(false); setShown(true); run(live.current, 'read');
  };
  const fix = async () => { const tok = ++live.current; set({ phase: 'fix' }); await wait(1500); if (tok !== live.current) return; set({ fixed: true }); run(tok, 'recheck'); };
  const skip = () => { set({ skipped: true }); run(++live.current, 'recheck'); };
  // stopping a fix goes back to the problem it was fixing
  const stop = () => { live.current++; set({ phase: J.current.phase === 'fix' ? 'error' : 'stopped', checking: -1 }); };
  const resume = () => run(++live.current, J.current.at);
  const finish = () => { live.current++; set({ phase: 'idle' }); setShown(false); };

  // what the toast says and offers in each state
  const { phase, n, at } = job;
  const words: Record<Phase, [string, string]> = {
    idle: ['', ''], read: ['Reading your notes…', '3 sections · 212 words'], outline: ['Outlining the deck…', '12 slides planned'],
    draft: ['Drafting slides…', `Slide ${Math.min(n + 1, N)} of 12 · ${SEC[Math.min(n, N - 1)]}`], check: ['Checking the numbers…', 'Against the Q3 sheet'],
    error: ['Slide 7 doesn’t match', 'The sheet says 41k, not 14k'], fix: ['Fixing slide 7…', 'Using 41k from the sheet'],
    done: ['12 slides ready', job.skipped ? 'Q3 planning deck · 1 to check' : 'Q3 planning deck · 1 fixed'],
    stopped: [at === 'draft' ? `Stopped at slide ${n}` : at === 'check' ? 'Stopped while checking' : 'Stopped before drafting', `${n} of 12 drafted · nothing lost`],
    removed: ['Deck removed', 'Your notes are unchanged']
  };
  const working = ['read', 'outline', 'draft', 'check', 'fix'].includes(phase);
  const acts: Partial<Record<Phase, ToastAction[]>> = {
    error: [{ label: 'Skip', onClick: skip }, { label: 'Fix slide 7', variant: 'primary', onClick: fix }],
    done: [{ label: 'Undo', onClick: () => set({ phase: 'removed' }) }, { label: 'Open', variant: 'primary', onClick: finish }],
    stopped: [{ label: 'Discard', onClick: finish }, { label: 'Resume', variant: 'primary', onClick: resume }],
    removed: [{ label: 'Redo', onClick: () => set({ phase: 'done' }) }]
  };
  const stepAt = { read: 0, outline: 1, draft: 2, check: 3 }[at];
  const stepOf = (i: number): ToastStepStatus => phase === 'done' || phase === 'removed' ? 'done'
    : phase === 'stopped' ? (i < stepAt ? 'done' : i === stepAt ? 'paused' : 'waiting')
    : phase === 'error' && i === 3 ? 'failed' : i < stepAt ? 'done' : i === stepAt ? 'running' : 'waiting';
  const steps: ToastStep[] = STEPS.map((label, i) => ({ label, status: stepOf(i),
    detail: i === 2 && (stepOf(2) === 'running' || stepOf(2) === 'paused') ? `${Math.min(n + (phase === 'draft' ? 1 : 0), N)} of 12` : i === 3 && (phase === 'error' || phase === 'fix') ? 'Slide 7' : undefined }));
  const look: DeckGlyphPhase = { idle: 'idle', read: 'reading', outline: 'outlining', draft: 'drafting', check: 'checking', error: 'checking', fix: 'drafting', done: 'done', removed: 'gone', stopped: at === 'read' ? 'idle' : 'outlining' }[phase] as DeckGlyphPhase;
  const flagged = phase === 'error' || ((phase === 'done' || phase === 'removed') && job.skipped) ? 6 : undefined;
  const active = phase === 'draft' ? n : phase === 'fix' ? 6 : phase === 'check' && job.checking >= 0 ? job.checking : undefined;
  const toast: ToastData | null = shown && phase !== 'idle' ? {
    id: 'job' + job.run, status: working ? 'working' : phase === 'error' ? 'error' : phase === 'stopped' ? 'stopped' : 'success',
    title: words[phase][0], description: words[phase][1], steps: phase === 'removed' ? undefined : steps, actions: acts[phase],
    glyph: <DeckGlyph phase={look} made={phase === 'draft' || phase === 'stopped' ? n : N} active={active} flagged={flagged} />,
    onStop: stop, duration: phase === 'done' ? 10000 : phase === 'removed' ? 6000 : undefined,
    // milestones, not every slide: the start, a problem (at once), the end
    announce: { read: 'Making slides from your notes', outline: 'Making slides from your notes', draft: 'Making slides from your notes', check: 'Checking the numbers', error: 'Slide 7 doesn’t match the sheet. Fix slide 7 or skip it.', fix: 'Fixing slide 7', done: '12 slides ready. Open the deck or undo it.', stopped: `Stopped. ${n} of 12 drafted. Resume or discard.`, removed: 'Deck removed. Your notes are unchanged.', idle: '' }[phase]
  } : null;
  const label = shown || phase === 'idle' ? 'Make slides' : working ? 'Show progress' : 'Show job';

  // the story: make slides, open the steps, fix the problem the check finds, try Undo and Redo, then open the deck
  useStory(ref, async s => {
    const until = async (f: () => boolean) => { while (!f()) await s.wait(100); };
    await s.wait(1000); s.press('[data-k="make"]');
    await s.wait(2500); s.press('.dm-tst-more');
    await until(() => J.current.n >= 9); s.press('.dm-tst-more');
    await until(() => J.current.phase === 'error'); await s.wait(1500); s.press('.dm-tst-fi .dm-primary');
    await until(() => J.current.phase === 'done'); await s.wait(2000); s.press('.dm-tst-fi .dm-line');
    await s.wait(1500); s.press('.dm-tst-fi .dm-line');
    await s.wait(2500); s.press('.dm-tst-fi .dm-primary');
  }, { hold: false });

  return (
    <div ref={ref} data-dm="" style={{ width: '100%', minHeight: 260, display: 'grid', placeItems: 'center' }}>
      {/* the button and the toast share one place: the toast grows out of the button, and goes back into it once closed */}
      <div style={{ display: 'grid', width: '100%', justifyItems: 'center', alignItems: 'center' }}>
        <button ref={make} type="button" data-k="make" className="dm-pill dm-line dm-sm dm-tst-make" style={{ gridArea: '1/1', visibility: toast ? 'hidden' : undefined }} onClick={start}>
          <Icon name="spark" />{label}
        </button>
        <div style={{ gridArea: '1/1', width: '100%' }}>
          <Toast toast={toast} from={make} stepsOpen={open} onStepsOpenChange={setOpen}
            onDismiss={() => { setShown(false); if (!working && phase !== 'stopped' && phase !== 'error') finish(); }} />
        </div>
      </div>
    </div>
  );
}
