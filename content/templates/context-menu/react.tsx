import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

type Archivo = { nombre: string; meta: string; ext: string };
type Abierto = { x: number; y: number; archivo: number };

const ARCHIVOS: Archivo[] = [
  { nombre: 'informe-q3.pdf', meta: '2,4 MB · Hace 2 h', ext: 'PDF' },
  { nombre: 'presupuesto.xlsx', meta: '812 KB · Ayer', ext: 'XLSX' },
  { nombre: 'logo.svg', meta: '14 KB · Hace 3 días', ext: 'SVG' },
  { nombre: 'notas-reunion.md', meta: '3 KB · Hace 1 semana', ext: 'MD' },
];
const DESTINOS = ['Documentos', 'Descargas', 'Proyectos'];
const MARGEN = 8;

const acotar = (valor: number, min: number, max: number) => Math.max(min, Math.min(valor, max));
const elementosMenu = (menu: HTMLElement | null) =>
  [...(menu?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])].filter(
    (el) => el.getAttribute('aria-disabled') !== 'true',
  );

export function MenuContextual({ archivos = ARCHIVOS }: { archivos?: Archivo[] }) {
  const [menu, setMenu] = useState<Abierto | null>(null);
  const [subAbierto, setSubAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('Aún no has elegido ninguna acción.');
  const menuRef = useRef<HTMLDivElement>(null);
  const disparadorRef = useRef<HTMLButtonElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const tarjetas = useRef<(HTMLElement | null)[]>([]);
  const enfocarSub = useRef(false);

  const cerrar = () => {
    if (menu && menuRef.current?.contains(document.activeElement)) tarjetas.current[menu.archivo]?.focus();
    setMenu(null);
    setSubAbierto(false);
  };
  const abrir = (x: number, y: number, archivo: number) => {
    setMenu({ x, y, archivo });
    setSubAbierto(false);
  };
  const accion = (texto: string) => {
    setMensaje(texto);
    cerrar();
  };

  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!menu || !el) return;
    el.style.left = `${acotar(menu.x, MARGEN, innerWidth - el.offsetWidth - MARGEN)}px`;
    el.style.top = `${acotar(menu.y, MARGEN, innerHeight - el.offsetHeight - MARGEN)}px`;
  }, [menu, subAbierto]);

  useEffect(() => {
    if (menu) elementosMenu(menuRef.current)[0]?.focus();
  }, [menu]);

  useEffect(() => {
    if (enfocarSub.current && subRef.current) {
      enfocarSub.current = false;
      subRef.current.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    }
  });

  useEffect(() => {
    if (!menu) return;
    const fuera = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(null);
    };
    const desplazar = () => cerrar();
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('scroll', desplazar, { capture: true, passive: true });
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('scroll', desplazar, { capture: true });
    };
  }, [menu]);

  const teclasMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    const activo = document.activeElement as HTMLElement;
    const items = elementosMenu(menuRef.current);
    const i = items.indexOf(activo);
    const n = items.length;
    if (e.key === 'ArrowRight' && activo === disparadorRef.current) {
      e.preventDefault();
      if (subAbierto) subRef.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus();
      else {
        enfocarSub.current = true;
        setSubAbierto(true);
      }
      return;
    }
    if (e.key === 'ArrowLeft' && subRef.current?.contains(activo)) {
      e.preventDefault();
      setSubAbierto(false);
      disparadorRef.current?.focus();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (subAbierto) {
        setSubAbierto(false);
        disparadorRef.current?.focus();
      } else cerrar();
      return;
    }
    if (e.key === 'Tab') {
      cerrar();
      return;
    }
    const destino = { ArrowDown: items[(i + 1) % n], ArrowUp: items[(i - 1 + n) % n], Home: items[0], End: items[n - 1] }[e.key];
    if (destino) {
      e.preventDefault();
      destino.focus();
    }
  };

  const clicMenu = (e: MouseEvent<HTMLDivElement>) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[role=menuitem]');
    if (!item || item.getAttribute('aria-disabled') === 'true' || !menu) return;
    if (item === disparadorRef.current) {
      setSubAbierto((v) => !v);
      return;
    }
    const nombre = archivos[menu.archivo].nombre;
    const destino = item.dataset.dest;
    if (destino) accion(`Moviste ${nombre} a ${destino}.`);
    else accion(MENSAJES[item.dataset.act ?? ''](nombre));
  };

  const teclasTarjeta = (e: KeyboardEvent<HTMLUListElement>, indice: number, el: HTMLElement) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      abrir(r.left + 24, r.bottom - 8, indice);
    }
  };

  return (
    <main>
      <ul className="files">
        {archivos.map((a, indice) => (
          <li key={a.nombre}>
            <article
              className="card"
              tabIndex={0}
              ref={(el) => { tarjetas.current[indice] = el; }}
              onContextMenu={(e) => {
                e.preventDefault();
                abrir(e.clientX, e.clientY, indice);
              }}
              onKeyDown={(e) => teclasTarjeta(e, indice, e.currentTarget)}
            >
              <span className="ext" aria-hidden="true">{a.ext}</span>
              <span className="meta">
                <strong>{a.nombre}</strong>
                <span>{a.meta}</span>
              </span>
            </article>
          </li>
        ))}
      </ul>
      <p className="hint">Clic derecho, Mayús+F10 o la tecla Menú sobre un archivo abre sus acciones.</p>
      <p className="log" role="status" aria-live="polite">{mensaje}</p>
      {menu && (
        <div ref={menuRef} className="menu" role="menu" aria-label="Acciones del archivo" onKeyDown={teclasMenu} onClick={clicMenu}>
          <button type="button" role="menuitem" tabIndex={-1} data-act="abrir">Abrir</button>
          <button type="button" role="menuitem" tabIndex={-1} data-act="renombrar">Renombrar</button>
          <button type="button" role="menuitem" tabIndex={-1} data-act="duplicar">Duplicar</button>
          <button type="button" role="menuitem" tabIndex={-1} aria-disabled="true">Compartir (próximamente)</button>
          <hr role="separator" />
          <button ref={disparadorRef} type="button" role="menuitem" tabIndex={-1} aria-haspopup="menu" aria-expanded={subAbierto} data-sub>
            Mover a
            <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>
          {subAbierto && (
            <div ref={subRef} role="group" aria-label="Mover a">
              {DESTINOS.map((d) => (
                <button key={d} type="button" role="menuitem" tabIndex={-1} data-act="mover" data-dest={d}>{d}</button>
              ))}
            </div>
          )}
          <hr role="separator" />
          <button type="button" role="menuitem" tabIndex={-1} className="danger" data-act="eliminar">Eliminar</button>
        </div>
      )}
    </main>
  );
}

const MENSAJES: Record<string, (nombre: string) => string> = {
  abrir: (n) => `Abriste ${n}.`,
  renombrar: (n) => `Renombrar ${n}: escribe el nombre nuevo.`,
  duplicar: (n) => `Duplicaste ${n}.`,
  eliminar: (n) => `Eliminaste ${n}.`,
};

// CSS: copia las reglas .files, .card, .ext, .meta, .hint, .log, .menu, hr, [role=group], [role=menuitem], .danger y .chev de la pestaña HTML + CSS.
