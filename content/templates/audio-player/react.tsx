import { useEffect, useState } from 'react';

type Track = { name: string; artist: string; d: number }; // d: segundos
const TRACKS: Track[] = [
  { name: 'Marea de neón', artist: 'Lumen Ensemble', d: 214 },
  { name: 'Horizonte lento', artist: 'Aurora Sur', d: 187 },
  { name: 'Código abierto', artist: 'Nube Cuántica', d: 245 },
  { name: 'Luz de madrugada', artist: 'Lumen Ensemble', d: 172 },
];
const PLAY = 'M8 5v14l11-7z', PAUSE = 'M6 5h4v14H6zm8 0h4v14h-4z';
const PREV = 'M6 6h2v12H6zm3.5 6 8.5 6V6z', NEXT = 'M16 6h2v12h-2zM6 18l8.5-6L6 6z';
const N = 60;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const Icon = ({ d }: { d: string }) => <svg className="i" viewBox="0 0 24 24"><path d={d} /></svg>;
const height = (k: number, n: number) => 8 + 38 * Math.abs(Math.sin((k + 2) * (n + 3) * 0.9) * Math.cos(k * 0.31 + n));

export function AudioPlayer({ tracks = TRACKS }: { tracks?: Track[] }) {
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const [on, setOn] = useState(false);
  const cur = tracks[i];

  useEffect(() => {
    if (!on) return;
    let last = performance.now(), id = 0;
    const tick = (now: number) => { setT((v) => v + (now - last) / 1000); last = now; id = requestAnimationFrame(tick); };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [on]);

  useEffect(() => {
    if (t < cur.d) return;
    if (i < tracks.length - 1) setI(i + 1); else { setI(0); setOn(false); }
    setT(0);
  }, [t, i, cur.d, tracks.length]);

  const go = (n: number) => { setI(n); setT(0); };

  return (
    <section className={`player${on ? ' playing' : ''}`} aria-label="Reproductor de audio">
      <div className="now">
        <div className="cover"><Icon d="M12 3v10.6A4 4 0 1 0 14 17V7h4V3z" /></div>
        <div><h2>{cur.name}</h2><p>{cur.artist}</p></div>
      </div>
      <div className="wave">
        <svg viewBox="0 0 240 48" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" x2="240"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          {Array.from({ length: N }, (_, k) => {
            const h = height(k, i);
            return <rect key={k} x={k * 4} y={(48 - h) / 2} width={2.4} height={h} rx={1.2} className={k / N < t / cur.d ? 'on' : undefined} />;
          })}
        </svg>
        <input type="range" min={0} max={cur.d} step={1} value={Math.floor(t)} aria-label="Posición de la pista"
               aria-valuetext={`${fmt(t)} de ${fmt(cur.d)}`} onChange={(e) => setT(+e.target.value)} />
      </div>
      <div className="ctl">
        <span className="time">{fmt(t)}</span>
        <div className="btns">
          <button type="button" aria-label="Pista anterior" onClick={() => (t > 3 ? setT(0) : go((i + tracks.length - 1) % tracks.length))}><Icon d={PREV} /></button>
          <button type="button" className="main" aria-label={on ? 'Pausar' : 'Reproducir'} onClick={() => setOn(!on)}><Icon d={on ? PAUSE : PLAY} /></button>
          <button type="button" aria-label="Pista siguiente" onClick={() => go((i + 1) % tracks.length)}><Icon d={NEXT} /></button>
        </div>
        <span className="time">{fmt(cur.d)}</span>
      </div>
      <ol>
        {tracks.map((tr, k) => (
          <li key={tr.name}>
            <button type="button" className="trk" aria-current={k === i ? 'true' : undefined} onClick={() => { go(k); setOn(true); }}>
              <span className="n">{k + 1}</span><span className="eq" aria-hidden="true"><i /><i /><i /></span>
              <span><b className="t">{tr.name}</b><small>{tr.artist}</small></span>
              <span className="d">{fmt(tr.d)}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

// CSS: copia las reglas .player, .now, .wave, .ctl, .btns, .trk y .eq de la pestaña HTML + CSS.
