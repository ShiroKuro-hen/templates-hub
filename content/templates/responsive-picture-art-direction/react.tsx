import { useEffect, useRef, useState } from 'react';

const SOURCES: Record<string, string> = {
  'atardecer-vertical.webp': 'vertical para móvil',
  'atardecer-panoramica.webp': 'panorámica para escritorio',
};
const REPORT_SCRIPT = `<script>const img=document.querySelector('img');const report=()=>parent.postMessage({pictureSrc:img.currentSrc,width:innerWidth,height:Math.ceil(img.getBoundingClientRect().height)},'*');img.addEventListener('load',report);addEventListener('resize',report);<\/script>`;
const SRCDOC = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}img{display:block;width:100%;height:auto}</style></head><body><picture><source media="(max-width: 600px)" srcset="/stock/atardecer-vertical.webp"><img loading="lazy" src="/stock/atardecer-panoramica.webp" alt="Atardecer sobre un paisaje de colinas con el sol bajo el horizonte" width="1200" height="500"></picture>${REPORT_SCRIPT}</body></html>`;

function sourceName(pictureSrc: string): string {
  const file = Object.keys(SOURCES).find((f) => pictureSrc.endsWith(f));
  return file ? SOURCES[file] : 'cargando';
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
