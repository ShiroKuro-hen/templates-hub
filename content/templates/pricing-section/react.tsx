import { useState } from 'react';

type Plan = { name: string; blurb: string; m: number; y: number; cta: string; pop?: boolean; items: string[] };
const PLANS: Plan[] = [
  { name: 'Inicial', blurb: 'Para probar Nimbo con tu equipo.', m: 0, y: 0, cta: 'Empezar gratis',
    items: ['Hasta 3 usuarios', '5 proyectos activos', 'Historial de 30 días', 'Soporte de la comunidad'] },
  { name: 'Equipo', blurb: 'Para equipos que automatizan su trabajo.', m: 12, y: 10, cta: 'Probar 14 días gratis', pop: true,
    items: ['Usuarios y proyectos ilimitados', '1.000 automatizaciones al mes', 'Historial de 1 año', 'Soporte por chat en 4 horas'] },
  { name: 'Empresa', blurb: 'Para organizaciones con requisitos de seguridad.', m: 29, y: 24, cta: 'Hablar con ventas',
    items: ['SSO y aprovisionamiento SCIM', 'Registro de auditoría completo', 'SLA de disponibilidad del 99,99 %', 'Gerente de cuenta dedicado'] },
];

export function PricingSection({ plans = PLANS }: { plans?: Plan[] }) {
  const [anual, setAnual] = useState(false);
  return (
    <section className="sec" aria-labelledby="t">
      <header>
        <h2 id="t">Planes simples para equipos que crecen</h2>
        <p>Empieza gratis y cambia de plan cuando lo necesites. Sin permanencia ni costos ocultos.</p>
        <fieldset>
          <legend className="sr">Periodo de facturación</legend>
          <div className="toggle">
            {([['Mensual', false], ['Anual', true]] as const).map(([label, v]) => (
              <label key={label}>
                <input type="radio" name="b" checked={anual === v} onChange={() => setAnual(v)} />{label}
              </label>
            ))}
          </div>
          <span className="badge">Ahorra 17 %</span>
        </fieldset>
      </header>
      <div className="plans">
        {plans.map((p) => {
          const precio = anual ? p.y : p.m;
          return (
            <article key={p.name} className={p.pop ? 'plan pop' : 'plan'}>
              <h3>{p.name}{p.pop && <span className="badge">Más popular</span>}</h3>
              <p>{p.blurb}</p>
              <div className="price">
                ${precio}
                <small>{precio === 0 ? 'gratis para siempre' : `por usuario al mes, ${anual ? `US$ ${p.y * 12} al año` : 'facturado cada mes'}`}</small>
              </div>
              <a className={p.pop ? 'btn pri' : 'btn'} href="#">{p.cta}</a>
              <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
// CSS: copia las reglas .sec, .toggle, .plan, .price, .btn y ul/li de la pestaña HTML + CSS (las reglas .m/.y no hacen falta).
