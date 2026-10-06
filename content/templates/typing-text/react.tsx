import { useEffect, useRef, useState } from 'react';

const FRASES = ['tus informes semanales', 'la conciliación de pagos', 'las alertas de inventario', 'la bienvenida a clientes'];
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function TypingText({ frases = FRASES }: { frases?: string[] }) {
  const [text, setText] = useState(calm ? frases[0] : '');
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const s = useRef({ i: 0, n: 0, del: false }); // posición actual; sobrevive a pausas

  useEffect(() => {
    if (calm || paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const c = s.current, p = frases[c.i];
      c.n += c.del ? -1 : 1;
      setText(p.slice(0, c.n));
      let ms = c.del ? 28 : 55;
      if (!c.del && c.n === p.length) { c.del = true; ms = 1500; }
      else if (c.del && c.n === 0) { c.del = false; c.i = (c.i + 1) % frases.length; ms = 350; }
      timer = setTimeout(tick, ms);
    };
    tick();
    return () => clearTimeout(timer);
  }, [paused, run, frases]);

  const repeat = () => { s.current = { i: 0, n: 0, del: false }; setText(''); setPaused(false); setRun((r) => r + 1); };

  return (
    <section className="hero">
      <h1>
        Automatiza <span className="typed" aria-hidden="true">{text}</span>
        <span className="sr">tus informes, pagos, inventario y bienvenidas</span>
      </h1>
      <p className="lead">Aurora conecta tus herramientas y repite por ti las tareas que se llevan horas cada semana.</p>
      {!calm && (
        <div className="actions">
          <button className="btn" type="button" onClick={() => setPaused(!paused)}>{paused ? 'Reanudar' : 'Pausar'}</button>
          <button className="btn" type="button" onClick={repeat}>Repetir</button>
        </div>
      )}
    </section>
  );
}

// CSS: copia las reglas .hero, h1, .typed, .sr, .lead, .actions, .btn y @keyframes blink de la pestaña HTML + CSS.
