import type { ReactNode } from 'react';

type Tipo = 'nota' | 'imp' | 'warn' | 'err';

const TIPOS: Record<Tipo, { titulo: string; d: string }> = {
  nota: { titulo: 'Nota', d: 'M2 8a6 6 0 1 0 12 0A6 6 0 1 0 2 8M8 7.5V11M8 5v.01' },
  imp: { titulo: 'Importante', d: 'M8 3.5l1.2 2.5 2.7.4-2 1.9.5 2.7L8 9.7l-2.4 1.3.5-2.7-2-1.9 2.7-.4z' },
  warn: { titulo: 'Advertencia', d: 'M8 2 14.5 13h-13zM8 6.5v3M8 11.5v.01' },
  err: { titulo: 'Peligro', d: 'M5 2h6l3 3v6l-3 3H5l-3-3V5zM6 6l4 4M10 6l-4 4' },
};

export function Callout({ tipo = 'nota', id, children }: { tipo?: Tipo; id: string; children: ReactNode }) {
  const t = TIPOS[tipo];
  return (
    <aside className={`co ${tipo === 'nota' ? '' : tipo}`} role="note" aria-labelledby={id}>
      <svg className="ic" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={t.d} />
      </svg>
      <p className="t" id={id}>{t.titulo}</p>
      <div><p>{children}</p></div>
    </aside>
  );
}

export function CalloutBlocks() {
  return (
    <article>
      <h1>Eliminar un proyecto</h1>
      <p>Antes de borrar un proyecto, revisa estos avisos. Cada uno indica qué pasa y qué debes hacer.</p>
      <Callout id="c1">Los cambios en los ajustes se aplican al guardarlos. No hace falta reiniciar los servicios.</Callout>
      <Callout tipo="imp" id="c2">Solo las personas con rol <strong>Administrador</strong> pueden eliminar un proyecto.</Callout>
      <Callout tipo="warn" id="c3">Al eliminar un proyecto se borran sus variables. Exporta una copia antes de continuar.</Callout>
      <Callout tipo="err" id="c4">
        Esta acción no se puede deshacer: se borran todos los datos y las copias de seguridad. Para confirmar, ejecuta{' '}
        <code>proyecto eliminar --confirmar</code>.
      </Callout>
    </article>
  );
}

// CSS: copia las reglas article, .co, .ic, .t y code de la pestaña HTML + CSS.
