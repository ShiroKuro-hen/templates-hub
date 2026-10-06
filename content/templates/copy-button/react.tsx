import { useEffect, useRef, useState } from 'react';

type Props = { title: string; note?: string; command: string };

export function CopyCommand({ title, note, command }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const code = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setError(''); setCopied(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      if (code.current) getSelection()?.selectAllChildren(code.current);
      setError('No se pudo copiar. El comando quedó seleccionado: pulsa Ctrl+C.');
    }
  }

  return (
    <section className="card">
      <h2>{title}</h2>
      {note && <p>{note}</p>}
      <div className="code">
        <pre><code ref={code}>{command}</code></pre>
        <button className={copied ? 'copy done' : 'copy'} type="button" aria-label="Copiar comando" onClick={copy}>
          <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
          <svg className="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          <span aria-hidden="true">{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>
      <p className="msg">{error}</p>
      <span className="sr" role="status">{copied ? 'Comando copiado al portapapeles.' : ''}</span>
    </section>
  );
}

// CSS: copia las reglas .card, h2, .code, pre, .copy, .msg y .sr de la pestaña HTML + CSS.
