import { useState, type CSSProperties } from 'react';

type Props = { min?: number; max?: number; step?: number; gap?: number; onChange?: (range: [number, number]) => void };

export function RangeFilters({ min = 0, max = 1000, step = 10, gap = 50, onChange }: Props) {
  const [vol, setVol] = useState(60);
  const [lo, setLo] = useState(120);
  const [hi, setHi] = useState(680);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const update = (nextLo: number, nextHi: number, moved: 'lo' | 'hi') => {
    if (nextHi - nextLo < gap) moved === 'lo' ? (nextLo = nextHi - gap) : (nextHi = nextLo + gap);
    setLo(nextLo);
    setHi(nextHi);
    onChange?.([nextLo, nextHi]);
  };

  return (
    <form className="panel" aria-label="Filtros">
      <div>
        <div className="row"><label htmlFor="vol">Volumen</label><output htmlFor="vol">{vol}%</output></div>
        <input type="range" className="single" id="vol" min={0} max={100} value={vol}
               style={{ '--p': vol } as CSSProperties} onChange={(e) => setVol(+e.target.value)} />
      </div>
      <div role="group" aria-labelledby="priceLbl">
        <div className="row">
          <span className="label" id="priceLbl">Precio</span>
          <output htmlFor="lo hi">${lo} – ${hi}</output>
        </div>
        <div className="dual" style={{ '--a': pct(lo), '--b': pct(hi) } as CSSProperties}>
          <span className="fill" />
          <input type="range" id="lo" min={min} max={max} step={step} value={lo} aria-label="Precio mínimo"
                 aria-valuetext={`$${lo}`} onChange={(e) => update(+e.target.value, hi, 'lo')} />
          <input type="range" id="hi" min={min} max={max} step={step} value={hi} aria-label="Precio máximo"
                 aria-valuetext={`$${hi}`} onChange={(e) => update(lo, +e.target.value, 'hi')} />
        </div>
        <div className="scale" aria-hidden="true"><span>${min}</span><span>${max}</span></div>
      </div>
    </form>
  );
}

// CSS: copia las reglas .panel, .row, output, input[type=range], .single, .dual, .fill y .scale de la pestaña HTML + CSS.
