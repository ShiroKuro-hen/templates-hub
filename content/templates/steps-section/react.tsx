type Step = { title: string; text: string; mock: [string, string?][]; done?: boolean };

const STEPS: Step[] = [
  { title: 'Conecta tus herramientas', text: 'Autoriza Slack, GitHub o Drive con un clic. Nimbo solo lee lo que tú permites.',
    mock: [['Slack', 'Conectado'], ['GitHub', 'Conectado'], ['Google Drive', 'Pendiente']] },
  { title: 'Define tus reglas', text: 'Elige una condición y una acción. Sin código y con vista previa antes de activar.',
    mock: [['Si', 'Prioridad es Urgente'], ['Entonces', 'Asignar a Soporte'], ['Y también', 'Avisar en #incidentes']] },
  { title: 'Mide y mejora', text: 'Consulta cuánto tiempo ahorras y ajusta las reglas desde un solo panel.',
    mock: [['Horas ahorradas', '128 h']], done: true },
];

export function StepsSection({ steps = STEPS }: { steps?: Step[] }) {
  return (
    <section className="sec" aria-labelledby="t">
      <header>
        <h2 id="t">Automatiza tu trabajo en tres pasos</h2>
        <p>Conecta tus herramientas, define reglas y mide el resultado. La mayoría de equipos termina en menos de 15 minutos.</p>
      </header>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="n" aria-hidden="true">{i + 1}</span>
            <div className="card">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="mock">
                {s.mock.map(([a, b]) => (
                  <div className="row" key={a}>
                    {s.done ? <>{a}<b>{b}</b></> : b === 'Conectado' || b === 'Pendiente' ? <>{a}<span className={b === 'Conectado' ? 'tag' : undefined}>{b}</span></> : <><span>{a}</span>{b}</>}
                  </div>
                ))}
                {s.done && (
                  <>
                    <div className="bar" role="img" aria-label="62 % del objetivo mensual"><i /></div>
                    <div className="row"><span>62 % del objetivo mensual</span></div>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="actions">
        <a className="btn pri" href="#">Crear cuenta gratis</a>
        <a className="btn" href="#">Ver demo de 3 minutos</a>
      </div>
    </section>
  );
}
// CSS: copia las reglas .sec, .steps, .n, .card, .mock, .row, .tag, .bar y .btn de la pestaña HTML + CSS.
