import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

const PLAY = 'M8 5v14l11-7z', PAUSE = 'M6 5h4v14H6zm8 0h4v14h-4z';
const VOL = 'M4 9v6h4l5 4V5L8 9zm12 3a4 4 0 0 0-2-3.5v7A4 4 0 0 0 16 12z', OFF = 'M4 9v6h4l5 4V5L8 9z';
const FULL = 'M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z';
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const Icon = ({ d }: { d: string }) => <svg className="i" viewBox="0 0 24 24"><path d={d} /></svg>;

type Props = { title?: string; duration?: number };

export function VideoControls({ title = 'Recorrido por el panel de Ion Cloud', duration = 204 }: Props) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(80);
  const [rate, setRate] = useState(1);
  const [full, setFull] = useState(false);
  const rateRef = useRef(rate); rateRef.current = rate;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now(), id = 0;
    const tick = (now: number) => {
      setT((v) => {
        const n = Math.min(duration, v + ((now - last) / 1000) * rateRef.current);
        if (n >= duration) setPlaying(false);
        return n;
      });
      last = now; id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, duration]);

  const toggle = () => { if (!playing && t >= duration) setT(0); setPlaying(!playing); };
  const skip = (s: number) => setT((v) => Math.max(0, Math.min(duration, v + s)));
  const onKey = (e: KeyboardEvent) => {
    const native = (e.target as HTMLElement).matches('input, select');
    if (e.key === 'Escape') setFull(false);
    else if (e.key === 'k' || (e.key === ' ' && e.target === e.currentTarget)) toggle();
    else if (!native && e.key === 'ArrowLeft') skip(-5);
    else if (!native && e.key === 'ArrowRight') skip(5);
    else if (e.key === 'm') setMuted(!muted);
    else if (e.key === 'f') setFull(!full);
    else return;
    e.preventDefault();
  };

  return (
    <section className={`player${playing ? ' playing' : ''}${full ? ' full' : ''}`} tabIndex={0}
             aria-label={`Reproductor de vídeo: ${title}`} onKeyDown={onKey}>
      <div className="screen" onClick={toggle}>
        <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect className="sky" width="160" height="90" />
          <circle className="sun" cx="130" cy="24" r="10" style={{ transform: `translateX(${(-t / duration) * 110}px)` }} />
          <path className="m1" d="M0 90 50 38l26 26 30-34 54 60z" /><path className="m2" d="M0 90 34 62l28 16 40-26 58 34z" />
        </svg>
        <button type="button" className="big" tabIndex={-1} aria-hidden="true"><Icon d={PLAY} /></button>
      </div>
      <div className="bar">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}><Icon d={playing ? PAUSE : PLAY} /></button>
        <span className="time">{fmt(t)} / {fmt(duration)}</span>
        <input className="seek" type="range" min={0} max={duration} value={Math.floor(t)} aria-label="Progreso"
               aria-valuetext={`${fmt(t)} de ${fmt(duration)}`} style={{ '--p': `${(t / duration) * 100}%` } as CSSProperties}
               onChange={(e) => setT(+e.target.value)} />
        <button type="button" aria-pressed={muted} aria-label={muted ? 'Activar sonido' : 'Silenciar'}
                onClick={() => { setMuted(!muted); if (muted && vol === 0) setVol(50); }}><Icon d={muted || vol === 0 ? OFF : VOL} /></button>
        <input className="vol" type="range" min={0} max={100} value={vol} aria-label="Volumen" aria-valuetext={`${vol} %`}
               onChange={(e) => { setVol(+e.target.value); setMuted(+e.target.value === 0); }} />
        <select aria-label="Velocidad" value={rate} onChange={(e) => setRate(+e.target.value)}>
          {[0.5, 1, 1.25, 1.5, 2].map((r) => <option key={r} value={r}>{String(r).replace('.', ',')}×</option>)}
        </select>
        <button type="button" aria-pressed={full} aria-label="Pantalla completa" onClick={() => setFull(!full)}><Icon d={FULL} /></button>
      </div>
      <div className="info">
        <h2>{title}</h2>
        <p className="hint"><kbd>K</kbd> reproducir, <kbd>←</kbd><kbd>→</kbd> 5 s, <kbd>M</kbd> silenciar, <kbd>F</kbd> pantalla completa</p>
      </div>
    </section>
  );
}

// CSS: copia las reglas .player, .screen, .big, .bar, .seek, .vol, .info y kbd de la pestaña HTML + CSS.
