import { useEffect, useRef, useState } from 'react';

type Estado = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado' | 'reembolsado';
type Transicion = { id: string; de: Estado; a: Estado; texto: string; d: string; lx: number; ly: number; izq?: boolean };

const NOMBRES: Record<Estado, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  reembolsado: 'Reembolsado',
};
const ESTADOS: { id: Estado; cx: number; cy: number }[] = [
  { id: 'pendiente', cx: 80, cy: 70 },
  { id: 'pagado', cx: 260, cy: 70 },
  { id: 'enviado', cx: 440, cy: 70 },
  { id: 'entregado', cx: 620, cy: 70 },
  { id: 'cancelado', cx: 80, cy: 210 },
  { id: 'reembolsado', cx: 440, cy: 210 },
];
const TRANSICIONES: Transicion[] = [
  { id: 'pagar', de: 'pendiente', a: 'pagado', texto: 'Pagar', d: 'M138 70H202', lx: 170, ly: 60 },
  { id: 'cancelar', de: 'pendiente', a: 'cancelado', texto: 'Cancelar', d: 'M80 92V188', lx: 92, ly: 144, izq: true },
  { id: 'enviar', de: 'pagado', a: 'enviado', texto: 'Enviar', d: 'M318 70H382', lx: 350, ly: 60 },
  { id: 'reembolsar', de: 'pagado', a: 'reembolsado', texto: 'Reembolsar', d: 'M260 92V210H382', lx: 321, ly: 200 },
  { id: 'entregar', de: 'enviado', a: 'entregado', texto: 'Entregar', d: 'M498 70H562', lx: 530, ly: 60 },
  { id: 'devolver', de: 'entregado', a: 'reembolsado', texto: 'Devolver', d: 'M620 92V210H498', lx: 559, ly: 200 },
];
const INICIAL: Estado = 'pendiente';

export function MaquinaEstados() {
  const [actual, setActual] = useState<Estado>(INICIAL);
  const [ultima, setUltima] = useState<string | null>(null);
  const [aviso, setAviso] = useState(`Pedido creado en estado ${NOMBRES[INICIAL]}.`);
  const [enfocar, setEnfocar] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const reiniciarRef = useRef<HTMLButtonElement>(null);
  const permitidas = TRANSICIONES.filter((t) => t.de === actual);

  useEffect(() => {
    if (!enfocar) return;
    (contenedor.current?.querySelector('button') ?? reiniciarRef.current)?.focus();
    setEnfocar(false);
  }, [enfocar, actual]);

  const mover = (t: Transicion) => {
    setActual(t.a);
    setUltima(t.id);
    setEnfocar(true);
    const final = TRANSICIONES.every((x) => x.de !== t.a);
    setAviso(`Pedido pasado de ${NOMBRES[t.de]} a ${NOMBRES[t.a]}.${final ? ' Es un estado final.' : ''}`);
  };
  const reiniciar = () => {
    setActual(INICIAL);
    setUltima(null);
    setAviso(`Pedido reiniciado en estado ${NOMBRES[INICIAL]}.`);
  };

  return (
    <figure className="card">
      <figcaption>
        <h2>Estados de un pedido</h2>
        <p>Desde el estado actual solo se ofrecen los cambios permitidos.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Diagrama de estados desplazable horizontalmente">
        <svg viewBox="0 0 700 260" role="img" aria-labelledby="sm-t sm-d">
          <title id="sm-t">Estados de un pedido</title>
          <desc id="sm-d">Un pedido pasa de Pendiente a Pagado o a Cancelado. Pagado pasa a Enviado o a Reembolsado, Enviado pasa a Entregado y Entregado puede pasar a Reembolsado. Cancelado y Reembolsado son estados finales.</desc>
          <defs>
            <marker id="fl" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="head" d="M0 0L9 5L0 10z" /></marker>
            <marker id="fl-hot" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="head hot" d="M0 0L9 5L0 10z" /></marker>
          </defs>
          {TRANSICIONES.map((t) => (
            <path key={t.id} className={t.id === ultima ? 'edge taken' : 'edge'} d={t.d} />
          ))}
          {TRANSICIONES.map((t) => (
            <text key={`etiqueta-${t.id}`} className={t.izq ? 'lbl left' : 'lbl'} x={t.lx} y={t.ly}>{t.texto}</text>
          ))}
          {ESTADOS.map((e) => (
            <g key={e.id} className={e.id === actual ? 'state on' : 'state'}>
              <rect className="box" x={e.cx - 58} y={e.cy - 22} width={116} height={44} rx={6} />
              <text x={e.cx} y={e.cy}>{NOMBRES[e.id]}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="estado">Estado actual: <strong>{NOMBRES[actual]}</strong></p>
      <div className="acciones">
        <div ref={contenedor} className="transiciones" role="group" aria-label="Transiciones disponibles">
          {permitidas.map((t) => (
            <button key={t.id} type="button" onClick={() => mover(t)}>{t.texto}</button>
          ))}
        </div>
        <button ref={reiniciarRef} type="button" className="reiniciar" onClick={reiniciar}>Reiniciar</button>
      </div>
      <p className="live" aria-live="polite">{aviso}</p>
    </figure>
  );
}

// CSS: copia las reglas de body, .card, h2, .scroll, text, .lbl, .box, .state, .edge, .head, .estado, .acciones, .transiciones, button, .reiniciar y .live de la pestaña HTML + CSS.
