import { useRef, useState } from 'react';

const BASE = 249;
const COLORES = [['k1', 'Grafito'], ['k2', 'Azul ultramar'], ['k3', 'Niebla']] as const;
const VISTAS = ['Vista frontal', 'Detalle del auricular', 'Vista en ángulo'];
const TABS = [
  ['Descripción', 'Diseñados para concentrarte donde estés. La cancelación adaptativa ajusta el nivel de ruido 48.000 veces por segundo y el modo de conversación pausa la música cuando hablas.'],
  ['Especificaciones', 'Batería de 40 horas, Bluetooth 5.4 y cable USB-C, 254 g, 6 micrófonos con reducción de viento.'],
  ['Envíos y devoluciones', 'Enviamos en 24 horas hábiles. Si no te convencen, devuélvelos en 30 días y te reembolsamos el total, sin preguntas.'],
];
const fmt = (n: number) => 'US$ ' + n.toFixed(2).replace('.', ',');
const Hp = () => <svg viewBox="0 0 200 200"><use href="#hp" /></svg>; // <symbol id="hp"> como en la pestaña HTML

export function ProductDetail() {
  const [vista, setVista] = useState(0);
  const [color, setColor] = useState(0);
  const [estuche, setEstuche] = useState(false);
  const [fav, setFav] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = BASE + (estuche ? 29 : 0);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!k) return;
    const n = (i + k + TABS.length) % TABS.length;
    setTab(n); refs.current[n]?.focus();
  };

  return (
    <div className="page">
      <div className={`pd c${color + 1}`}>
        <section className={`gal v${vista + 1}`} aria-label="Galería del producto">
          <div className="stage" role="img" aria-label="Auriculares Nimbo Air"><Hp /></div>
          <div className="thumbs" role="radiogroup" aria-label="Vistas del producto">
            {VISTAS.map((v, i) => (
              <label key={v}>
                <input type="radio" name="g" checked={vista === i} onChange={() => setVista(i)} />
                <span className="sr">{v}</span><Hp />
              </label>
            ))}
          </div>
        </section>
        <section aria-labelledby="t">
          <div className="rate"><span className="stars" role="img" aria-label="4,7 de 5 estrellas">★★★★★</span><span>4,7</span><a href="#">1.284 reseñas</a></div>
          <h1 id="t">Auriculares Nimbo Air</h1>
          <p className="sub">Cancelación de ruido adaptativa y 40 horas de batería.</p>
          <div className="price"><output aria-live="polite">{fmt(total)}</output><small>o 4 cuotas de {fmt(total / 4)} sin intereses</small></div>
          <fieldset className="sw">
            <legend>Color: <b>{COLORES[color][1]}</b></legend>
            {COLORES.map(([k, n], i) => (
              <label key={k} className={k}>
                <input type="radio" name="c" checked={color === i} onChange={() => setColor(i)} /><span className="sr">{n}</span>
              </label>
            ))}
          </fieldset>
          <label className="extra"><input type="checkbox" checked={estuche} onChange={(e) => setEstuche(e.target.checked)} />Añadir estuche de viaje<span>+ US$ 29,00</span></label>
          <span className="stock">En stock: llega el viernes 9 de octubre</span>
          <div className="btns">
            <button className="btn pri" type="button" onClick={() => setMsg(`Añadido al carrito: Nimbo Air, ${COLORES[color][1]}.`)}>Añadir al carrito</button>
            <button className="btn" type="button" aria-pressed={fav} onClick={() => setFav(!fav)}>{fav ? 'Guardado en favoritos' : 'Guardar en favoritos'}</button>
          </div>
          <p className="msg" role="status">{msg}</p>
          <ul className="perks"><li>Envío gratis en pedidos desde US$ 100</li><li>Devolución sin costo durante 30 días</li><li>Garantía de 2 años</li></ul>
        </section>
      </div>
      <section className="tabs" aria-label="Más información">
        <div role="tablist" aria-label="Información del producto">
          {TABS.map(([t], i) => (
            <button key={t} ref={(el) => { refs.current[i] = el; }} role="tab" id={`t${i}`} aria-controls={`p${i}`}
              aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={(e) => onKey(e, i)}>{t}</button>
          ))}
        </div>
        {TABS.map(([t, txt], i) => (
          <div key={t} role="tabpanel" id={`p${i}`} aria-labelledby={`t${i}`} tabIndex={0} hidden={tab !== i}><p>{txt}</p></div>
        ))}
      </section>
    </div>
  );
}
// CSS: copia las reglas .pd, .stage, .thumbs, .sw, .extra, .btn, .tabs y [role=tab] de la pestaña HTML + CSS (sustituye :has(#g2:checked) por .v2/.v3 y :has(#c2:checked) por .c2/.c3).
