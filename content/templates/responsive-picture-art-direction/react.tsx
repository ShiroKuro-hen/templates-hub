import { useEffect, useRef, useState } from 'react';

const SOURCES = [
  { name: 'vertical para móvil', media: '(max-width: 600px)', srcset: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20300%20400%27%3E%3Crect%20width=%27300%27%20height=%27400%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27150%27%20cy=%27150%27%20r=%2760%27%20fill=%27%23f59e0b%27/%3E%3Crect%20y=%27250%27%20width=%27300%27%20height=%27150%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M150%20120v120h-40z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M100%20240h110l-18%2018H118z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 1x, data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20300%20400%27%3E%3Crect%20width=%27300%27%20height=%27400%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27150%27%20cy=%27150%27%20r=%2790%27%20fill=%27%23f59e0b%27%20opacity=%27.25%27/%3E%3Ccircle%20cx=%27150%27%20cy=%27150%27%20r=%2760%27%20fill=%27%23f59e0b%27/%3E%3Cpath%20d=%27M30%2060h50a20%2020%200%200%200-20-20%2025%2025%200%200%200-30%2020z%27%20fill=%27%23fff%27%20opacity=%27.8%27/%3E%3Crect%20y=%27250%27%20width=%27300%27%20height=%27150%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M0%20300q25-10%2050%200t50%200%2050%200%2050%200%2050%200%2050%200%27%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-opacity=%27.5%27%20stroke-width=%273%27/%3E%3Cpath%20d=%27M150%20120v120h-40z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M100%20240h110l-18%2018H118z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 2x' },
  { name: 'panorámica para escritorio', media: '(min-width: 601px)', srcset: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20840%20360%27%3E%3Crect%20width=%27840%27%20height=%27360%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27620%27%20cy=%27120%27%20r=%2758%27%20fill=%27%23f59e0b%27/%3E%3Crect%20y=%27220%27%20width=%27840%27%20height=%27140%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M420%20110v120h-70z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M410%20240h110l-18%2018H428z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 1x, data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20840%20360%27%3E%3Crect%20width=%27840%27%20height=%27360%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27620%27%20cy=%27120%27%20r=%2790%27%20fill=%27%23f59e0b%27%20opacity=%27.25%27/%3E%3Ccircle%20cx=%27620%27%20cy=%27120%27%20r=%2758%27%20fill=%27%23f59e0b%27/%3E%3Cpath%20d=%27M60%2070h80a30%2030%200%200%200-30-30%2040%2040%200%200%200-50%2030z%27%20fill=%27%23fff%27%20opacity=%27.8%27/%3E%3Crect%20y=%27220%27%20width=%27840%27%20height=%27140%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M0%20260q40-14%2080%200t80%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%27%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-opacity=%27.5%27%20stroke-width=%273%27/%3E%3Cpath%20d=%27M420%20110v120h-70z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M410%20240h110l-18%2018H428z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 2x' },
];

const sourceTags = SOURCES.map((s) => `<source media="${s.media}" srcset="${s.srcset}">`).join('');
const REPORT_SCRIPT = `<script>const img=document.querySelector('img');const report=()=>parent.postMessage({pictureSrc:img.currentSrc,width:innerWidth,height:Math.ceil(img.getBoundingClientRect().height)},'*');img.addEventListener('load',report);addEventListener('resize',report);<\/script>`;
const SRCDOC = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}img{display:block;width:100%;height:auto}</style></head><body><picture>${sourceTags}<img alt="Velero navegando al atardecer sobre el mar" width="840" height="360"></picture>${REPORT_SCRIPT}</body></html>`;

function sourceName(pictureSrc: string): string {
  return SOURCES.find((s) => pictureSrc && s.srcset.includes(pictureSrc))?.name ?? 'cargando';
}

export function ResponsivePictureArtDirection() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [width, setWidth] = useState(640);
  const [picture, setPicture] = useState({ active: 'cargando', viewport: 0, height: 240 });

  useEffect(() => {
    const onReport = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || typeof e.data?.pictureSrc !== 'string') return;
      const { pictureSrc, width: viewport, height } = e.data;
      setPicture({ active: sourceName(pictureSrc), viewport, height });
    };
    window.addEventListener('message', onReport);
    return () => window.removeEventListener('message', onReport);
  }, []);

  return (
    <main className="wrap">
      <h2>Portada del evento</h2>
      <div className="ctl">
        <label htmlFor="range">Ancho de la vista previa</label>
        <input
          id="range"
          type="range"
          min={320}
          max={960}
          step={10}
          value={width}
          aria-valuetext={`${width} px`}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
        <output htmlFor="range">{width} px</output>
      </div>
      <div className="stage" style={{ width }}>
        <iframe
          ref={frame}
          className="preview"
          title="Vista previa del picture"
          srcDoc={SRCDOC}
          style={{ height: picture.height }}
        />
      </div>
      <p className="ind" aria-live="polite">
        Fuente activa: <b>{picture.active}</b> · ancho del marco {picture.viewport} px
      </p>
      <p className="note">
        El atributo media de source responde al ancho del viewport, no al del contenedor. Por eso la vista previa es un
        iframe: el deslizador cambia su ancho y el navegador vuelve a elegir la imagen.
      </p>
    </main>
  );
}

// CSS: copia las reglas de la pestaña HTML + CSS (.wrap, .ctl, .stage, .preview, .ind, .note y su media query).
