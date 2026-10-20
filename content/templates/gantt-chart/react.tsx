import { useState } from 'react';

type Tarea = { id: string; nombre: string; inicio: number; dur: number; pct: number; fechas: string };
type Dep = { de: string; a: string; d: string };

const TAREAS: Tarea[] = [
  { id: 'req', nombre: 'Requisitos', inicio: 0, dur: 6, pct: 100, fechas: '14 sep – 19 sep' },
  { id: 'diseno', nombre: 'Diseño UX', inicio: 8, dur: 6, pct: 100, fechas: '22 sep – 27 sep' },
  { id: 'api', nombre: 'API del backend', inicio: 16, dur: 14, pct: 60, fechas: '30 sep – 13 oct' },
  { id: 'web', nombre: 'Interfaz web', inicio: 16, dur: 12, pct: 45, fechas: '30 sep – 11 oct' },
  { id: 'pruebas', nombre: 'Pruebas de QA', inicio: 32, dur: 6, pct: 20, fechas: '16 oct – 21 oct' },
  { id: 'lanza', nombre: 'Lanzamiento', inicio: 40, dur: 2, pct: 0, fechas: '24 oct – 25 oct' },
];
const DEPS: Dep[] = [
  { de: 'req', a: 'diseno', d: 'M302 64H314V104H326' },
  { de: 'diseno', a: 'api', d: 'M398 104H410V144H422' },
  { de: 'diseno', a: 'web', d: 'M398 104H410V184H422' },
  { de: 'api', a: 'pruebas', d: 'M590 144H602V224H614' },
  { de: 'web', a: 'pruebas', d: 'M566 184H578V224H614' },
  { de: 'pruebas', a: 'lanza', d: 'M686 224H698V264H710' },
];
const SEMANAS: [number, string][] = [[234, '14 sep'], [318, '21 sep'], [402, '28 sep'], [486, '5 oct'], [570, '12 oct'], [654, '19 oct']];

const X0 = 230, DIA = 12, FILA = 40, Y0 = 44, BARRA = 22, ANCHO = 760, TIP_W = 250, TIP_H = 44;
const barX = (t: Tarea) => X0 + t.inicio * DIA;
const barY = (i: number) => Y0 + i * FILA + 9;
const enlazados = (id: string) =>
  new Set([id, ...DEPS.filter((d) => d.de === id || d.a === id).flatMap((d) => [d.de, d.a])]);

export function GanttChart() {
  const [foco, setFoco] = useState<string | null>(null);
  const tarea = TAREAS.find((t) => t.id === foco);
  const cercanos = foco ? enlazados(foco) : new Set<string>();
  const cls = (id: string, base: string) => (cercanos.has(id) ? `${base} on` : base);
  const conecta = (dep: Dep) => dep.de === foco || dep.a === foco;

  const i = tarea ? TAREAS.indexOf(tarea) : 0;
  const tipX = tarea ? Math.min(Math.max(barX(tarea), 8), ANCHO - 8 - TIP_W) : 0;
  const arriba = barY(i) - TIP_H - 8;
  const tipY = arriba >= 30 ? arriba : barY(i) + BARRA + 8;

  return (
    <figure className="card">
      <figcaption>
        <h2>Cronograma del proyecto</h2>
        <p>Seis semanas de trabajo. Pasa el ratón o enfoca una tarea para ver sus fechas y su avance.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Cronograma desplazable horizontalmente">
      <svg id="gantt" className={foco ? 'active' : undefined} viewBox="0 0 760 350" role="img" aria-labelledby="gantt-t gantt-d" onPointerLeave={() => setFoco(null)}>
        <title id="gantt-t">Cronograma del proyecto de seis semanas</title>
        <desc id="gantt-d">Seis tareas del 14 de septiembre al 25 de octubre: requisitos, diseño UX, API del backend, interfaz web, pruebas de QA y lanzamiento. Las flechas indican dependencias y la línea discontinua marca hoy, 20 de octubre.</desc>
        <defs>
          <marker id="ah" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="arrow" d="M0 0L9 5L0 10z" /></marker>
          <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="arrow hot" d="M0 0L9 5L0 10z" /></marker>
        </defs>
        <text className="head" x={12} y={24}>Tarea</text>
        {SEMANAS.map(([x, texto]) => (
          <text key={texto} className="head" x={x} y={24}>{texto}</text>
        ))}
        <path className="grid" d="M230 32V284M314 32V284M398 32V284M482 32V284M566 32V284M650 32V284M734 32V284" />
        {DEPS.map((dep) => (
          <path key={`${dep.de}-${dep.a}`} className={conecta(dep) ? 'dep hot' : 'dep'} data-de={dep.de} data-a={dep.a} d={dep.d} />
        ))}
        {TAREAS.map((t, fila) => (
          <g key={t.id}>
            <text className={cls(t.id, 'task')} data-id={t.id} x={12} y={barY(fila) + 15}>{t.nombre}</text>
            <g className={cls(t.id, 'bar')} data-id={t.id} tabIndex={0} role="group"
               aria-label={`${t.nombre}, del ${t.fechas}, ${t.pct} % completado`}
               onPointerOver={() => setFoco(t.id)} onFocus={() => setFoco(t.id)} onBlur={() => setFoco(null)}>
              <rect className="base" x={barX(t)} y={barY(fila)} width={t.dur * DIA} height={BARRA} rx={6} />
              <rect className="done" x={barX(t)} y={barY(fila)} width={(t.dur * DIA * t.pct) / 100} height={BARRA} rx={6} />
            </g>
          </g>
        ))}
        <line className="hoy" x1={668} x2={668} y1={32} y2={284} />
        <text className="hoy-txt" x={668} y={300} textAnchor="middle">Hoy · 20 oct</text>
        <g className={foco ? 'tip show' : 'tip'} transform={`translate(${tipX} ${tipY})`} aria-hidden="true">
          <rect width={TIP_W} height={TIP_H} rx={6} />
          <text className="tip-name" x={12} y={18}>{tarea?.nombre}</text>
          <text className="tip-info" x={12} y={36}>{tarea && `${tarea.fechas} · ${tarea.pct} % completado`}</text>
        </g>
        <rect className="done" x={12} y={320} width={14} height={10} rx={3} />
        <text className="leyenda" x={32} y={329}>Progreso</text>
        <rect className="base" x={120} y={320} width={14} height={10} rx={3} />
        <text className="leyenda" x={140} y={329}>Pendiente</text>
        <path className="dep" d="M216 325H236" />
        <text className="leyenda" x={244} y={329}>Dependencia</text>
        <line className="hoy" x1={340} x2={340} y1={318} y2={332} />
        <text className="leyenda" x={348} y={329}>Hoy</text>
      </svg>
      </div>
    </figure>
  );
}

// CSS: copia las reglas .card, h2, p, svg, .scroll, .grid, .head, .task, .bar, .base, .done, .dep, .arrow, .hoy, .tip y .active de la pestaña HTML + CSS.
