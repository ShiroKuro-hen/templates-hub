import { useState, type CSSProperties } from 'react';

type Addon = { id: string; nombre: string; detalle: string; precio: number; bloque?: boolean };
type Estado = { on: boolean; qty: number };

const BASE = 24;
const MAX = 10;
const ADDONS: Addon[] = [
  { id: 'soporte', nombre: 'Soporte prioritario', detalle: 'Respuesta en una hora por chat y teléfono', precio: 9 },
  { id: 'almacen', nombre: 'Almacenamiento extra', detalle: 'Bloques de 100 GB', precio: 4, bloque: true },
  { id: 'auditoria', nombre: 'Registro de auditoría', detalle: 'Historial completo de accesos', precio: 6 },
  { id: 'correo', nombre: 'Correo con tu dominio', detalle: 'Buzones ilimitados', precio: 3 },
  { id: 'copias', nombre: 'Copias cada hora', detalle: 'Restauración en un clic', precio: 5 },
];
const INICIAL: Record<string, Estado> = {
  soporte: { on: true, qty: 1 },
  almacen: { on: true, qty: 2 },
  auditoria: { on: true, qty: 1 },
  correo: { on: false, qty: 1 },
  copias: { on: false, qty: 1 },
};
const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

function Linea({ nombre, importe, className }: { nombre: string; importe: number; className?: string }) {
  return (
    <div className={className}>
      <dt>{nombre}</dt>
      <dd>{eur.format(importe)}</dd>
    </div>
  );
}

export function AddonsCalculator() {
  const [sel, setSel] = useState<Record<string, Estado>>(INICIAL);
  const cambiar = (id: string, cambio: Partial<Estado>) =>
    setSel((s) => ({ ...s, [id]: { ...s[id], ...cambio } }));

  const activos = ADDONS.filter((a) => sel[a.id].on).map((a) => ({
    ...a,
    cantidad: sel[a.id].qty,
    importe: a.precio * sel[a.id].qty,
  }));
  const complementos = activos.reduce((s, a) => s + a.importe, 0);
  const subtotal = BASE + complementos;
  const descuento = activos.length >= 3 ? complementos * 0.1 : 0;
  const total = subtotal - descuento;

  return (
    <main className="shop">
      <article className="plan" aria-labelledby="plan-t">
        <header className="plan-head">
          <p className="eyebrow">Plan elegido</p>
          <h2 id="plan-t">Equipo</h2>
          <p className="desc">Para equipos que trabajan a diario en el mismo espacio.</p>
          <p className="base"><strong>24 €</strong> al mes, hasta 10 personas</p>
        </header>
        <ul className="incl">
          <li>Proyectos ilimitados</li>
          <li>20 GB de almacenamiento</li>
          <li>Informes y automatizaciones</li>
        </ul>
        <fieldset className="addons">
          <legend>Complementos opcionales</legend>
          {ADDONS.map((a) => {
            const estado = sel[a.id];
            return (
              <div key={a.id} className="addon">
                <label className="pick">
                  <input type="checkbox" checked={estado.on} onChange={(e) => cambiar(a.id, { on: e.target.checked })} />
                  <span className="txt">
                    <b>{a.nombre}</b>
                    <small>{a.detalle}</small>
                  </span>
                </label>
                <span className="pr">
                  {eur.format(a.precio)} <span>/mes</span>
                </span>
                {a.bloque && (
                  <div className="step" role="group" aria-label="Bloques de 100 GB">
                    <button
                      type="button"
                      aria-label="Quitar un bloque de 100 GB"
                      disabled={!estado.on || estado.qty === 1}
                      onClick={() => cambiar(a.id, { qty: estado.qty - 1 })}
                    >
                      −
                    </button>
                    <span className="qty">{estado.qty}</span>
                    <button
                      type="button"
                      aria-label="Añadir un bloque de 100 GB"
                      disabled={!estado.on || estado.qty === MAX}
                      onClick={() => cambiar(a.id, { qty: estado.qty + 1 })}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>
      </article>

      <aside className="sum" aria-labelledby="sum-t">
        <h2 id="sum-t">Resumen del pedido</h2>
        <dl>
          <Linea nombre="Plan Equipo" importe={BASE} />
          {activos.map((a) => (
            <Linea key={a.id} nombre={a.cantidad > 1 ? `${a.nombre} × ${a.cantidad}` : a.nombre} importe={a.importe} />
          ))}
          <Linea nombre="Subtotal" importe={subtotal} className="sub" />
          {descuento > 0 && <Linea nombre="Descuento 10 % (3 o más complementos)" importe={-descuento} />}
        </dl>
        <p className="total">
          <span>Total al mes</span>
          <output>{eur.format(total)}</output>
        </p>
        <button type="button" className="buy">Contratar Equipo</button>
        <p className="note">IVA no incluido. Cancela cuando quieras.</p>
      </aside>
    </main>
  );
}
// CSS: copia los tokens :root y las reglas .shop, .plan/.sum, .plan-head, .eyebrow, h2, .desc, .base, .incl, .addons/legend, .addon (:has checked), .pick, .txt, .pr, .step (button, :disabled), .qty, dl/dt/dd, .sub, .total, .buy, .note y la media query de la pestaña HTML + CSS.
