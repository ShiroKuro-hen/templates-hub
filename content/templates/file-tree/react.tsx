import { useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

type Nodo = { n: string; c?: Nodo[] };
type Tipo = 'folder' | 'ts' | 'css' | 'json' | 'md' | 'img';

const ARBOL: Nodo[] = [
  { n: 'src', c: [
    { n: 'components', c: [{ n: 'button.ts' }, { n: 'card.css' }] },
    { n: 'styles', c: [{ n: 'tokens.css' }] },
    { n: 'index.ts' },
  ] },
  { n: 'public', c: [{ n: 'logo.svg' }, { n: 'hero.jpg' }] },
  { n: 'docs', c: [{ n: 'leeme.md' }] },
  { n: 'package.json' },
  { n: 'tsconfig.json' },
];
const EXT: Record<string, Tipo> = { ts: 'ts', css: 'css', json: 'json', md: 'md', svg: 'img', jpg: 'img' };
const FOLDER = 'M2 4.5a1 1 0 0 1 1-1h3.2l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z';
const FILE = 'M4 1.5h5l3.5 3.5v8.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z';
const GLYPH: Record<Exclude<Tipo, 'folder'>, string> = {
  ts: 'M6 8.5 4.5 10 6 11.5M10 8.5l1.5 1.5L10 11.5',
  css: 'M5.5 8.5h5M5.5 10.5h5M5.5 12.5h3',
  json: 'M6 8.5h-.5v3H6M10 8.5h.5v3h-.5',
  md: 'M5 11.5v-3l1.5 2 1.5-2v3M10.5 8.5v3',
  img: 'M5 11.5l2-2.5 1.5 1.8 1-1.2 1.5 1.9z',
};

const tipoDe = (nodo: Nodo): Tipo => (nodo.c ? 'folder' : EXT[nodo.n.split('.').pop() ?? '']);
const buscar = (items: HTMLElement[], i: number, letra: string) =>
  [...items.slice(i + 1), ...items.slice(0, i + 1)].find((el) =>
    (el.getAttribute('aria-label') ?? '').toLowerCase().startsWith(letra.toLowerCase()));

function Icono({ tipo }: { tipo: Tipo }) {
  return (
    <svg className={`ic ${tipo}`} viewBox="0 0 16 16" aria-hidden="true">
      <path d={tipo === 'folder' ? FOLDER : FILE} />
      {tipo !== 'folder' && <path d={GLYPH[tipo]} />}
    </svg>
  );
}

type RamasProps = {
  nodos: Nodo[]; base: string; nivel: number;
  abiertos: Set<string>; sel: string; foco: string;
};

function Ramas({ nodos, base, nivel, abiertos, sel, foco }: RamasProps) {
  return (
    <>
      {nodos.map((nodo) => {
        const path = base ? `${base}/${nodo.n}` : nodo.n;
        const dir = Boolean(nodo.c);
        const open = abiertos.has(path);
        return (
          <li key={path} role="treeitem" aria-level={nivel} aria-expanded={dir ? open : undefined}
              aria-selected={sel === path} aria-label={nodo.n} data-path={path} tabIndex={foco === path ? 0 : -1}>
            <div className="row">
              {dir ? (
                <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
              ) : (
                <span className="sp" />
              )}
              <Icono tipo={tipoDe(nodo)} />
              <span className="name">{nodo.n}</span>
            </div>
            {dir && open && (
              <ul role="group">
                <Ramas nodos={nodo.c ?? []} base={path} nivel={nivel + 1} abiertos={abiertos} sel={sel} foco={foco} />
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
}

export function ExploradorArchivos({ nodos = ARBOL }: { nodos?: Nodo[] }) {
  const [abiertos, setAbiertos] = useState<Set<string>>(() => new Set(['src']));
  const [sel, setSel] = useState('src/index.ts');
  const [foco, setFoco] = useState('src/index.ts');
  const raiz = useRef<HTMLUListElement>(null);

  const enfocar = (path: string) => {
    setFoco(path);
    raiz.current?.querySelector<HTMLElement>(`[data-path="${path}"]`)?.focus();
  };
  const alternar = (path: string) =>
    setAbiertos((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  const activar = (path: string, dir: boolean) => {
    setSel(path);
    setFoco(path);
    if (dir) alternar(path);
  };

  const teclas = (e: KeyboardEvent<HTMLUListElement>) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[role=treeitem]');
    if (!li || !raiz.current) return;
    const path = li.dataset.path ?? '';
    const dir = li.hasAttribute('aria-expanded');
    const open = abiertos.has(path);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activar(path, dir);
      return;
    }
    const expand = e.key === 'ArrowRight';
    if ((expand || e.key === 'ArrowLeft') && dir && expand !== open) {
      e.preventDefault();
      alternar(path);
      return;
    }
    const items = [...raiz.current.querySelectorAll<HTMLElement>('[role=treeitem]')];
    const i = items.indexOf(li);
    const destinos: Record<string, HTMLElement | null | undefined> = {
      ArrowDown: items[i + 1], ArrowUp: items[i - 1], Home: items[0], End: items[items.length - 1],
      ArrowRight: li.querySelector<HTMLElement>('[role=treeitem]'),
      ArrowLeft: li.parentElement?.closest<HTMLElement>('[role=treeitem]'),
    };
    const destino = destinos[e.key] ?? (e.key.length === 1 ? buscar(items, i, e.key) : undefined);
    if (!destino) return;
    e.preventDefault();
    enfocar(destino.dataset.path ?? '');
  };

  const clic = (e: MouseEvent<HTMLUListElement>) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[role=treeitem]');
    if (li) activar(li.dataset.path ?? '', li.hasAttribute('aria-expanded'));
  };

  return (
    <section className="explorer" aria-labelledby="explorador-titulo">
      <h2 className="head" id="explorador-titulo">Proyecto web</h2>
      <ul className="tree" role="tree" aria-label="Archivos del proyecto" ref={raiz} onKeyDown={teclas} onClick={clic}>
        <Ramas nodos={nodos} base="" nivel={1} abiertos={abiertos} sel={sel} foco={foco} />
      </ul>
      <p className="cap" role="status" aria-live="polite">Seleccionado: {sel}</p>
    </section>
  );
}

// CSS: copia las reglas .explorer, .head, .tree, .row, [role=treeitem], [aria-selected], .chev, .ic, .name y .cap de la pestaña HTML + CSS.
