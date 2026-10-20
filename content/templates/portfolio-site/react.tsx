import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

type ProjectType = 'web' | 'app' | 'marca';
type Project = { title: string; type: ProjectType; meta: string; desc: string; alt: string; image: string };
type Field = 'nombre' | 'correo' | 'mensaje';
type Values = Record<Field, string> & { proyecto: string };

const PROJECTS: Project[] = [
  { title: 'Banca Abierta', type: 'web', meta: 'Web · 2025', desc: 'Portal de inversiones para particulares', alt: 'Portátil sobre un escritorio con estantería', image: '/stock/escritorio-laptop.webp' },
  { title: 'Atlas Clínico', type: 'web', meta: 'Web · 2023', desc: 'Panel de historiales para clínicas', alt: 'Escritorio visto desde arriba con teclado y tableta', image: '/stock/escritorio-cenital.webp' },
  { title: 'Nubla', type: 'app', meta: 'App · 2024', desc: 'App de meditación con sesiones guiadas', alt: 'Escritorio cenital con materiales de diseño y un teléfono', image: '/stock/escritorio-diseno.webp' },
  { title: 'Ruta Verde', type: 'app', meta: 'App · 2023', desc: 'Planificador de rutas a pie y en bici', alt: 'Calle de ciudad entre edificios', image: '/stock/calle-ciudad.webp' },
  { title: 'Hilo Atelier', type: 'marca', meta: 'Marca · 2024', desc: 'Identidad y envases de accesorios', alt: 'Cartera, reloj y auriculares sobre fondo plano', image: '/stock/objetos-planos.webp' },
  { title: 'Revista Faro', type: 'marca', meta: 'Marca · 2022', desc: 'Sistema tipográfico y portadas', alt: 'Luces de colores desenfocadas', image: '/stock/luces-bokeh.webp' },
];
const FILTERS: { id: 'todos' | ProjectType; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'web', label: 'Web' },
  { id: 'app', label: 'App' },
  { id: 'marca', label: 'Marca' },
];
const NAV = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
];
const STATS = [
  ['Años de experiencia', '9'],
  ['Proyectos entregados', '60+'],
  ['Clientes recurrentes', '24'],
  ['Premios de diseño', '3'],
];
const SKILLS = ['Figma', 'Sistemas de diseño', 'Accesibilidad WCAG', 'Investigación de usuarios', 'HTML y CSS', 'Tipografía', 'Prototipado'];
const EXPERIENCE = [
  { period: '2023 – hoy', role: 'Diseñadora senior', company: 'Lumbre Software' },
  { period: '2020 – 2023', role: 'Diseñadora de producto', company: 'Estudio Norte' },
  { period: '2017 – 2020', role: 'Diseñadora gráfica', company: 'Taller Azulejo' },
];
const rules: Record<Field, (v: string) => string> = {
  nombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu nombre (mínimo 2 letras).'),
  correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Introduce un correo válido, por ejemplo nombre@correo.com.'),
  mensaje: (v) => (v.trim().length >= 20 ? '' : 'Cuéntame un poco más (mínimo 20 caracteres).'),
};
const FIELDS = Object.keys(rules) as Field[];
const EMPTY: Values = { nombre: '', correo: '', proyecto: 'Web', mensaje: '' };
const isField = (name: keyof Values): name is Field => name in rules;

export function PortfolioSite({ projects = PROJECTS }: { projects?: Project[] }) {
  const [filter, setFilter] = useState<'todos' | ProjectType>('todos');
  const [current, setCurrent] = useState('');
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState('');
  const visible = filter === 'todos' ? projects : projects.filter((p) => p.type === filter);

  useEffect(() => {
    const spy = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e) => setCurrent(e.target.id));
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  useEffect(() => {
    if (sent) document.getElementById('done')?.focus();
  }, [sent]);

  const update = (name: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (isField(name) && errors[name]) setErrors((e) => ({ ...e, [name]: rules[name](value) }));
  };

  const field = (name: Field) => ({
    id: name,
    name,
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(name, e.target.value),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': `err-${name}`,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = Object.fromEntries(FIELDS.map((f) => [f, rules[f](values[f])])) as Record<Field, string>;
    setErrors(next);
    const first = FIELDS.find((f) => next[f]);
    if (first) return document.getElementById(first)?.focus();
    setSent(values.nombre.trim());
  };

  return (
    <div className="page">
      <header className="nav">
        <a className="name" href="#inicio">Laura Méndez</a>
        <nav aria-label="Principal">
          <ul>
            {NAV.map((l) => (
              <li key={l.id}><a href={`#${l.id}`} aria-current={current === l.id ? 'true' : undefined}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero" id="inicio" aria-labelledby="h1">
          <div>
            <p className="eyebrow">Diseñadora de producto · Madrid</p>
            <h1 id="h1">Interfaces claras, útiles y con carácter.</h1>
            <p className="lead">Ayudo a equipos de producto y a marcas a convertir ideas complejas en experiencias sencillas. Nueve años de oficio, desde la investigación hasta el código.</p>
            <div className="btns"><a className="btn pri" href="#proyectos">Ver proyectos</a><a className="btn" href="#contacto">Escribirme</a></div>
          </div>
          <dl className="stats">
            {STATS.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>

        <section className="sec" id="proyectos" aria-labelledby="h-proy">
          <div className="sec-head">
            <h2 id="h-proy">Proyectos seleccionados</h2>
            <p>Trabajos de los últimos cuatro años. Pasa el cursor o usa el teclado para ver los detalles.</p>
          </div>
          <div className="filters" role="group" aria-label="Filtrar por tipo">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
            ))}
          </div>
          <ul className="works">
            {visible.map((p) => (
              <li key={p.title}>
                <a className="work" href="#proyectos">
                  <img src={p.image} alt={p.alt} width={800} height={533} loading="lazy" decoding="async" />
                  <span className="cap"><small>{p.meta}</small><strong>{p.title}</strong><span>{p.desc}</span></span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="sec" id="sobre-mi" aria-labelledby="h-sobre">
          <div className="about">
            <div>
              <h2 id="h-sobre">Sobre mí</h2>
              <p>Trabajo entre el diseño de producto y la identidad de marca. Me interesan los detalles que nadie nota cuando están bien hechos: el espaciado, el texto de un error, la transición que orienta. Colaboro con startups y estudios desde Madrid y doy talleres de accesibilidad.</p>
              <ul className="chips" aria-label="Habilidades">
                {SKILLS.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="tl-title">Experiencia</h3>
              <ol className="tl">
                {EXPERIENCE.map((x) => (
                  <li key={x.role}><time>{x.period}</time><strong>{x.role}</strong><span>{x.company}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="sec" id="contacto" aria-labelledby="h-contacto">
          <h2 id="h-contacto">Hablemos de tu proyecto</h2>
          <p className="lead">Cuéntame qué necesitas y te respondo en menos de dos días laborables.</p>
          {sent ? (
            <div className="done" id="done" role="status" tabIndex={-1}>
              <h3>¡Mensaje enviado!</h3>
              <p>Gracias, {sent}. He recibido tu mensaje y te escribiré pronto.</p>
            </div>
          ) : (
            <form className="form" id="form" noValidate onSubmit={onSubmit}>
              <div className="row">
                <div className="field">
                  <label htmlFor="nombre">Nombre</label>
                  <input {...field('nombre')} required autoComplete="name" />
                  <p className="error" id="err-nombre">{errors.nombre}</p>
                </div>
                <div className="field">
                  <label htmlFor="correo">Correo electrónico</label>
                  <input {...field('correo')} type="email" required autoComplete="email" />
                  <p className="error" id="err-correo">{errors.correo}</p>
                </div>
              </div>
              <div className="field">
                <label htmlFor="proyecto">Tipo de proyecto</label>
                <select id="proyecto" name="proyecto" value={values.proyecto} onChange={(e) => update('proyecto', e.target.value)}>
                  <option>Web</option><option>App</option><option>Marca</option><option>Otro</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea {...field('mensaje')} required />
                <p className="error" id="err-mensaje">{errors.mensaje}</p>
              </div>
              <div><button className="btn pri" type="submit">Enviar mensaje</button></div>
            </form>
          )}
        </section>
      </main>
      <footer>
        <span>© 2026 Laura Méndez · Diseño con calma</span>
        <ul>
          <li><a href="#contacto">Correo</a></li>
          <li><a href="#sobre-mi">Descargar CV</a></li>
        </ul>
      </footer>
    </div>
  );
}
