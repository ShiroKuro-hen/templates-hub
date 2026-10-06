import { useState } from 'react';

type Plan = { name: string; desc: string; monthly: number; cta: string; href: string; features: string[]; featured?: boolean };
type Faq = { q: string; a: string };

const PLANS: Plan[] = [
  { name: 'Básico', desc: 'Para probar Nimbo con un equipo pequeño.', monthly: 0, cta: 'Empezar gratis', href: '#registro', features: ['Hasta 3 personas', '5 proyectos activos', '2 GB de almacenamiento'] },
  { name: 'Equipo', desc: 'Para equipos que trabajan a diario en Nimbo.', monthly: 12, cta: 'Probar 14 días gratis', href: '#registro', featured: true,
    features: ['Personas ilimitadas', 'Proyectos ilimitados', '100 GB y permisos por rol', 'Informes y automatizaciones'] },
  { name: 'Empresa', desc: 'Para organizaciones con requisitos de seguridad.', monthly: 29, cta: 'Hablar con ventas', href: '#ventas',
    features: ['Todo lo del plan Equipo', 'SSO y registro de auditoría', 'Disponibilidad garantizada del 99,9 %'] },
];
const FAQ: Faq[] = [
  { q: '¿Puedo cambiar de plan más adelante?', a: 'Sí. El cambio se aplica al momento y prorrateamos el importe en tu siguiente factura.' },
  { q: '¿Qué pasa al terminar la prueba gratis?', a: 'Tu espacio pasa al plan Básico. No perderás datos y puedes contratar cuando quieras.' },
  { q: '¿Qué formas de pago aceptáis?', a: 'Tarjeta de crédito o débito y, en planes anuales, transferencia bancaria.' },
];
const eur = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) + ' €';

export function PricingPage({ plans = PLANS, faq = FAQ, discount = 0.2 }: { plans?: Plan[]; faq?: Faq[]; discount?: number }) {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="wrap">
      <header>
        <h1>Planes que crecen con tu equipo</h1>
        <p>Empieza gratis y cambia de plan cuando lo necesites. Todos incluyen soporte por correo y copias de seguridad diarias.</p>
        <fieldset className="billing">
          <legend>Periodo de facturación</legend>
          <label><input type="radio" name="billing" checked={!annual} onChange={() => setAnnual(false)} />Mensual</label>
          <label><input type="radio" name="billing" checked={annual} onChange={() => setAnnual(true)} />Anual
            <span className="save">Ahorra un {Math.round(discount * 100)} %</span>
          </label>
        </fieldset>
      </header>

      <section className="plans" aria-label="Planes">
        {plans.map((p) => (
          <article key={p.name} className={p.featured ? 'plan featured' : 'plan'}>
            <h2>{p.name}{p.featured && <span className="tag">Más elegido</span>}</h2>
            <p>{p.desc}</p>
            <p className="price">
              <strong>{eur(annual ? p.monthly * (1 - discount) : p.monthly)}</strong>
              <span>{p.monthly === 0 ? 'siempre gratis' : `por persona y mes${annual ? ', facturado al año' : ''}`}</span>
            </p>
            <a className={p.featured ? 'btn primary' : 'btn'} href={p.href}>{p.cta}</a>
            <ul>
              {p.features.map((f) => (
                <li key={f}><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 8.5l3 3 7-7" /></svg>{f}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="faq" aria-labelledby="faq">
        <h2 id="faq">Preguntas frecuentes</h2>
        {faq.map((f, i) => (
          <details key={f.q} name="faq" open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </section>
    </main>
  );
}

// CSS: copia las reglas .wrap, header, .billing, .plans, .plan, .price, .btn, ul, li y .faq de la pestaña HTML + CSS (la regla .wrap:has(...) no hace falta aquí).
