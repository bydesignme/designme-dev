'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { FeedbackSheet } from '../components/feedback-sheet/FeedbackSheet';

/* ---------- Feedback sheet: thumbs under an answer; thumbs down opens a short sheet ---------- */
export default function FeedbackSheetDemo() {
  return (
    <div style={{ width: '100%' }}>
      <FeedbackSheet onSubmit={() => new Promise(res => setTimeout(res, 800))}>
        I tightened the hero spacing to 24px and swapped the CTA to the accent blue. The card grid now wraps at 720px.
      </FeedbackSheet>
    </div>
  );
}
