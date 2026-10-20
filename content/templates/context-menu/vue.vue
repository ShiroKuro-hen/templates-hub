<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Archivo = { nombre: string; meta: string; ext: string };
type Abierto = { x: number; y: number; tarjeta: HTMLElement };

const props = withDefaults(defineProps<{ archivos?: Archivo[] }>(), {
  archivos: () => [
    { nombre: 'informe-q3.pdf', meta: '2,4 MB · Hace 2 h', ext: 'PDF' },
    { nombre: 'presupuesto.xlsx', meta: '812 KB · Ayer', ext: 'XLSX' },
    { nombre: 'logo.svg', meta: '14 KB · Hace 3 días', ext: 'SVG' },
    { nombre: 'notas-reunion.md', meta: '3 KB · Hace 1 semana', ext: 'MD' },
  ],
});

const DESTINOS = ['Documentos', 'Descargas', 'Proyectos'];
const MENSAJES: Record<string, (nombre: string) => string> = {
  abrir: (n) => `Abriste ${n}.`,
  renombrar: (n) => `Renombrar ${n}: escribe el nombre nuevo.`,
  duplicar: (n) => `Duplicaste ${n}.`,
  eliminar: (n) => `Eliminaste ${n}.`,
};
const MARGEN = 8;

const menu = ref<Abierto | null>(null);
const subAbierto = ref(false);
const mensaje = ref('Aún no has elegido ninguna acción.');
const menuEl = ref<HTMLElement | null>(null);
const disparador = ref<HTMLElement | null>(null);
const subEl = ref<HTMLElement | null>(null);

const acotar = (valor: number, min: number, max: number) => Math.max(min, Math.min(valor, max));
const elementos = () =>
  [...(menuEl.value?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])].filter(
    (el) => el.getAttribute('aria-disabled') !== 'true',
  );

function colocar() {
  const el = menuEl.value;
  if (!el || !menu.value) return;
  el.style.left = `${acotar(menu.value.x, MARGEN, innerWidth - el.offsetWidth - MARGEN)}px`;
  el.style.top = `${acotar(menu.value.y, MARGEN, innerHeight - el.offsetHeight - MARGEN)}px`;
}
function abrir(x: number, y: number, tarjeta: HTMLElement) {
  menu.value = { x, y, tarjeta };
  subAbierto.value = false;
  nextTick(() => {
    colocar();
    elementos()[0]?.focus();
  });
}
function cerrar() {
  if (menu.value && menuEl.value?.contains(document.activeElement)) menu.value.tarjeta.focus();
  menu.value = null;
  subAbierto.value = false;
}
function accion(texto: string) {
  mensaje.value = texto;
  cerrar();
}
watch(subAbierto, () => nextTick(colocar));

function abrirDesdeClic(e: MouseEvent) {
  e.preventDefault();
  abrir(e.clientX, e.clientY, e.currentTarget as HTMLElement);
}
function abrirDesdeTeclado(e: KeyboardEvent) {
  if (!(e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10'))) return;
  e.preventDefault();
  const tarjeta = e.currentTarget as HTMLElement;
  const r = tarjeta.getBoundingClientRect();
  abrir(r.left + 24, r.bottom - 8, tarjeta);
}

function teclasMenu(e: KeyboardEvent) {
  const activo = document.activeElement as HTMLElement;
  const items = elementos();
  const i = items.indexOf(activo);
  const n = items.length;
  if (e.key === 'ArrowRight' && activo === disparador.value) {
    e.preventDefault();
    subAbierto.value = true;
    nextTick(() => subEl.value?.querySelector<HTMLElement>('[role=menuitem]')?.focus());
    return;
  }
  if (e.key === 'ArrowLeft' && subEl.value?.contains(activo)) {
    e.preventDefault();
    subAbierto.value = false;
    disparador.value?.focus();
    return;
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    if (subAbierto.value) {
      subAbierto.value = false;
      disparador.value?.focus();
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
}

function clicMenu(e: MouseEvent) {
  const item = (e.target as HTMLElement).closest<HTMLElement>('[role=menuitem]');
  if (!item || item.getAttribute('aria-disabled') === 'true' || !menu.value) return;
  if (item === disparador.value) {
    subAbierto.value = !subAbierto.value;
    return;
  }
  const nombre = menu.value.tarjeta.dataset.name ?? '';
  const destino = item.dataset.dest;
  accion(destino ? `Moviste ${nombre} a ${destino}.` : MENSAJES[item.dataset.act ?? ''](nombre));
}

const alFueraClic = (e: PointerEvent) => {
  if (menu.value && !menuEl.value?.contains(e.target as Node)) menu.value = null;
};
const alDesplazar = () => {
  if (menu.value) cerrar();
};
onMounted(() => {
  document.addEventListener('pointerdown', alFueraClic);
  document.addEventListener('scroll', alDesplazar, { capture: true, passive: true });
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', alFueraClic);
  document.removeEventListener('scroll', alDesplazar, { capture: true });
});
</script>

<template>
  <main>
    <ul class="files">
      <li v-for="a in props.archivos" :key="a.nombre">
        <article class="card" tabindex="0" :data-name="a.nombre" @contextmenu="abrirDesdeClic" @keydown="abrirDesdeTeclado">
          <span class="ext" aria-hidden="true">{{ a.ext }}</span>
          <span class="meta"><strong>{{ a.nombre }}</strong><span>{{ a.meta }}</span></span>
        </article>
      </li>
    </ul>
    <p class="hint">Clic derecho, Mayús+F10 o la tecla Menú sobre un archivo abre sus acciones.</p>
    <p class="log" role="status" aria-live="polite">{{ mensaje }}</p>
    <div v-if="menu" ref="menuEl" class="menu" role="menu" aria-label="Acciones del archivo" @keydown="teclasMenu" @click="clicMenu">
      <button type="button" role="menuitem" tabindex="-1" data-act="abrir">Abrir</button>
      <button type="button" role="menuitem" tabindex="-1" data-act="renombrar">Renombrar</button>
      <button type="button" role="menuitem" tabindex="-1" data-act="duplicar">Duplicar</button>
      <button type="button" role="menuitem" tabindex="-1" aria-disabled="true">Compartir (próximamente)</button>
      <hr role="separator" />
      <button ref="disparador" type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" :aria-expanded="subAbierto" data-sub>
        Mover a
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
      </button>
      <div v-if="subAbierto" ref="subEl" role="group" aria-label="Mover a">
        <button v-for="d in DESTINOS" :key="d" type="button" role="menuitem" tabindex="-1" data-act="mover" :data-dest="d">{{ d }}</button>
      </div>
      <hr role="separator" />
      <button type="button" role="menuitem" tabindex="-1" class="danger" data-act="eliminar">Eliminar</button>
    </div>
  </main>
</template>

<style scoped>
.files { display: grid; gap: 10px; max-width: 420px; margin: 0; padding: 0; list-style: none; font: 14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color: var(--text); }
.card { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); cursor: context-menu; }
.card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.ext { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: min(var(--radius), 6px); background: linear-gradient(135deg, var(--accent-2, #22d3ee), var(--accent, #2f5bff)); color: var(--accent-ink); font: 600 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif; }
.meta { min-width: 0; }
.meta strong { display: block; overflow-wrap: anywhere; }
.meta span, .hint { color: var(--muted); font-size: 13px; }
.hint, .log { max-width: 420px; margin: 12px 0 0; }
.log { color: var(--text); font-weight: 600; }
.menu { position: fixed; z-index: 20; min-width: 220px; padding: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); font: 14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.menu hr { margin: 6px 4px; border: 0; border-top: 1px solid var(--border); }
[role=group] { padding-left: 12px; }
[role=menuitem] { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; height: 34px; padding: 0 10px; font: inherit; text-align: left; color: var(--text); background: none; border: 0; border-radius: min(var(--radius), 6px); cursor: pointer; }
[role=menuitem]:hover { background: var(--accent-soft); }
[role=menuitem]:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
[role=menuitem][aria-disabled=true] { color: var(--muted); background: none; cursor: not-allowed; }
[role=menuitem].danger { color: var(--err); }
.chev { flex: none; width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; color: var(--muted); transition: transform .14s; }
[aria-expanded=true] > .chev { transform: rotate(90deg); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
