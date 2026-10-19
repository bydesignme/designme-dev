'use client';
import type { ReactNode } from 'react';

/** The component in the middle, its variant switch underneath, like the cards on designme.dev */
export function Demo({ children, switcher }: { children: ReactNode; switcher: ReactNode }) {
  return (
    <div style={{ width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ marginBlock: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>
      <div data-dm="">{switcher}</div>
    </div>
  );
}
