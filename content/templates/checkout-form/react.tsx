import { useState, type FormEvent } from 'react';

type Status = { ok: boolean; text: string } | null;
type Field = HTMLInputElement | HTMLSelectElement;
const METHODS = [['card', 'Tarjeta'], ['paypal', 'PayPal'], ['bizum', 'Bizum']] as const;

export function CheckoutForm({ total = '187,85 €' }: { total?: string }) {
  const [method, setMethod] = useState('card');
  const [status, setStatus] = useState<Status>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const bad = ([...e.currentTarget.elements] as Field[]).filter((el) => el.willValidate && !el.checkValidity());
    bad.forEach((el) => { el.style.borderColor = 'var(--err)'; });
    bad[0]?.focus();
    setStatus(bad.length
      ? { ok: false, text: `Revisa ${bad.length} campo${bad.length > 1 ? 's' : ''} marcado${bad.length > 1 ? 's' : ''} en rojo para completar el pago.` }
      : { ok: true, text: 'Pedido confirmado. Te hemos enviado el recibo por correo.' });
  }
  const clear = (e: FormEvent) => { const el = e.target as Field; if (el.checkValidity()) el.style.borderColor = ''; };

  return (
    <form className="checkout" noValidate onSubmit={submit} onInput={clear}>
      <div className="card">
        <fieldset>
          <legend>Contacto</legend>
          <label>Correo electrónico<input type="email" name="email" autoComplete="email" required />
            <span className="hint">Te enviaremos aquí la confirmación del pedido.</span></label>
        </fieldset>
        <fieldset>
          <legend>Dirección de envío</legend>
          <div className="grid">
            <label>Nombre completo<input name="name" autoComplete="name" required /></label>
            <label>Teléfono<input type="tel" name="tel" autoComplete="tel" required /></label>
            <label style={{ gridColumn: '1/-1' }}>Dirección<input name="address" autoComplete="street-address" required /></label>
            <label>Código postal<input name="zip" autoComplete="postal-code" inputMode="numeric" pattern="\d{5}" required />
              <span className="hint">5 dígitos, por ejemplo 28013.</span></label>
            <label>Provincia<select name="region" autoComplete="address-level1">
              {['Madrid', 'Barcelona', 'Valencia', 'Sevilla'].map((r) => <option key={r}>{r}</option>)}</select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Método de pago</legend>
          <div className="methods">
            {METHODS.map(([v, label]) => (
              <label key={v} className="method">
                <input type="radio" name="method" value={v} checked={method === v} onChange={() => setMethod(v)} /> {label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset disabled={method !== 'card'}>
          <legend>Datos de la tarjeta</legend>
          <div className="grid">
            <label style={{ gridColumn: '1/-1' }}>Número de tarjeta<input name="cc" autoComplete="cc-number" inputMode="numeric" pattern="[\d ]{15,19}" required />
              <span className="hint">Entre 15 y 16 dígitos, sin guiones.</span></label>
            <label>Caducidad<input name="exp" autoComplete="cc-exp" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])\/\d{2}" required /></label>
            <label>CVC<input name="cvc" autoComplete="cc-csc" inputMode="numeric" pattern="\d{3,4}" required /></label>
          </div>
        </fieldset>
      </div>
      <aside className="card summary" aria-labelledby="sum-title">
        <h2 id="sum-title">Resumen</h2>
        <dl>
          <dt>Subtotal (3 artículos)</dt><dd>182,90 €</dd>
          <dt>Envío estándar</dt><dd>4,95 €</dd>
          <dt>IVA incluido</dt><dd>31,74 €</dd>
          <dt className="total">Total</dt><dd className="total">{total}</dd>
        </dl>
        <button className="pay" type="submit">Pagar {total}</button>
        <p className="note">Pago cifrado. Puedes cancelar el pedido durante 24 horas.</p>
        {status && <p className={status.ok ? 'status' : 'status err'} role="status">{status.text}</p>}
      </aside>
    </form>
  );
}

// CSS: copia las reglas .checkout, .card, fieldset, .grid, label, input, .methods, .method, .summary, dl, .pay y .status de la pestaña HTML + CSS.
