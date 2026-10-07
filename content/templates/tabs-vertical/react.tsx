import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const TABS = [
  { id: 'perfil', label: 'Perfil', hint: 'Estos datos aparecen en tus comentarios y menciones.',
    rows: [['Nombre', 'Valeria Quispe'], ['Correo', 'valeria@nimbo.pe'], ['Zona horaria', 'Lima (UTC-5)']] },
  { id: 'seguridad', label: 'Seguridad', hint: 'Protege tu cuenta con verificación en dos pasos.',
    rows: [['Contraseña', 'Cambiada hace 42 días'], ['Verificación', 'App de autenticación activa'], ['Sesiones', '3 dispositivos']] },
  { id: 'avisos', label: 'Notificaciones', hint: 'Elige qué avisos recibes y por qué canal.',
    rows: [['Menciones', 'Correo y aplicación'], ['Resumen semanal', 'Lunes a las 08:00'], ['Alertas de pago', 'Solo aplicación']] },
  { id: 'pagos', label: 'Facturación', hint: 'Consulta tu plan y el próximo cobro.',
    rows: [['Plan', 'Business, 12 usuarios'], ['Próximo cobro', '1 de noviembre, S/ 1,940.00'], ['Método de pago', 'Visa terminada en 4242']] },
];

export function VerticalTabs() {
  const [sel, setSel] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowDown: (sel + 1) % n, ArrowUp: (sel - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label="Ajustes de la cuenta" aria-orientation="vertical" onKeyDown={onKey}>
        {TABS.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" type="button"
                  id={`tab-${t.id}`} aria-controls={`p-${t.id}`} aria-selected={i === sel}
                  tabIndex={i === sel ? 0 : -1} onClick={() => setSel(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {TABS.map((t, i) => (
          <section key={t.id} role="tabpanel" id={`p-${t.id}`} aria-labelledby={`tab-${t.id}`} tabIndex={0} hidden={i !== sel}>
            <h2>{t.label}</h2>
            <p>{t.hint}</p>
            <dl>{t.rows.map(([k, v]) => (<div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>))}</dl>
          </section>
        ))}
      </div>
    </div>
  );
}

// CSS: copia las reglas .tabs, [role=tablist], [role=tab], [role=tabpanel], h2, p y dl de la pestaña HTML + CSS.
