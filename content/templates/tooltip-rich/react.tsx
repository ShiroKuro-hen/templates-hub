import { useEffect } from 'react';
import type { SyntheticEvent } from 'react';

type Ayuda = { id: string; campo: string; valor: string; titulo: string; texto: string; accion: string; href: string };

const AYUDAS: Ayuda[] = [
  { id: 'retencion', campo: 'Retención de datos', valor: '90 días', titulo: 'Retención de 90 días',
    texto: 'Los registros se eliminan al cumplirse 90 días. Exporta antes los que necesites conservar.', accion: 'Ver política', href: '#politica' },
  { id: 'sso', campo: 'Acceso con SSO', valor: 'Desactivado', titulo: 'Inicio de sesión único',
    texto: 'Tu equipo entra con la cuenta de la empresa. Necesitas el plan Business y un proveedor SAML.', accion: 'Configurar SSO', href: '#sso' },
];

function colocar(e: SyntheticEvent<HTMLDivElement>, id: string) {
  const p = e.currentTarget;
  if (!p.matches(':popover-open')) return;
  const b = document.querySelector(`[popovertarget=${id}]`)!.getBoundingClientRect();
  p.style.left = `${Math.max(8, Math.min(b.left + b.width / 2 - p.offsetWidth / 2, innerWidth - p.offsetWidth - 8))}px`;
  p.style.top = `${b.bottom + 8 + p.offsetHeight < innerHeight ? b.bottom + 8 : Math.max(8, b.top - 8 - p.offsetHeight)}px`;
}

export function PoliticasConAyuda({ ayudas = AYUDAS }: { ayudas?: Ayuda[] }) {
  useEffect(() => { // el popover sigue fijo: lo cerramos al hacer scroll
    const cerrar = () => document.querySelectorAll<HTMLElement>(':popover-open').forEach((p) => p.hidePopover());
    addEventListener('scroll', cerrar, true);
    return () => removeEventListener('scroll', cerrar, true);
  }, []);

  return (
    <section className="card" aria-labelledby="tr-titulo">
      <h2 id="tr-titulo">Políticas del espacio</h2>
      {ayudas.map((a) => (
        <div className="row" key={a.id}>
          <div className="name">
            {a.campo}
            <button className="help" type="button" popoverTarget={a.id} aria-label={`Más información sobre ${a.campo}`}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M6.2 6.2a1.9 1.9 0 1 1 2.6 1.8c-.5.3-.8.6-.8 1.2M8 11.4v.1" /></svg>
            </button>
            <div id={a.id} className="tip" popover="auto" role="dialog" aria-labelledby={`${a.id}-t`} onToggle={(e) => colocar(e, a.id)}>
              <h3 id={`${a.id}-t`}>{a.titulo}</h3>
              <p>{a.texto}</p>
              <div className="acts">
                <a href={a.href}>{a.accion}</a>
                <button type="button" popoverTarget={a.id} popoverTargetAction="hide">Entendido</button>
              </div>
            </div>
          </div>
          <span className="val">{a.valor}</span>
        </div>
      ))}
    </section>
  );
}

// CSS: copia las reglas .card, .row, .help, .tip y .acts de la pestaña HTML + CSS.
