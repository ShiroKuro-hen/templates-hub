import { useEffect, useRef, useState } from 'react';

type Seccion = { id: string; titulo: string; texto: string[] };

const SECCIONES: Seccion[] = [
  { id: 'conceptos', titulo: 'Conceptos', texto: ['Un proyecto agrupa servicios, variables y miembros. Cada proyecto tiene entornos independientes.', 'Los servicios se comunican por una red privada y solo exponen los puertos que declaras.'] },
  { id: 'instalacion', titulo: 'Instalación', texto: ['Instala la herramienta de línea de comandos y verifica la versión antes de continuar.', 'Necesitas permisos de administrador solo la primera vez.'] },
  { id: 'configuracion', titulo: 'Configuración', texto: ['Define las variables de entorno en el panel o en el archivo del proyecto.', 'Los valores secretos se cifran y no se muestran después de guardarlos.'] },
  { id: 'despliegue', titulo: 'Despliegue', texto: ['Cada cambio en la rama principal genera un despliegue que puedes revisar antes de publicar.', 'Si algo falla, vuelve a la versión anterior con un clic.'] },
  { id: 'problemas', titulo: 'Solución de problemas', texto: ['Revisa el registro del despliegue para ver qué paso falló.', 'Si continúa, escribe a soporte con el identificador del despliegue.'] },
];

export function TableOfContents({ secciones = SECCIONES }: { secciones?: Seccion[] }) {
  const [actual, setActual] = useState(secciones[0].id);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vis = new Set<Element>();
    const els = secciones.map((s) => document.getElementById(s.id)!);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)));
        const cur = els.find((el) => vis.has(el));
        if (cur) setActual(cur.id);
      },
      { root: scroll.current, rootMargin: '0px 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [secciones]);

  return (
    <div className="wrap">
      <div className="scroll" ref={scroll} tabIndex={0} role="region" aria-label="Contenido del artículo">
        {secciones.map((s) => (
          <section key={s.id} id={s.id}>
            <h2>{s.titulo}</h2>
            {s.texto.map((t) => <p key={t}>{t}</p>)}
          </section>
        ))}
      </div>
      <nav className="toc" aria-labelledby="tt">
        <h2 id="tt">En esta página</h2>
        <ul>
          {secciones.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} aria-current={s.id === actual ? 'location' : undefined}>{s.titulo}</a></li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// CSS: copia las reglas .wrap, .scroll, section, .toc y .toc a de la pestaña HTML + CSS.
