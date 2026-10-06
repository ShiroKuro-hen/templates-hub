import { useEffect, useState } from 'react';

const TOKENS = [
  ['bg', 'Fondo'], ['surface', 'Superficie'], ['text', 'Texto'], ['muted', 'Atenuado'], ['border', 'Borde'],
  ['accent', 'Acento'], ['accent-soft', 'Acento suave'], ['accent-ink', 'Texto sobre acento'],
  ['ok', 'Ok'], ['warn', 'Aviso'], ['err', 'Error'], ['info', 'Info'],
  ['ok-soft', 'Ok suave'], ['warn-soft', 'Aviso suave'], ['err-soft', 'Error suave'], ['info-soft', 'Info suave'],
] as const;

export function Palette({ tokens = TOKENS }: { tokens?: readonly (readonly [string, string])[] }) {
  const [hex, setHex] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const cs = getComputedStyle(root);
      setHex(Object.fromEntries(tokens.map(([v]) => [v, cs.getPropertyValue(`--${v}`).trim().toUpperCase()])));
    };
    read();
    const mo = new MutationObserver(read); // el tema cambia vía data-theme
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, [tokens]);

  return (
    <ul className="swatches" aria-label="Paleta Ion">
      {tokens.map(([v, nombre]) => (
        <li className="sw" key={v}>
          <i style={{ background: `var(--${v})` }} aria-hidden="true" />
          <div>
            <b>{nombre}</b>
            <code>--{v}</code>
            <span>{hex[v]}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
// CSS: copia el contenido de la pestaña CSS (tokens :root y :root[data-theme=dark], más body) y las reglas
// .swatches / .sw / .sw i / .sw div / .sw b / .sw code / .sw span de la pestaña HTML + CSS.
