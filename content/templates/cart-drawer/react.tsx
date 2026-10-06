import { useRef, useState } from 'react';

type Line = { id: number; name: string; variant: string; price: number; qty: number };
const DATA: Line[] = [
  { id: 1, name: 'Auriculares Nova ANC', variant: 'Grafito', price: 129.9, qty: 1 },
  { id: 2, name: 'Cable USB-C trenzado', variant: '2 m', price: 14.5, qty: 2 },
  { id: 3, name: 'Funda de viaje rígida', variant: 'Azul noche', price: 24, qty: 1 },
];
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

export function CartDrawer({ initial = DATA, freeShipping = 200 }: { initial?: Line[]; freeShipping?: number }) {
  const [items, setItems] = useState(initial);
  const dlg = useRef<HTMLDialogElement>(null);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const setQty = (id: number, d: number) =>
    setItems((xs) => xs.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const remove = (id: number) => setItems((xs) => xs.filter((i) => i.id !== id));

  return (
    <>
      <button className="btn" type="button" aria-haspopup="dialog" onClick={() => dlg.current?.showModal()}>
        Ver carrito ({count})
      </button>
      <dialog ref={dlg} className="drawer" aria-labelledby="cart-title"
              onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <header>
          <h2 id="cart-title">Tu carrito</h2>
          <button className="close" type="button" aria-label="Cerrar carrito" onClick={() => dlg.current?.close()}>&times;</button>
        </header>
        <div className="shipbox">
          <p className="ship">
            {total >= freeShipping ? 'Tienes envío gratis.' : `Te faltan ${eur(freeShipping - total)} para el envío gratis.`}
          </p>
          <div className="meter" aria-hidden="true"><i style={{ width: `${Math.min(100, (total / freeShipping) * 100)}%` }} /></div>
        </div>
        <ul aria-live="polite">
          {items.length === 0 && <li className="empty">Tu carrito está vacío. Explora el catálogo y añade tu primer producto.</li>}
          {items.map((i) => (
            <li key={i.id}>
              <span className="thumb" aria-hidden="true" />
              <div>
                <div className="name">{i.name}</div>
                <div className="var">{i.variant}</div>
                <div className="qty" role="group" aria-label={`Cantidad de ${i.name}`}>
                  <button type="button" aria-label="Quitar una unidad" onClick={() => setQty(i.id, -1)}>−</button>
                  <output>{i.qty}</output>
                  <button type="button" aria-label="Añadir una unidad" onClick={() => setQty(i.id, 1)}>+</button>
                </div>
              </div>
              <div>
                <div className="sub num">{eur(i.price * i.qty)}</div>
                <button className="rm" type="button" onClick={() => remove(i.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
        <footer>
          <div className="row"><span>Subtotal</span><span className="num">{eur(total)}</span></div>
          <button className="btn primary" type="button">Ir al pago</button>
        </footer>
      </dialog>
    </>
  );
}

// CSS: copia las reglas .btn, .drawer, header, footer, .shipbox, .meter, ul, li, .qty, .rm y .empty de la pestaña HTML + CSS.
