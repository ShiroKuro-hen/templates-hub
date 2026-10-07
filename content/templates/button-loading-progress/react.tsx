import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type Estado = 'idle' | 'up' | 'done';
const SIZE = 4.2; // MB
const fmt = (n: number) => n.toFixed(1).replace('.', ',');

export function UploadButton() {
  const [state, setState] = useState<Estado>('idle');
  const [p, setP] = useState(0);
  const [msg, setMsg] = useState('');
  const timer = useRef<number>();
  const quarter = useRef(0);
  const btn = useRef<HTMLButtonElement>(null);

  const reset = (text = '') => {
    clearInterval(timer.current); quarter.current = 0; setP(0); setState('idle'); setMsg(text);
  };
  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    if (state === 'up') return;
    reset(); setState('up'); setMsg('Subiendo informe-q3.pdf.');
    let cur = 0;
    timer.current = window.setInterval(() => {
      cur = Math.min(100, cur + 2 + Math.random() * 5);
      setP(cur);
      if (Math.floor(cur / 25) > quarter.current) {
        quarter.current = Math.floor(cur / 25);
        setMsg(`${fmt((SIZE * cur) / 100)} MB de ${fmt(SIZE)} MB.`);
      }
      if (cur < 100) return;
      clearInterval(timer.current); setState('done'); setMsg('Listo. El equipo ya puede verlo.');
      setTimeout(() => reset(), 2500);
    }, 120);
  };
  const cancel = () => { reset('Subida cancelada. Vuelve a intentarlo cuando quieras.'); btn.current?.focus(); };
  const label = state === 'up' ? `Subiendo ${Math.round(p)} %` : state === 'done' ? 'Informe subido' : 'Subir informe';

  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Informe trimestral</h2>
      <p className="file">informe-q3.pdf, 4,2 MB</p>
      <div className="row">
        <button ref={btn} type="button" className="btn" data-state={state} aria-busy={state === 'up'} onClick={start}>
          <span>{label}</span>
          <span className="fill" role="progressbar" aria-label="Progreso de subida" aria-valuemin={0} aria-valuemax={100}
            aria-valuenow={Math.round(p)} style={{ '--p': p } as CSSProperties} />
        </button>
        <button type="button" className="link" hidden={state !== 'up'} onClick={cancel}>Cancelar subida</button>
      </div>
      <p id="msg" role="status">{msg}</p>
    </section>
  );
}
// CSS: copia las reglas .card, .btn, .fill, .link y #msg de la pestaña HTML + CSS.
