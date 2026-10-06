import { useId } from 'react';

type State = 'ok' | 'degraded' | 'down';
type Props = { state: State; title: string; detail: string; updated: string; href: string; linkText?: string };

const LABEL: Record<State, string> = { ok: 'Operativo', degraded: 'Degradado', down: 'Caído' };

export function StatusBanner({ state, title, detail, updated, href, linkText = 'Ver incidente' }: Props) {
  const id = useId();
  return (
    <section className="banner" data-state={state} aria-labelledby={id} role={state === 'down' ? 'alert' : undefined}>
      <div className="body">
        <span className="state"><span className="dot" aria-hidden="true" />{LABEL[state]}</span>
        <strong id={id}>{title}</strong>
        <p>{detail}</p>
      </div>
      <div className="meta">
        <span>Actualizado a las {updated}</span>
        <a href={href}>{linkText}</a>
      </div>
    </section>
  );
}

// Uso:
// <StatusBanner state="degraded" title="La API responde más lento de lo habitual"
//   detail="Algunas peticiones tardan hasta 4 s. Estamos aplicando una corrección." updated="10:54" href="/estado" />

// CSS: copia las reglas .banner, .body, .state, .dot, @keyframes ping y .meta de la pestaña HTML + CSS.
