import { useEffect, useState, type ReactNode } from 'react';

type Kind = 'info' | 'consejo' | 'atencion';
type Tip = { id: string; kind: Kind; title: string; body: ReactNode; link?: { label: string; href: string } };

const TIPS: Tip[] = [
  { id: 'sync', kind: 'info', title: 'Los informes se actualizan cada hora', body: 'Los datos de ventas pueden tardar hasta 60 minutos en aparecer.', link: { label: 'Ver estado de sincronización', href: '#sync' } },
  { id: 'keys', kind: 'consejo', title: 'Filtra más rápido con atajos', body: <>Pulsa <kbd>/</kbd> para buscar y <kbd>F</kbd> para abrir los filtros desde cualquier panel.</> },
  { id: 'pg', kind: 'atencion', title: 'Tu conexión con PostgreSQL caduca en 3 días', body: 'Renuévala para que los paneles sigan actualizándose.', link: { label: 'Renovar conexión', href: '#renovar' } },
];
const ICON: Record<Kind, ReactNode> = {
  info: <><circle cx="8" cy="8" r="6.25" /><path d="M8 7.25V11M8 5h.01" /></>,
  consejo: <path d="M8 1.75l1.5 4.25 4.25 1.5-4.25 1.5L8 13.25 6.5 9 2.25 7.5 6.5 6z" />,
  atencion: <><path d="M8 2l6.25 11H1.75z" /><path d="M8 6.75v3M8 11.75h.01" /></>,
};

export function TipCallouts({ tips = TIPS }: { tips?: Tip[] }) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [focus, setFocus] = useState<string | null>(null);
  const visible = tips.filter((t) => !hidden.includes(t.id));

  useEffect(() => {
    if (focus) document.getElementById(focus)?.focus();
  }, [focus]);

  const dismiss = (id: string) => {
    const i = visible.findIndex((t) => t.id === id);
    const near = visible[i + 1] ?? visible[i - 1];
    setHidden([...hidden, id]);
    setFocus(near ? `x-${near.id}` : 'back');
  };

  return (
    <>
      <div className="tips">
        {visible.map((t) => (
          <aside key={t.id} className={`tip ${t.kind}`} role="note">
            <span className="ico">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[t.kind]}</svg>
            </span>
            <div>
              <strong>{t.title}</strong>
              <p>{t.body}</p>
              {t.link && <a href={t.link.href}>{t.link.label}</a>}
            </div>
            <button type="button" id={`x-${t.id}`} className="x" aria-label={`Descartar consejo: ${t.title}`} onClick={() => dismiss(t.id)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" /></svg>
            </button>
          </aside>
        ))}
      </div>
      {!visible.length && (
        <div className="none" role="status">
          <p>Has descartado todos los consejos.</p>
          <button type="button" id="back" className="btn" onClick={() => { setHidden([]); setFocus(`x-${tips[0].id}`); }}>Restaurar consejos</button>
        </div>
      )}
    </>
  );
}

// CSS: copia las reglas .tips, .tip, .ico, .x, kbd, .none y .btn de la pestaña HTML + CSS.
