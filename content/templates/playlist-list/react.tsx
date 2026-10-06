import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

type Track = { title: string; artist: string; album: string; d: number }; // d: segundos
const TRACKS: Track[] = [
  { title: 'Primer plano', artist: 'Estudio Alba', album: 'Foco', d: 198 },
  { title: 'Teclas de lluvia', artist: 'Marisol Vega', album: 'Foco', d: 224 },
  { title: 'Cinta magnética', artist: 'Estudio Alba', album: 'Archivo', d: 176 },
  { title: 'Ventana abierta', artist: 'Tomás Rey', album: 'Archivo', d: 241 },
  { title: 'Frecuencia baja', artist: 'Marisol Vega', album: 'Foco', d: 205 },
  { title: 'Última hora', artist: 'Tomás Rey', album: 'Archivo', d: 189 },
];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function PlaylistList({ name = 'Música para enfocarse', tracks = TRACKS }: { name?: string; tracks?: Track[] }) {
  const [cur, setCur] = useState(1);
  const [el, setEl] = useState(47);
  const [on, setOn] = useState(false);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const total = tracks.reduce((a, t) => a + t.d, 0);

  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setEl((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [on]);

  useEffect(() => {
    if (el < tracks[cur].d) return;
    if (cur < tracks.length - 1) setCur(cur + 1); else { setCur(0); setOn(false); }
    setEl(0);
  }, [el, cur, tracks]);

  const pick = (k: number) => { if (k === cur) setOn(!on); else { setCur(k); setEl(0); setOn(true); } };
  const onKey = (e: KeyboardEvent) => {
    const i = rows.current.indexOf(document.activeElement as HTMLButtonElement);
    const j = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : -1;
    if (j >= 0 && j < tracks.length) { rows.current[j]?.focus(); e.preventDefault(); }
  };

  return (
    <section className={`pl${on ? ' playing' : ''}`} aria-labelledby="h">
      <header className="head">
        <div className="art"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h12v2H4zm0 4h12v2H4zm0 4h8v2H4zm12 0v6l5-3z" /></svg></div>
        <div><h2 id="h">{name}</h2><p className="meta">{tracks.length} pistas, {Math.floor(total / 60)} min {total % 60} s</p></div>
        <button type="button" className="btn" onClick={() => setOn(!on)}>{on ? 'Pausar' : 'Reproducir'}</button>
      </header>
      <ol onKeyDown={onKey}>
        {tracks.map((t, k) => (
          <li key={t.title}>
            <button type="button" className="row" ref={(n) => { rows.current[k] = n; }}
                    aria-current={k === cur ? 'true' : undefined} onClick={() => pick(k)}
                    style={k === cur ? ({ '--p': `${(el / t.d) * 100}%` } as CSSProperties) : undefined}>
              <span className="n">{k + 1}</span><span className="eq" aria-hidden="true"><i /><i /><i /></span>
              <span className="info"><b>{t.title}</b><small>{t.artist}</small></span>
              <span className="alb">{t.album}</span>
              <span className="dur">{k === cur ? `${fmt(el)} / ${fmt(t.d)}` : fmt(t.d)}</span>
              <i className="bar" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

// CSS: copia las reglas .pl, .head, .btn, .row, .eq, .bar y .dur de la pestaña HTML + CSS.
