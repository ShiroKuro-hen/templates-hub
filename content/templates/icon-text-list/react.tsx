type Feature = { icon: string; title: string; text: string }; // icon = contenido interno del <svg> (viewBox 24)

const FEATURES: Feature[] = [
  { icon: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>', title: 'Arranca al instante', text: 'Abre tus notas en menos de un segundo.' },
  { icon: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>', title: 'Privado por defecto', text: 'Tus notas se cifran en tu dispositivo.' },
  { icon: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>', title: 'Organiza por capas', text: 'Carpetas, etiquetas y vistas guardadas.' },
];

export function IconTextList({ title = 'Por qué Cuaderno', items = FEATURES }: { title?: string; items?: Feature[] }) {
  return (
    <section>
      <h1>{title}</h1>
      <ul>
        {items.map((f) => (
          <li key={f.title}>
            <span className="ico">
              <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: f.icon }} />
            </span>
            <div>
              <strong>{f.title}</strong>
              <p>{f.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas h1 / ul / li / .ico (y .ico svg) / strong / p y los tokens de la pestaña HTML + CSS.
