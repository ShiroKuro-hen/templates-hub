import { useState } from 'react';

export type Ventaja = { texto: string; incluida?: boolean };
type Props = {
  nombre: string;
  precio: number;
  ventajas: Ventaja[];
  destacado?: boolean;
  cta?: string;
  onElegir?: (nombre: string) => void;
};

export function PricingCard({ nombre, precio, ventajas, destacado = false, cta = `Elegir ${nombre}`, onElegir }: Props) {
  const [elegido, setElegido] = useState(false);

  return (
    <article className={`plan${destacado ? ' hot' : ''}`}>
      {destacado && <span className="badge">Recomendado</span>}
      <h2>{nombre}</h2>
      <p className="price">${precio} <small>/mes</small></p>
      <ul>
        {ventajas.map((v) => (
          <li key={v.texto} className={v.incluida === false ? 'no' : undefined}>{v.texto}</li>
        ))}
      </ul>
      <button
        type="button"
        aria-pressed={elegido}
        onClick={() => { setElegido(!elegido); onElegir?.(nombre); }}
      >
        {elegido ? 'Plan elegido' : cta}
      </button>
      <p role="status" className="sr">{elegido ? `Elegiste el plan ${nombre}.` : ''}</p>
    </article>
  );
}
// CSS: copia las reglas .plan / .hot / .badge / .price / .plan ul li (✓ y .no con ✕) / button / .sr (visually-hidden) de la pestaña HTML + CSS.
