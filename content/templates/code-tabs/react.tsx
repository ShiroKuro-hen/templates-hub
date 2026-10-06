import { useRef, useState, type KeyboardEvent } from 'react';

const TABS = [
  { id: 'curl', label: 'cURL', code: `curl -X POST https://api.ejemplo.com/v1/pedidos \\
  -H "Authorization: Bearer $CLAVE" \\
  -H "Content-Type: application/json" \\
  -d '{"cliente": "cli_204", "total": 1280}'` },
  { id: 'js', label: 'JavaScript', code: `const res = await fetch('https://api.ejemplo.com/v1/pedidos', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${process.env.CLAVE}\`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ cliente: 'cli_204', total: 1280 }),
});
const pedido = await res.json();` },
  { id: 'py', label: 'Python', code: `import os, requests

res = requests.post(
    "https://api.ejemplo.com/v1/pedidos",
    headers={"Authorization": f"Bearer {os.environ['CLAVE']}"},
    json={"cliente": "cli_204", "total": 1280},
)
pedido = res.json()` },
];

export function CodeTabs({ tabs = TABS }: { tabs?: typeof TABS }) {
  const [i, setI] = useState(0);
  const [estado, setEstado] = useState<'idle' | 'ok' | 'error'>('idle');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const ir = (k: number) => { setI(k); refs.current[k]?.focus(); };
  const onKey = (e: KeyboardEvent) => {
    const n = tabs.length;
    const to = ({ ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
    if (to !== undefined) { e.preventDefault(); ir(to); }
  };
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(tabs[i].code);
      setEstado('ok'); setTimeout(() => setEstado('idle'), 1600);
    } catch { setEstado('error'); }
  };

  return (
    <div className="ct">
      <div className="bar">
        <div role="tablist" aria-label="Lenguaje del ejemplo" onKeyDown={onKey}>
          {tabs.map((t, k) => (
            <button key={t.id} ref={(el) => { refs.current[k] = el; }} role="tab" id={`t-${t.id}`} aria-selected={k === i}
                    aria-controls={`p-${t.id}`} tabIndex={k === i ? 0 : -1} onClick={() => setI(k)}>{t.label}</button>
          ))}
        </div>
        <button type="button" className="copy" data-ok={estado === 'ok' ? '' : undefined} onClick={copiar}>
          {estado === 'ok' ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      {tabs.map((t, k) => (
        <div key={t.id} role="tabpanel" id={`p-${t.id}`} aria-labelledby={`t-${t.id}`} tabIndex={0} hidden={k !== i}>
          <pre><code>{t.code}</code></pre>
        </div>
      ))}
      <p className="msg" role="alert">{estado === 'error' && 'No se pudo copiar. Selecciona el código y pulsa Ctrl+C.'}</p>
      <p className="sr" aria-live="polite">{estado === 'ok' && 'Código copiado al portapapeles.'}</p>
    </div>
  );
}

// CSS: copia las reglas .ct, .bar, [role=tab], .copy, pre, .msg y .sr de la pestaña HTML + CSS.
