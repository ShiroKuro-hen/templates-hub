type Feature = { icon: string; title: string; text: string }; // icon = atributo "d" de un path 24x24

const FEATURES: Feature[] = [
  { icon: 'M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 4v16M15 4v10', title: 'Tableros flexibles', text: 'Organiza tareas en columnas, listas o calendario y cambia de vista cuando quieras.' },
  { icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2', title: 'Plazos y recordatorios', text: 'Avisamos antes de que venza cada entrega, por correo o en la app.' },
  { icon: 'M4 5h16v11H9l-5 4z', title: 'Comentarios en contexto', text: 'Conversa dentro de cada tarea y menciona a quien deba responder.' },
  { icon: 'M13 2L4 14h7l-1 8 9-12h-7z', title: 'Automatizaciones', text: 'Asigna, mueve y notifica de forma automática cuando cambia el estado.' },
  { icon: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3', title: 'Informes en vivo', text: 'Mide el avance y la carga de trabajo sin exportar hojas de cálculo.' },
  { icon: 'M7 11h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2zM8 11V8a4 4 0 018 0v3', title: 'Permisos por equipo', text: 'Decide quién ve, edita o aprueba, proyecto por proyecto.' },
];

type Props = { title?: string; intro?: string; features?: Feature[] };

export function FeatureGrid({
  title = 'Lo necesario para llegar a tiempo',
  intro = 'Seis herramientas que trabajan juntas, sin integraciones que configurar.',
  features = FEATURES,
}: Props) {
  return (
    <section className="features" aria-labelledby="features-title">
      <div className="head">
        <h2 id="features-title">{title}</h2>
        <p>{intro}</p>
      </div>
      <ul className="grid">
        {features.map((f) => (
          <li className="card" key={f.title}>
            <div className="ico">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={f.icon} /></svg>
            </div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .features / .head / .grid / .card / .ico de la pestaña HTML + CSS.
