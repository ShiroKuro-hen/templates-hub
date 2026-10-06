import { useRef, useState } from 'react';

type Props = {
  filename: string;
  code: string; // una línea por renglón
};

export function CodeBlock({ filename, code }: Props) {
  const [ok, setOk] = useState(false);
  const timer = useRef<number>();

  async function copy() {
    await navigator.clipboard.writeText(code);
    setOk(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOk(false), 1800);
  }

  return (
    <figure className="code" style={{ marginInline: 0 }}>
      <figcaption className="bar">
        <span>{filename}</span>
        <button type="button" className="copy" data-ok={ok ? '' : undefined} onClick={copy} aria-live="polite">
          {ok ? '¡Copiado!' : 'Copiar'}
        </button>
      </figcaption>
      <pre tabIndex={0} aria-label={`Código de ${filename}`}>
        <code>
          {code.split('\n').map((line, i) => (
            <span className="l" key={i}>{line || ' '}</span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

// Uso: <CodeBlock filename="saludar.ts" code={"export const hola = () => 'Hola';\nhola();"} />
// CSS: copia las reglas .code / .bar / .copy / pre / code / .l (y .k .s .f .c si resaltas sintaxis) de la pestaña HTML + CSS.
