import { useState } from 'react';

const STAGES: [string, number][] = [
  ['Visitas al sitio', 24800], ['Registros', 14900], ['Cuentas activadas', 9800], ['Planes elegidos', 5400], ['Pagos completados', 3100],
];
const f = (n: number) => n.toLocaleString('es');
const pc = (n: number) => `${(n * 100).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;

export function FunnelChart({ stages = STAGES }: { stages?: [string, number][] }) {
  const [hl, setHl] = useState(-1);
  const top = stages[0][1], n = stages.length, h = 100 / n;
  const step = stages.map((s, i) => (i ? s[1] / stages[i - 1][1] : 1));
  const worst = step.indexOf(Math.min(...step.slice(1)));

  return (
    <figure className="card" onKeyDown={(e) => e.key === 'Escape' && setHl(-1)}>
      <figcaption className="head">
        <div><h2>Embudo de conversión</h2><p>Visitantes del sitio que llegan a pagar, en septiembre.</p></div>
        <p className="sum"><b>{pc(stages[n - 1][1] / top)}</b><span>de las visitas terminan en pago</span></p>
      </figcaption>
      <div className="wrap">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={hl >= 0 ? 'dim' : ''} style={{ height: n * 64 }} onPointerLeave={() => setHl(-1)}>
          <defs><linearGradient id="fg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          {stages.map((s, i) => {
            const w0 = (s[1] / top) * 100, w1 = ((stages[i + 1] ? stages[i + 1][1] : s[1] * 0.8) / top) * 100, y0 = i * h + 0.8, y1 = (i + 1) * h - 0.8;
            return (
              <polygon key={s[0]} className={hl === i ? 'on' : undefined} onPointerOver={() => setHl(i)}
                       points={`${50 - w0 / 2},${y0} ${50 + w0 / 2},${y0} ${50 + w1 / 2},${y1} ${50 - w1 / 2},${y1}`} />
            );
          })}
        </svg>
        <ol onPointerLeave={() => setHl(-1)}>
          {stages.map((s, i) => (
            <li key={s[0]} tabIndex={0} className={hl === i ? 'on' : undefined} onPointerOver={() => setHl(i)} onFocus={() => setHl(i)} onBlur={() => setHl(-1)}
                aria-label={`${s[0]}: ${f(s[1])}, ${pc(s[1] / top)} del total${i ? `, ${pc(step[i])} de la etapa anterior` : ''}`}>
              <span className="n">{s[0]}</span>
              <span className="m">
                <b>{f(s[1])}</b>{pc(s[1] / top)} del total
                {i > 0 && <span className={i === worst ? 'badge warn' : 'badge'}>{i === worst ? 'Mayor caída: ' : 'Paso '}{pc(step[i])}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
// CSS: copia las reglas .card, .head, .sum, .wrap, svg, polygon, ol, li, .n, .m y .badge de la pestaña HTML + CSS.
