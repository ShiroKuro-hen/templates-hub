import { useState } from 'react';

const ITEMS = [{ n: 'Auriculares Nimbo Air', d: 'Grafito, cantidad 1', p: 249 }, { n: 'Estuche de viaje', d: 'Cantidad 1', p: 29 }];
const ENVIOS = [{ n: 'Estándar', d: 'Llega en 3 a 5 días hábiles', c: 0 }, { n: 'Express', d: 'Llega en 1 a 2 días hábiles', c: 12 }];
const fmt = (n: number) => 'US$ ' + n.toFixed(2).replace('.', ',');
const Hp = () => <svg viewBox="0 0 200 200" aria-hidden="true"><use href="#hp" /></svg>; // <symbol id="hp"> como en la pestaña HTML

export function CheckoutPage() {
  const [envio, setEnvio] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [promo, setPromo] = useState(false);
  const [aviso, setAviso] = useState('');
  const [cc, setCc] = useState('');
  const [ex, setEx] = useState('');
  const [email, setEmail] = useState('');
  const [pagado, setPagado] = useState(false);

  const sub = ITEMS.reduce((s, i) => s + i.p, 0);
  const desc = promo ? sub * 0.1 : 0;
  const costo = ENVIOS[envio].c;
  const imp = (sub - desc) * 0.18;
  const total = sub - desc + costo + imp;

  const aplicar = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = codigo.trim().toUpperCase() === 'NIMBO10';
    setPromo(ok);
    setAviso(ok ? 'Código NIMBO10 aplicado: 10 % de descuento.' : 'El código no es válido. Revisa que esté bien escrito.');
  };

  return (
    <div className="page">
      <header className="top">
        <a className="brand" href="#" aria-label="Nimbo, inicio"><i />Nimbo</a>
        <nav aria-label="Pasos de compra"><ol className="steps"><li><a href="#">Carrito</a></li><li aria-current="step">Envío y pago</li><li>Confirmación</li></ol></nav>
      </header>
      <div className="co">
        <form aria-label="Datos de compra" onSubmit={(e) => { e.preventDefault(); setPagado(true); }}>
          <fieldset className="box"><legend>Contacto</legend>
            <label className="f">Correo electrónico
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="nombre@empresa.com" required />
              <span className="err">Escribe un correo válido, por ejemplo nombre@empresa.com.</span>
            </label>
          </fieldset>
          <fieldset className="box"><legend>Dirección de envío</legend>
            <div className="row"><label className="f">Nombre<input autoComplete="given-name" required /></label><label className="f">Apellidos<input autoComplete="family-name" required /></label></div>
            <div className="row"><label className="f">Dirección<input autoComplete="street-address" placeholder="Calle y número" required /></label></div>
            <div className="row">
              <label className="f">Ciudad<input autoComplete="address-level2" required /></label>
              <label className="f">País<select autoComplete="country"><option>Perú</option><option>Chile</option><option>Colombia</option><option>México</option></select></label>
              <label className="f">Código postal<input autoComplete="postal-code" inputMode="numeric" required /></label>
            </div>
          </fieldset>
          <fieldset className="box"><legend>Método de envío</legend>
            {ENVIOS.map((o, i) => (
              <label className="opt" key={o.n}>
                <input type="radio" name="envio" checked={envio === i} onChange={() => setEnvio(i)} />
                <span>{o.n}<small>{o.d}</small></span><b>{o.c ? fmt(o.c) : 'Gratis'}</b>
              </label>
            ))}
          </fieldset>
          <fieldset className="box"><legend>Pago con tarjeta</legend>
            <div className="row"><label className="f">Número de tarjeta
              <input value={cc} onChange={(e) => setCc(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))}
                inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" pattern="\d{4} \d{4} \d{4} \d{4}" required />
              <span className="err">Escribe los 16 dígitos de tu tarjeta.</span></label></div>
            <div className="row">
              <label className="f">Vence<input value={ex} onChange={(e) => setEx(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/'))}
                inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/\d{2}" required /></label>
              <label className="f">CVC<input inputMode="numeric" autoComplete="cc-csc" maxLength={4} pattern="\d{3,4}" required /></label>
            </div>
          </fieldset>
          <button className="btn pri" type="submit" disabled={pagado}>Pagar {fmt(total)}</button>
          <p className="note">Pago seguro. Tus datos viajan cifrados y no guardamos tu tarjeta.</p>
          <p id="ok" role="status">{pagado && `Pago recibido. Enviamos el recibo a ${email}.`}</p>
        </form>
        <aside className="box" aria-labelledby="rs">
          <h2 id="rs">Resumen del pedido</h2>
          {ITEMS.map((i) => <div className="it" key={i.n}><Hp /><div>{i.n}<small>{i.d}</small></div><b>{fmt(i.p)}</b></div>)}
          <form className="promo" onSubmit={aplicar}>
            <input aria-label="Código de descuento" placeholder="Código de descuento" autoComplete="off" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <button className="btn" type="submit">Aplicar</button>
          </form>
          <p id="pm" role="status">{aviso}</p>
          <dl>
            <dt>Subtotal</dt><dd>{fmt(sub)}</dd>
            <dt>Descuento</dt><dd>{promo ? '− ' : ''}{fmt(desc)}</dd>
            <dt>Envío</dt><dd>{costo ? fmt(costo) : 'Gratis'}</dd>
            <dt>Impuestos (18 %)</dt><dd>{fmt(imp)}</dd>
            <dt className="tot">Total</dt><dd className="tot">{fmt(total)}</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}
// CSS: copia las reglas .page, .top, .co, .box, legend, .row, .f, input, .err, .opt, .btn, aside, .it, .promo y dl de la pestaña HTML + CSS.
