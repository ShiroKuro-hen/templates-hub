import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type UIEvent } from 'react';

const CMD = 'nimbo cierre aplicar --reglas conciliacion.yml --mes 2026-09 --vista-previa';
const LINK = 'https://blog.ejemplo.com/cierre-mensual-en-tres-horas';
const SECTIONS = [
  { id: 'contexto', label: 'El problema' },
  { id: 'plan', label: 'El plan' },
  { id: 'codigo', label: 'Las reglas en código' },
  { id: 'resultados', label: 'Resultados' },
];
const RELATED = [
  { cover: '', title: 'Conciliación bancaria sin hojas de cálculo', meta: 'Producto · 4 min' },
  { cover: 'c2', title: 'Siete alertas que todo equipo financiero debería tener', meta: 'Guías · 6 min' },
  { cover: 'c3', title: 'Auditar un cierre sin frenar al equipo', meta: 'Seguridad · 7 min' },
];

async function copy(text: string): Promise<string> {
  try {
    await navigator.clipboard.writeText(text);
    return 'Copiado';
  } catch {
    return 'No se pudo copiar. Selecciona el texto y cópialo a mano.';
  }
}

export function BlogArticlePage() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(SECTIONS[0].id);
  const [wide, setWide] = useState(true);
  const [codeNote, setCodeNote] = useState('');
  const [linkNote, setLinkNote] = useState('');
  const [comment, setComment] = useState('');
  const [commentNote, setCommentNote] = useState('');

  useEffect(() => {
    const mq = matchMedia('(min-width:760px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      const first = [...frame.querySelectorAll<HTMLHeadingElement>('article h2')].find((h) => visible.has(h));
      if (first) setCurrent(first.id);
    }, { root: frame, rootMargin: '0px 0px -70% 0px' });
    frame.querySelectorAll('article h2').forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget, max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 0);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) {
      setCommentNote('Escribe un comentario antes de enviarlo.');
      return;
    }
    setComment('');
    setCommentNote('Gracias. Tu comentario quedó en revisión.');
  };

  return (
    <div className="frame" ref={frameRef} onScroll={onScroll} tabIndex={0} role="region" aria-label="Artículo: cierre mensual en tres horas">
      <div className="bar" role="progressbar" aria-label="Progreso de lectura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        <i style={{ '--p': progress } as CSSProperties} />
      </div>
      <div className="page">
        <nav aria-label="Ruta">
          <ol className="crumbs"><li><a href="#">Blog</a></li><li><a href="#">Ingeniería</a></li><li aria-current="page">Cierre mensual</li></ol>
        </nav>
        <header>
          <h1>Cómo redujimos el cierre mensual de tres días a tres horas</h1>
          <p className="lead">Automatizamos las conciliaciones, separamos los pasos que bloqueaban al equipo y medimos cada cambio antes de publicarlo.</p>
          <div className="byline">
            <span className="av" aria-hidden="true">CT</span>
            <div><b>Camila Torres</b><time dateTime="2026-10-02">2 oct 2026</time> · <span>9 min de lectura</span></div>
          </div>
        </header>
        <div className="layout">
          <details className="toc" open={wide}>
            <summary>En este artículo</summary>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={current === s.id ? 'location' : undefined}>{s.label}</a>
                </li>
              ))}
            </ol>
          </details>
          <article className="body">
            <h2 id="contexto">El problema</h2>
            <p>Cada fin de mes, el equipo de finanzas cruzaba a mano más de cuarenta mil movimientos entre el banco, el ERP y las hojas de cálculo. Un error de un solo dígito obligaba a repetir el proceso entero.</p>
            <p>Durante seis meses medimos dónde se perdía el tiempo: tres de cada cuatro horas eran de copiar, pegar y esperar.</p>
            <blockquote>
              <p>Pasamos de revisar todo a revisar solo lo que no cuadra. Esa fue la decisión que lo cambió todo.</p>
              <footer>Valeria Rojas, directora de finanzas</footer>
            </blockquote>
            <h2 id="plan">El plan</h2>
            <p>Definimos tres reglas de conciliación con tolerancias explícitas. Lo que cumple la regla se cierra solo; lo demás pasa a una cola con el motivo escrito.</p>
            <h3>Probar antes de activar</h3>
            <p>Cada regla se ejecuta primero en modo de vista previa sobre datos reales. Así comparamos el resultado con el cierre manual del mes anterior, sin tocar un solo asiento.</p>
            <figure>
              <img src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20300'%3E%3Cpath%20d='M30%20260H610'%20stroke='rgba(255,255,255,.7)'%20stroke-width=2%20/%3E%3Cg%20fill='rgba(255,255,255,.6)'%3E%3Crect%20x=50%20y=44%20width=52%20height=216%20rx=6/%3E%3Crect%20x=134%20y=86%20width=52%20height=174%20rx=6/%3E%3Crect%20x=218%20y=137%20width=52%20height=123%20rx=6/%3E%3Crect%20x=302%20y=194%20width=52%20height=66%20rx=6/%3E%3Crect%20x=386%20y=224%20width=52%20height=36%20rx=6/%3E%3Crect%20x=470%20y=242%20width=52%20height=18%20rx=6/%3E%3Crect%20x=554%20y=251%20width=52%20height=9%20rx=6/%3E%3C/g%3E%3C/svg%3E" width="640" height="300" alt="Gráfico de barras: horas de cierre por mes, de 72 en marzo a 3 en septiembre" />
              <figcaption>Horas dedicadas al cierre mensual, de marzo a septiembre de 2026.</figcaption>
            </figure>
            <h2 id="codigo">Las reglas en código</h2>
            <p>La herramienta de línea de comandos lee el archivo de reglas y ejecuta el cierre en un entorno aislado. Este es el comando que usamos cada mes:</p>
            <div className="code">
              <div className="code-head">
                <span>Terminal</span>
                <span className="tools">
                  <span className="note" role="status">{codeNote}</span>
                  <button type="button" className="btn" onClick={async () => setCodeNote(await copy(CMD))}>Copiar</button>
                </span>
              </div>
              <pre><code>{CMD}</code></pre>
            </div>
            <aside className="callout"><b>Consejo</b><p>Empieza con una sola regla y compara dos meses antes de añadir la siguiente. Las tolerancias deben ser de tu negocio, no las que vienen por defecto.</p></aside>
            <h2 id="resultados">Resultados</h2>
            <p>En septiembre cerramos en tres horas y diecisiete minutos. El 96 % de los movimientos se concilió sin intervención, y la cola manual pasó de 4.100 casos a 160.</p>
            <p>Todavía queda trabajo: los pagos en moneda extranjera siguen necesitando revisión humana, y lo abordaremos el próximo trimestre.</p>
          </article>
        </div>
        <section className="author" aria-label="Sobre la autora">
          <span className="av" aria-hidden="true">CT</span>
          <div><b>Camila Torres</b><p>Ingeniera de plataforma en Nimbo. Escribe sobre automatización financiera y sobre cómo ayudar a los equipos a confiar en sus datos.</p></div>
        </section>
        <div className="share" role="group" aria-label="Compartir artículo">
          <span>Compartir</span>
          <button type="button" className="btn" onClick={async () => setLinkNote(await copy(LINK))}>Copiar enlace</button>
          <a className="btn" href="mailto:?subject=C%C3%B3mo%20redujimos%20el%20cierre%20mensual">Enviar por correo</a>
          <span className="note" role="status">{linkNote}</span>
        </div>
        <section aria-labelledby="rl">
          <h2 id="rl">Sigue leyendo</h2>
          <ul className="rel">
            {RELATED.map((r) => (
              <li className="card" key={r.title}>
                <div className={`cover ${r.cover}`} aria-hidden="true" />
                <div className="txt"><h3><a href="#">{r.title}</a></h3><small>{r.meta}</small></div>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="cm" className="comments">
          <h2 id="cm">Comentarios</h2>
          <form className="cform" onSubmit={onSubmit}>
            <label htmlFor="ct">Deja tu comentario</label>
            <textarea id="ct" rows={3} placeholder="¿Qué harías distinto en tu equipo?" value={comment} onChange={(e) => setComment(e.target.value)} />
            <div className="row"><span className="hint">Los comentarios se revisan antes de publicarse.</span><button type="submit" className="primary">Comentar</button></div>
            <p className="note" role="status">{commentNote}</p>
          </form>
        </section>
      </div>
    </div>
  );
}

// CSS: copia las reglas de la pestaña HTML + CSS (.frame … .primary y los @media).
