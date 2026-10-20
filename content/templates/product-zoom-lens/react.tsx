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
  { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23fde7c7%27/%3E%3Ccircle%20cx=%27240%27%20cy=%2770%27%20r=%2728%27%20fill=%27%23f59e0b%27/%3E%3Cpath%20d=%27M0%20240V150l80-70%2070%2060%2090-90%2080%2080v110z%27%20fill=%27%232f5bff%27/%3E%3Cpath%20d=%27M0%20240v-50l120-40%20100%2030%20100-26v86z%27%20fill=%27%230e9f6e%27/%3E%3C/svg%3E', alt: 'Vista frontal' },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23dbe7ff%27/%3E%3Crect%20x=%2730%27%20y=%2780%27%20width=%2750%27%20height=%27160%27%20fill=%27%232f5bff%27/%3E%3Crect%20x=%2790%27%20y=%2740%27%20width=%2760%27%20height=%27200%27%20fill=%27%230891b2%27/%3E%3Crect%20x=%27160%27%20y=%27100%27%20width=%2744%27%20height=%27140%27%20fill=%27%235b6b82%27/%3E%3Crect%20x=%27214%27%20y=%2760%27%20width=%2770%27%20height=%27180%27%20fill=%27%232f5bff%27/%3E%3Cg%20fill=%27%23fff%27%3E%3Crect%20x=%27104%27%20y=%2760%27%20width=%2710%27%20height=%2712%27/%3E%3Crect%20x=%27124%27%20y=%2760%27%20width=%2710%27%20height=%2712%27/%3E%3Crect%20x=%27228%27%20y=%2780%27%20width=%2710%27%20height=%2712%27/%3E%3Crect%20x=%27248%27%20y=%2780%27%20width=%2710%27%20height=%2712%27/%3E%3C/g%3E%3C/svg%3E', alt: 'Vista lateral' },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23e6fbf4%27/%3E%3Ccircle%20cx=%27110%27%20cy=%27120%27%20r=%2780%27%20fill=%27%2334d399%27/%3E%3Ccircle%20cx=%27200%27%20cy=%27110%27%20r=%2760%27%20fill=%27%232f5bff%27%20opacity=%27.8%27/%3E%3Cpath%20d=%27M0%20200q80-60%20160%200t160%200v40H0z%27%20fill=%27%23f5b84b%27/%3E%3C/svg%3E', alt: 'Detalle del bolsillo' },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23ffe4ea%27/%3E%3Cpath%20d=%27M0%2080q40-30%2080%200t80%200%2080%200%2080%200v160H0z%27%20fill=%27%23ff6b81%27/%3E%3Cpath%20d=%27M0%20140q40-30%2080%200t80%200%2080%200%2080%200v100H0z%27%20fill=%27%23d92d4a%27%20opacity=%27.8%27/%3E%3Ccircle%20cx=%27260%27%20cy=%2746%27%20r=%2718%27%20fill=%27%23fbf1dc%27/%3E%3C/svg%3E', alt: 'Vista en uso' },
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
      <h2>Mochila Sierra 24 L</h2>
      <p className="price">89,90 €</p>
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
        <img src={shot.src} alt={shot.alt} width={640} height={480} loading="lazy" />
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
