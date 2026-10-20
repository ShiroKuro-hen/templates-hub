import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

type ProjectType = 'web' | 'app' | 'marca';
type Project = { title: string; type: ProjectType; meta: string; alt: string; tone: string; cover: string };
type Field = 'nombre' | 'correo' | 'mensaje';
type Values = Record<Field, string> & { proyecto: string };

const PROJECTS: Project[] = [
  { title: 'Banca Abierta', type: 'web', meta: 'Web · 2025', tone: 'c1', alt: 'Vista previa del portal de inversiones Banca Abierta', cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cg fill='white'%3E%3Ccircle cx='300' cy='90' r='70' fill-opacity='.18'/%3E%3Crect x='60' y='150' width='120' height='90' rx='12' fill-opacity='.9'/%3E%3Crect x='200' y='190' width='140' height='50' rx='12' fill-opacity='.45'/%3E%3C/g%3E%3C/svg%3E" },
  { title: 'Nubla', type: 'app', meta: 'App · 2024', tone: 'c2', alt: 'Vista previa de la app de meditación Nubla', cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect x='150' y='40' width='100' height='220' rx='18' fill='white' fill-opacity='.9'/%3E%3Ccircle cx='200' cy='150' r='28' fill='white' fill-opacity='.35'/%3E%3Crect x='170' y='208' width='60' height='8' rx='4' fill='white' fill-opacity='.6'/%3E%3C/svg%3E" },
  { title: 'Café Ámbar', type: 'marca', meta: 'Marca · 2024', tone: 'c3', alt: 'Vista previa de la identidad de Café Ámbar', cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Ccircle cx='200' cy='150' r='95' fill='white' fill-opacity='.2'/%3E%3Ccircle cx='200' cy='150' r='55' fill='white' fill-opacity='.9'/%3E%3C/svg%3E" },
  { title: 'Atlas Clínico', type: 'web', meta: 'Web · 2023', tone: 'c4', alt: 'Vista previa del panel de historiales Atlas Clínico', cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect x='40' y='40' width='100' height='70' rx='8' fill='white' fill-opacity='.9'/%3E%3Crect x='160' y='40' width='200' height='70' rx='8' fill='white' fill-opacity='.45'/%3E%3Crect x='40' y='130' width='320' height='130' rx='8' fill='white' fill-opacity='.3'/%3E%3C/svg%3E" },
  { title: 'Ruta Verde', type: 'app', meta: 'App · 2023', tone: 'c5', alt: 'Vista previa del planificador de rutas Ruta Verde', cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cpath d='M0 220C80 150 140 280 220 200S330 120 400 170V300H0Z' fill='white' fill-opacity='.35'/%3E%3Ccircle cx='220' cy='110' r='18' fill='white' fill-opacity='.9'/%3E%3C/svg%3E" },
  { title: 'Revista Faro', type: 'marca', meta: 'Marca · 2022', tone: 'c6', alt: 'Vista previa del sistema tipográfico de la revista Faro', cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect x='50' y='50' width='300' height='24' fill='white' fill-opacity='.9'/%3E%3Crect x='50' y='94' width='220' height='12' fill='white' fill-opacity='.6'/%3E%3Crect x='50' y='120' width='260' height='12' fill='white' fill-opacity='.6'/%3E%3Crect x='50' y='146' width='180' height='12' fill='white' fill-opacity='.6'/%3E%3Ccircle cx='300' cy='220' r='40' fill='white' fill-opacity='.35'/%3E%3C/svg%3E" },
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
                  <img className={`cov ${p.tone}`} width={400} height={300} loading="lazy" alt={p.alt} src={p.cover} />
                  <span className="cap"><small>{p.meta}</small><strong>{p.title}</strong></span>
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
