import { useRef, useState } from 'react';

type Props = { name: string; price: number; min?: number; max?: number; onChange?: (qty: number) => void };

export function QuantityStepper({ name, price, min = 1, max = 10, onChange }: Props) {
  const [qty, setQty] = useState(min);
  const [draft, setDraft] = useState(String(min));
  const [clamped, setClamped] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const money = (n: number) => '$' + n.toFixed(2);

  const commit = (n: number, fromButton = false) => {
    const v = Math.min(max, Math.max(min, Math.round(n) || min));
    setClamped(n !== v);
    setQty(v);
    setDraft(String(v));
    onChange?.(v);
    if (fromButton && (v === min || v === max)) input.current?.focus(); // el botón se desactiva: no perder el foco
  };

  return (
    <article className="item">
      <div className="info">
        <h3 id="name">{name}</h3>
        <p>{money(price)} por unidad</p>
      </div>
      <div className="stepper" role="group" aria-labelledby="name">
        <button type="button" aria-label="Quitar una unidad" aria-controls="qty" disabled={qty <= min} onClick={() => commit(qty - 1, true)}>−</button>
        <input ref={input} id="qty" type="number" min={min} max={max} inputMode="numeric" aria-label="Cantidad" aria-describedby="note"
               value={draft} onChange={(e) => setDraft(e.target.value)}
               onBlur={() => commit(draft === '' ? NaN : +draft)} />
        <button type="button" aria-label="Añadir una unidad" aria-controls="qty" disabled={qty >= max} onClick={() => commit(qty + 1, true)}>+</button>
      </div>
      <output className="total" htmlFor="qty" aria-live="polite">{money(qty * price)}</output>
      <p id="note" className={clamped ? 'warn' : undefined}>
        {clamped ? `Ajustamos la cantidad a ${qty}. Puedes pedir entre ${min} y ${max} unidades.` : `Máximo ${max} unidades por pedido.`}
      </p>
    </article>
  );
}

// CSS: copia las reglas .item, .info, .stepper, .total y #note de la pestaña HTML + CSS.
