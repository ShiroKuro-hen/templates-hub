import type { ReactNode } from 'react';

export function Grid({ children, min = 160 }: { children: ReactNode; min?: number }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}>
      {children}
    </div>
  );
}

export const Item = ({ wide, children }: { wide?: boolean; children: ReactNode }) => (
  <div className={wide ? 'item wide' : 'item'}>{children}</div>
);
// CSS: copia las reglas .grid / .item / .item.wide y los tokens :root de la pestaña HTML + CSS.
