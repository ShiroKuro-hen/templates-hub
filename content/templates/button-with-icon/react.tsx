import { useState } from 'react';
import type { ReactNode } from 'react';

type Icon = 'download' | 'next' | 'plus' | 'bell' | 'cart';
type Variant = 'primary' | '' | 'ghost';

const PATHS: Record<Icon, ReactNode> = {
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  next: <path d="m9 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  cart: <><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx="9" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></>,
};
const Svg = ({ name }: { name: Icon }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{PATHS[name]}</svg>
);

type Props = {
  variant?: Variant;
  icon: Icon;
  iconRight?: boolean;
  label: string;
  iconOnly?: boolean; // si es true, label pasa a aria-label y title
  badge?: number;
  onClick?: () => void;
};

export function IconButton({ variant = '', icon, iconRight, label, iconOnly, badge = 0, onClick }: Props) {
  const cls = ['btn', variant, iconOnly && 'icon', iconRight && 'next'].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} onClick={onClick}
      {...(iconOnly ? { 'aria-label': label, title: label } : {})}>
      {!iconRight && <Svg name={icon} />}
      {!iconOnly && label}
      {iconRight && <Svg name={icon} />}
      {badge > 0 && <span className="badge" aria-hidden="true">{badge}</span>}
    </button>
  );
}

export function ButtonsWithIcon() {
  const [avisos, setAvisos] = useState(3);
  const [items, setItems] = useState(0);
  const [msg, setMsg] = useState('Prueba el aviso y el carrito: los contadores se actualizan.');
  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Botones con icono</h2>
      <h3>Icono a la izquierda</h3>
      <div className="row"><IconButton variant="primary" icon="download" label="Descargar informe" /><IconButton icon="plus" label="Nuevo proyecto" /></div>
      <h3>Icono a la derecha</h3>
      <div className="row"><IconButton variant="primary" icon="next" iconRight label="Continuar" /><IconButton variant="ghost" icon="next" iconRight label="Ver detalles" /></div>
      <h3>Solo icono, con etiqueta accesible</h3>
      <div className="row"><IconButton variant="primary" icon="plus" iconOnly label="Crear proyecto" /><IconButton icon="download" iconOnly label="Descargar" /><IconButton variant="ghost" icon="next" iconOnly label="Siguiente" /></div>
      <h3>Con badge</h3>
      <div className="row">
        <IconButton icon="bell" iconOnly badge={avisos} label={avisos ? `Avisos, ${avisos} sin leer` : 'Avisos, sin pendientes'}
          onClick={() => { setAvisos(0); setMsg('Avisos marcados como leídos.'); }} />
        <IconButton icon="cart" iconOnly badge={items} label={`Carrito, ${items} ${items === 1 ? 'producto' : 'productos'}`} />
        <IconButton icon="plus" label="Añadir al carrito" onClick={() => { setItems(items + 1); setMsg(`Producto añadido. Tienes ${items + 1} en el carrito.`); }} />
      </div>
      <p id="msg" role="status">{msg}</p>
    </section>
  );
}
// CSS: copia las reglas .card, .row, .btn (.primary, .ghost, .icon, .next), .badge y #msg de la pestaña HTML + CSS.
