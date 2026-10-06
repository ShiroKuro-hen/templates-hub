import type { ReactNode } from 'react';

export function Grid({ children, min = 160 }: { children: ReactNode; min?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 16 }}>
      {children}
    </div>
  );
}

export const Item = ({ wide, children }: { wide?: boolean; children: ReactNode }) => (
  <div
    style={{
      gridColumn: wide ? 'span 2' : undefined,
      border: '2px solid #17130f',
      borderRadius: 10,
      boxShadow: '4px 4px 0 #17130f',
      padding: 16,
      background: wide ? '#ffd84d' : '#fffdf8',
    }}
  >
    {children}
  </div>
);
