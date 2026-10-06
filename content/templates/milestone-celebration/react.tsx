import { useState, type CSSProperties } from 'react';

type Stat = { label: string; value: string };
type Props = { cifra?: string; titulo?: string; stats?: Stat[]; shareText?: string };

const COLORS = ['--accent', '--ok', '--warn', '--info', '--err'];
const PIECES = Array.from({ length: 20 }, (_, i) => ({
  '--x': `${((i * 37 + 8) % 96) + 2}%`,
  '--d': `${(i % 7) * 0.1}s`,
  '--dx': `${(i % 2 ? 1 : -1) * (12 + (i % 5) * 10)}px`,
  '--c': `var(${COLORS[i % 5]})`,
})) as CSSProperties[];

export function MilestoneCelebration({
  cifra = '1.000',
  titulo = 'Has llegado a 1.000 clientes',
  stats = [{ label: 'Este mes', value: '+86' }, { label: 'Ingresos', value: '48.920 €' }, { label: 'Retención', value: '94 %' }],
  shareText = 'Hemos llegado a 1.000 clientes en Nimbus.',
}: Props) {
  const [run, setRun] = useState(0); // cambiar la key reinicia las animaciones CSS
  const [status, setStatus] = useState('');

  const share = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setStatus('Texto copiado. Pégalo donde quieras compartirlo.');
    } catch {
      setStatus('No se pudo copiar. Selecciona el título y cópialo a mano.');
    }
  };

  return (
    <section className="card go" aria-labelledby="ttl">
      <div className="confetti" key={`c${run}`} aria-hidden="true">
        {PIECES.map((style, i) => <i key={i} style={style} />)}
      </div>
      <div className="ring">
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          <circle className="track" cx="60" cy="60" r="52" />
          <circle className="arc" key={`a${run}`} cx="60" cy="60" r="52" />
        </svg>
        <b>{cifra}</b>
      </div>
      <h2 id="ttl">{titulo}</h2>
      <p className="msg">Empezaste hace 14 meses. Este mes se sumaron 86 clientes nuevos.</p>
      <dl className="stats">
        {stats.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
      </dl>
      <div className="btns">
        <button type="button" className="btn main" onClick={share}>Compartir logro</button>
        <button type="button" className="btn" id="again" onClick={() => setRun(run + 1)}>Repetir celebración</button>
      </div>
      <p id="st" role="status">{status}</p>
    </section>
  );
}

// CSS: copia las reglas .card, .ring, .stats, .btn, .confetti y @keyframes fall/draw de la pestaña HTML + CSS.
