import { useRef, useState, type CSSProperties } from 'react';

type Scene = { title: string; bg: string; p: [string, string][] }; // clase de relleno + trazo
const SUN = 'M108 28a12 12 0 1 0 24 0a12 12 0 1 0-24 0';
const SCENES: Scene[] = [
  { title: 'Sierra al amanecer', bg: 'bw', p: [['fw', SUN], ['fa', 'M0 100V70L40 38l28 28 26-22 66 56z'], ['fi', 'M0 100 50 74l40 14 70-18v30z']] },
  { title: 'Costa norte', bg: 'bi', p: [['fw', 'M28 26a10 10 0 1 0 20 0a10 10 0 1 0-20 0'], ['fi', 'M0 62q20-10 40 0t40 0t40 0t40 0V100H0z'], ['fa', 'M0 80q20-10 40 0t40 0t40 0t40 0V100H0z']] },
  { title: 'Ciudad nocturna', bg: 'ba', p: [['fi', 'M122 20a8 8 0 1 0 16 0a8 8 0 1 0-16 0'], ['fa', 'M10 100V50h22v50zM38 100V28h26v72zM70 100V58h20v42zM96 100V40h24v60zM126 100V60h24v40z']] },
  { title: 'Valle verde', bg: 'bo', p: [['fw', SUN], ['fo', 'M0 100V64q40-30 80 0t80 0v36z']] },
  { title: 'Atardecer en la loma', bg: 'be', p: [['fe', 'M60 70a20 20 0 0 1 40 0z'], ['fa', 'M0 100V74l30-10 40 14 40-16 50 12v26z']] },
];
const Pic = ({ s }: { s: Scene }) => (
  <><rect className={s.bg} width="160" height="100" />{s.p.map(([c, d]) => <path key={d} className={c} d={d} />)}</>
);
const CHEV = ['M15.4 6 14 4.6 6.6 12 14 19.4 15.4 18 9.4 12z', 'M8.6 6 10 4.6l7.4 7.4-7.4 7.4L8.6 18l6-6z'];

export function Lightbox({ scenes = SCENES }: { scenes?: Scene[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [n, setN] = useState(0);
  const go = (k: number) => setN((k + scenes.length) % scenes.length);
  const s = scenes[n];

  return (
    <>
      <header><h2>Paisajes del norte</h2><p>Abre una foto para verla en grande.</p></header>
      <ul className="grid">
        {scenes.map((x, k) => (
          <li key={x.title}>
            <button type="button" className="th" aria-haspopup="dialog" onClick={() => { setN(k); dlg.current?.showModal(); }}>
              <svg viewBox="0 0 160 100" aria-hidden="true"><Pic s={x} /></svg><span>{x.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dlg} aria-labelledby="cap"
              onClick={(e) => e.target === dlg.current && dlg.current.close()}
              onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(n - 1); else if (e.key === 'ArrowRight') go(n + 1); }}>
        <div className="stage">
          <svg viewBox="0 0 160 100" role="img" aria-label={s.title}><Pic s={s} /></svg>
          <button type="button" className="ib x" aria-label="Cerrar galería" onClick={() => dlg.current?.close()}>
            <svg viewBox="0 0 24 24"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4l5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z" /></svg>
          </button>
          <button type="button" className="ib prev" aria-label="Foto anterior" onClick={() => go(n - 1)}><svg viewBox="0 0 24 24"><path d={CHEV[0]} /></svg></button>
          <button type="button" className="ib next" aria-label="Foto siguiente" onClick={() => go(n + 1)}><svg viewBox="0 0 24 24"><path d={CHEV[1]} /></svg></button>
        </div>
        <div className="meter" aria-hidden="true"><i style={{ '--p': ((n + 1) / scenes.length) * 100 } as CSSProperties} /></div>
        <div className="cap"><b id="cap">{s.title}</b><span aria-live="polite">{n + 1} de {scenes.length}</span></div>
      </dialog>
    </>
  );
}

// CSS: copia las reglas .grid, .th, .bw...fs, dialog, .stage, .ib, .meter y .cap de la pestaña HTML + CSS.
