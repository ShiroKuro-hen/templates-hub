import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';

type Shot = { src: string; alt: string };

const LENS = 140;
const ZOOM = 2.5;
const STEP = 10;
const LIMIT = 50;
const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [STEP, 0],
  ArrowRight: [-STEP, 0],
  ArrowUp: [0, STEP],
  ArrowDown: [0, -STEP],
};
const SHOTS: Shot[] = [
  { src: '/stock/taza-vintage.webp', alt: 'Taza roja con estampado vintage' },
  { src: '/stock/camara-vintage.webp', alt: 'Cámara vintage sobre teclas de piano' },
  { src: '/stock/tocadiscos.webp', alt: 'Aguja de tocadiscos sobre el vinilo' },
  { src: '/stock/cafe-rojo.webp', alt: 'Taza de café sobre fondo rojo' },
];
const clamp = (v: number) => Math.min(LIMIT, Math.max(-LIMIT, v));

export function ProductZoomLens({ shots = SHOTS }: { shots?: Shot[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lens, setLens] = useState<CSSProperties | null>(null);
  const shot = shots[active];
  const hint = zoomed
    ? 'Usa las flechas para desplazarte; Escape para salir.'
    : 'Pasa el cursor o pulsa Ampliar para ver el detalle.';

  function toggleZoom() {
    setZoomed(!zoomed);
    setPan({ x: 0, y: 0 });
    setLens(null);
    if (!zoomed) stage.current?.focus();
  }

  function moveLens(e: PointerEvent<HTMLDivElement>) {
    if (zoomed || e.pointerType !== 'mouse' || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setLens({
      left: x - LENS / 2,
      top: y - LENS / 2,
      backgroundImage: `url("${shot.src}")`,
      backgroundSize: `${r.width * ZOOM}px ${r.height * ZOOM}px`,
      backgroundPosition: `${LENS / 2 - x * ZOOM}px ${LENS / 2 - y * ZOOM}px`,
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' && zoomed) {
      setZoomed(false);
      return;
    }
    const d = KEYS[e.key];
    if (!zoomed || !d) return;
    e.preventDefault();
    setPan((p) => ({ x: clamp(p.x + d[0]), y: clamp(p.y + d[1]) }));
  }

  return (
    <div className="product">
      <h2>Taza vintage estampada 350 ml</h2>
      <p className="price">18,90 €</p>
      <div
        ref={stage}
        className={`stage${zoomed ? ' zoomed' : ''}`}
        tabIndex={0}
        role="group"
        aria-label="Imagen del producto. Con el zoom activo, usa las flechas para desplazarte y Escape para salir."
        style={{ '--tx': `${pan.x}%`, '--ty': `${pan.y}%` } as CSSProperties}
        onPointerMove={moveLens}
        onPointerLeave={() => setLens(null)}
        onKeyDown={onKeyDown}
      >
        <img src={shot.src} alt={shot.alt} width={800} height={533} />
        {lens && !zoomed && <div className="lens" style={lens} />}
      </div>
      <div className="row">
        <button type="button" className="btn" aria-pressed={zoomed} onClick={toggleZoom}>Ampliar</button>
        <span className="hint">{hint}</span>
      </div>
      <ul className="thumbs">
        {shots.map((s, i) => (
          <li key={s.src}>
            <button type="button" aria-current={i === active} onClick={() => setActive(i)}>
              <img src={s.src} alt={s.alt} width={96} height={72} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// CSS: copia las reglas de la pestaña HTML + CSS (.product, .stage, .lens, .thumbs, .row, .btn, .hint).
