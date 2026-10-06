import { useState, type FormEvent } from 'react';

const ITEMS = [
  { name: 'Zapatillas Aero Run', detail: 'Talla 42, 1 unidad', cents: 8990 },
  { name: 'Calcetines técnicos', detail: 'Pack de 3, 2 unidades', cents: 2580 },
  { name: 'Mochila Urban 20 L', detail: 'Gris, 1 unidad', cents: 3900 },
];
const CODES: Record<string, { label: string; off: (s: number) => number }> = {
  ION10: { label: '10 %', off: (s) => Math.round(s * 0.1) },
  BIENVENIDA: { label: '15 €', off: () => 1500 },
};
const FREE_FROM = 15000, SHIP = 690;
const eur = (c: number) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

export function OrderSummary() {
  const [code, setCode] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState<{ text: string; kind: '' | 'ok' | 'err' }>({ text: '', kind: '' });

  const sub = ITEMS.reduce((s, i) => s + i.cents, 0);
  const off = code ? CODES[code].off(sub) : 0;
  const ship = sub - off >= FREE_FROM ? 0 : SHIP;
  const total = sub - off + ship;

  function apply(e: FormEvent) {
    e.preventDefault();
    const v = value.trim().toUpperCase();
    if (!v) return setMsg({ text: 'Escribe un código. Por ejemplo, ION10.', kind: 'err' });
    if (!CODES[v]) return setMsg({ text: `El código ${v} no existe o ha caducado. Revisa que esté bien escrito.`, kind: 'err' });
    setCode(v);
    setMsg({ text: `Código aplicado: ${CODES[v].label} de descuento.`, kind: 'ok' });
  }

  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Resumen del pedido</h2>
      <ul>
        {ITEMS.map((i) => (
          <li key={i.name}><span>{i.name}<small>{i.detail}</small></span><span className="num">{eur(i.cents)}</span></li>
        ))}
      </ul>
      <form noValidate onSubmit={apply}>
        <label htmlFor="code">Código de descuento</label>
        <div className="row">
          <input id="code" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)}
                 aria-describedby="msg" aria-invalid={msg.kind === 'err'} />
          <button type="submit">Aplicar</button>
        </div>
        <p className={`msg ${msg.kind}`} id="msg" role="status">{msg.text}</p>
      </form>
      <dl>
        <dt>Subtotal</dt><dd>{eur(sub)}</dd>
        {code && (
          <>
            <dt className="save">Descuento {code}
              <button className="ghost" type="button" onClick={() => { setCode(null); setValue(''); setMsg({ text: 'Código eliminado.', kind: '' }); }}>Quitar</button>
            </dt>
            <dd className="save">−{eur(off)}</dd>
          </>
        )}
        <dt>Envío</dt><dd>{ship ? eur(ship) : 'Gratis'}</dd>
        <dt>IVA incluido</dt><dd>{eur(Math.round((total * 21) / 121))}</dd>
      </dl>
      <div className="total"><span>Total</span><output>{eur(total)}</output></div>
      <div className="bar" aria-hidden="true" />
    </section>
  );
}

// CSS: copia las reglas .card, ul, li, .row, input, button, .msg, dl, .save, .total, .bar y .ghost de la pestaña HTML + CSS.
