'use client';
import type { ReactNode, Ref } from 'react';

/** The component in the middle, its variant switch underneath, like the cards on designme.dev. `ref` reaches both, so a
    demo can tell when the visitor takes over (see useTakeover) */
export function Demo({ children, switcher, ref }: { children: ReactNode; switcher: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>
      <div data-dm="">{switcher}</div>
    </div>
  );
}
