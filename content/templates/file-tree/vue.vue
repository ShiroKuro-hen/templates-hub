<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

type Nodo = { n: string; c?: Nodo[] };
type Tipo = 'folder' | 'ts' | 'css' | 'json' | 'md' | 'img';
type Fila = { path: string; name: string; level: number; dir: boolean; tipo: Tipo; parent: string | null };

const props = withDefaults(defineProps<{ nodos?: Nodo[] }>(), {
  nodos: () => [
    { n: 'src', c: [
      { n: 'components', c: [{ n: 'button.ts' }, { n: 'card.css' }] },
      { n: 'styles', c: [{ n: 'tokens.css' }] },
      { n: 'index.ts' },
    ] },
    { n: 'public', c: [{ n: 'logo.svg' }, { n: 'hero.jpg' }] },
    { n: 'docs', c: [{ n: 'leeme.md' }] },
    { n: 'package.json' },
    { n: 'tsconfig.json' },
  ],
});

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

const abiertos = ref<Set<string>>(new Set(['src']));
const sel = ref('src/index.ts');
const foco = ref('src/index.ts');
const arbol = ref<HTMLElement | null>(null);

function aplanar(nodos: Nodo[], base: string | null = null, level = 1, parent: string | null = null): Fila[] {
  return nodos.flatMap((nodo) => {
    const path = base ? `${base}/${nodo.n}` : nodo.n;
    const fila: Fila = {
      path, name: nodo.n, level, parent,
      dir: Boolean(nodo.c),
      tipo: nodo.c ? 'folder' : EXT[nodo.n.split('.').pop() ?? ''],
    };
    const hijos = nodo.c && abiertos.value.has(path) ? aplanar(nodo.c, path, level + 1, path) : [];
    return [fila, ...hijos];
  });
}
const filas = computed(() => aplanar(props.nodos));

const iconoPath = (tipo: Tipo) => (tipo === 'folder' ? FOLDER : FILE);
const enfocarFila = (path: string) => {
  foco.value = path;
  nextTick(() => arbol.value?.querySelector<HTMLElement>(`[data-path="${path}"]`)?.focus());
};
const alternar = (path: string) => {
  if (abiertos.value.has(path)) abiertos.value.delete(path);
  else abiertos.value.add(path);
};
const activar = (fila: Fila) => {
  sel.value = fila.path;
  if (fila.dir) alternar(fila.path);
  enfocarFila(fila.path);
};

function buscar(i: number, letra: string): Fila | undefined {
  const orden = [...filas.value.slice(i + 1), ...filas.value.slice(0, i + 1)];
  return orden.find((f) => f.name.toLowerCase().startsWith(letra.toLowerCase()));
}

function teclas(e: KeyboardEvent) {
  const path = (e.target as HTMLElement).closest<HTMLElement>('[role=treeitem]')?.dataset.path;
  const i = filas.value.findIndex((f) => f.path === path);
  const fila = filas.value[i];
  if (!fila) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    activar(fila);
    return;
  }
  const expand = e.key === 'ArrowRight';
  const abierta = abiertos.value.has(fila.path);
  if ((expand || e.key === 'ArrowLeft') && fila.dir && expand !== abierta) {
    e.preventDefault();
    alternar(fila.path);
    return;
  }
  const destinos: Record<string, Fila | undefined> = {
    ArrowDown: filas.value[i + 1],
    ArrowUp: filas.value[i - 1],
    Home: filas.value[0],
    End: filas.value[filas.value.length - 1],
    ArrowRight: fila.dir && abierta ? filas.value[i + 1] : undefined,
    ArrowLeft: filas.value.find((f) => f.path === fila.parent),
  };
  const destino = destinos[e.key] ?? (e.key.length === 1 ? buscar(i, e.key) : undefined);
  if (!destino) return;
  e.preventDefault();
  enfocarFila(destino.path);
}
</script>

<template>
  <section class="explorer" aria-labelledby="explorador-titulo">
    <h2 id="explorador-titulo" class="head">Proyecto web</h2>
    <ul ref="arbol" class="tree" role="tree" aria-label="Archivos del proyecto" @keydown="teclas">
      <li
        v-for="f in filas"
        :key="f.path"
        role="treeitem"
        :aria-level="f.level"
        :aria-expanded="f.dir ? abiertos.has(f.path) : undefined"
        :aria-selected="sel === f.path"
        :aria-label="f.name"
        :data-path="f.path"
        :tabindex="foco === f.path ? 0 : -1"
        @click="activar(f)"
      >
        <div class="row" :style="{ paddingLeft: `${8 + (f.level - 1) * 18}px` }">
          <svg v-if="f.dir" class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          <span v-else class="sp" />
          <svg :class="['ic', f.tipo]" viewBox="0 0 16 16" aria-hidden="true">
            <path :d="iconoPath(f.tipo)" />
            <path v-if="f.tipo !== 'folder'" :d="GLYPH[f.tipo]" />
          </svg>
          <span class="name">{{ f.name }}</span>
        </div>
      </li>
    </ul>
    <p class="cap" role="status" aria-live="polite">Seleccionado: {{ sel }}</p>
  </section>
</template>

<style scoped>
.explorer { width: 100%; max-width: 340px; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); color: var(--text); font: 14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.head { margin: 0; padding: 10px 12px; border-bottom: 1px solid var(--border); font-size: 14px; font-weight: 600; }
.tree { margin: 0; padding: 6px; list-style: none; max-height: 320px; overflow: auto; }
[role=treeitem] { outline: none; }
[role=treeitem]:focus-visible > .row { outline: 2px solid var(--accent); outline-offset: -2px; }
.row { position: relative; display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-radius: min(var(--radius), 6px); cursor: pointer; user-select: none; }
.row:hover { background: var(--accent-soft); }
[aria-selected=true] > .row { background: var(--accent-soft); font-weight: 600; }
[aria-selected=true] > .row::before { content: ""; position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px; border-radius: 2px; background: linear-gradient(135deg, var(--accent-2, #22d3ee), var(--accent, #2f5bff)); }
.chev, .ic { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.chev { flex: none; width: 12px; height: 12px; color: var(--muted); transition: transform .14s; }
[aria-expanded=true] > .row > .chev { transform: rotate(90deg); }
.sp { flex: none; width: 12px; }
.ic { flex: none; width: 16px; height: 16px; }
.folder { color: var(--accent); }
.ts { color: var(--info); }
.css { color: var(--ok); }
.json { color: var(--warn); }
.md { color: var(--muted); }
.img { color: var(--err); }
.name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cap { margin: 0; padding: 8px 12px; border-top: 1px solid var(--border); color: var(--muted); font-size: 13px; overflow-wrap: anywhere; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
