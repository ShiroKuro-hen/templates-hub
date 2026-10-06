const TOKENS = ['bg', 'surface', 'text', 'muted', 'accent', 'ok', 'warn', 'err'] as const;
export type Token = (typeof TOKENS)[number];

export function Palette({ tokens = TOKENS }: { tokens?: readonly Token[] }) {
  return (
    <ul className="swatches" aria-label="Paleta de marca">
      {tokens.map((t) => (
        <li className="sw" key={t}>
          <i style={{ background: `var(--${t})` }} aria-hidden="true" />
          <span>--{t}</span>
        </li>
      ))}
    </ul>
  );
}
// CSS: copia las variables :root (y el bloque prefers-color-scheme: dark) de css.css, más las reglas
// .swatches / .sw / .sw i / .sw span de la pestaña HTML + CSS (añade list-style:none; margin:0; padding:0 a .swatches).
