<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type Kind = 'mention' | 'ok' | 'warn' | 'info' | 'edit';
type Filter = 'todas' | 'sin-leer';
type Note = { id: string; kind: Kind; text: string; min: number; read: boolean };

const ICON: Record<Kind, string> = { mention: '@', ok: '✓', warn: '!', info: 'i', edit: '✎' };
const TABS: { id: Filter; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'sin-leer', label: 'Sin leer' },
];
const RTF = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const ago = (min: number) =>
  min < 60 ? RTF.format(-min, 'minute') : min < 1440 ? RTF.format(-Math.round(min / 60), 'hour') : RTF.format(-Math.round(min / 1440), 'day');

const props = withDefaults(defineProps<{ initial?: Note[] }>(), {
  initial: () => [
    { id: 'n1', kind: 'mention', text: 'Lucía Ferrer te mencionó en «Presupuesto Q3».', min: 4, read: false },
    { id: 'n2', kind: 'ok', text: 'Tu exportación de informes ya está lista para descargar.', min: 25, read: false },
    { id: 'n3', kind: 'warn', text: 'Tu plan vence en 3 días. Renueva para no perder el acceso.', min: 120, read: false },
    { id: 'n4', kind: 'edit', text: 'Marta Ruiz comentó en la revisión de contratos.', min: 200, read: true },
    { id: 'n5', kind: 'info', text: 'Hay una nueva versión 2.4 con mejoras de velocidad.', min: 600, read: false },
    { id: 'n6', kind: 'mention', text: 'Carlos Díaz te asignó una tarea del equipo.', min: 1500, read: true },
    { id: 'n7', kind: 'ok', text: 'Se completó la importación de 340 contactos.', min: 3000, read: true },
    { id: 'n8', kind: 'edit', text: 'Jorge Salas editó el documento «Política de viajes».', min: 5000, read: false },
  ],
});

const notes = ref(props.initial.map((n) => ({ ...n })));
const filter = ref<Filter>('todas');
const visible = ref<string[]>(notes.value.map((n) => n.id));
const open = ref(false);
const wrap = ref<HTMLElement | null>(null);
const bell = ref<HTMLButtonElement | null>(null);
const tabRefs = ref<Partial<Record<Filter, HTMLButtonElement>>>({});

const unread = computed(() => notes.value.filter((n) => !n.read).length);
const shown = computed(() => notes.value.filter((n) => visible.value.includes(n.id)));

function applyFilter(next: Filter) {
  filter.value = next;
  visible.value = notes.value.filter((n) => next === 'todas' || !n.read).map((n) => n.id);
}

function markAllRead() {
  notes.value.forEach((n) => (n.read = true));
  applyFilter(filter.value);
  tabRefs.value[filter.value]?.focus();
}

function openPanel() {
  open.value = true;
  nextTick(() => tabRefs.value[filter.value]?.focus());
}

function closePanel(returnFocus: boolean) {
  open.value = false;
  if (returnFocus) bell.value?.focus();
}

function onTabKey(e: KeyboardEvent, i: number) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (!step) return;
  e.preventDefault();
  const next = TABS[(i + step + TABS.length) % TABS.length].id;
  applyFilter(next);
  tabRefs.value[next]?.focus();
}

function onDocClick(e: MouseEvent) {
  if (open.value && !wrap.value?.contains(e.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <header class="top">
    <div>
      <h1>Panel de control</h1>
      <p>Actividad de tu equipo hoy</p>
    </div>
    <div ref="wrap" class="wrap" @keydown.esc="open && closePanel(true)">
      <button
        ref="bell"
        type="button"
        class="bell"
        aria-label="Notificaciones"
        aria-haspopup="dialog"
        :aria-expanded="open"
        aria-controls="pop"
        @click="open ? closePanel(true) : openPanel()"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span v-if="unread" class="badge" aria-hidden="true">{{ unread }}</span>
      </button>
      <span class="sr" aria-live="polite">{{ unread ? `${unread} sin leer` : 'Sin notificaciones sin leer' }}</span>
      <div v-if="open" id="pop" class="pop" role="dialog" aria-label="Notificaciones">
        <div class="head">
          <strong>Notificaciones</strong>
          <button type="button" class="link" :disabled="!unread" @click="markAllRead">Marcar todas como leídas</button>
        </div>
        <div class="tabs" role="tablist">
          <button
            v-for="(t, i) in TABS"
            :key="t.id"
            :ref="(el) => { if (el) tabRefs[t.id] = el as HTMLButtonElement }"
            type="button"
            role="tab"
            :id="`t-${t.id}`"
            aria-controls="panel"
            :aria-selected="filter === t.id"
            :tabindex="filter === t.id ? 0 : -1"
            class="tab"
            @click="applyFilter(t.id)"
            @keydown="onTabKey($event, i)"
          >
            {{ t.label }}
            <span v-if="t.id === 'sin-leer'" class="n">{{ unread }}</span>
          </button>
        </div>
        <div role="tabpanel" id="panel" :aria-labelledby="`t-${filter}`">
          <ul class="list">
            <li v-for="n in shown" :key="n.id">
              <button type="button" class="item" :data-unread="!n.read || undefined" @click="n.read = true">
                <span :class="['ico', n.kind]" aria-hidden="true">{{ ICON[n.kind] }}</span>
                <span class="txt">
                  <span v-if="!n.read" class="sr">Sin leer: </span>
                  {{ n.text }}
                  <time class="time">{{ ago(n.min) }}</time>
                </span>
                <span v-if="!n.read" class="dot" aria-hidden="true" />
              </button>
            </li>
          </ul>
          <div v-if="!shown.length" class="empty">
            <span class="check" aria-hidden="true">✓</span>
            <b>Estás al día</b>
            No tienes notificaciones sin leer.
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top,.pop{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.top,.head{display:flex;align-items:center;justify-content:space-between}
.top{gap:12px;padding:12px 14px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text)}
.top h1{margin:0;font-size:15px;letter-spacing:-.01em}
.top p{margin:0;font-size:13px;color:var(--muted)}
.wrap{position:relative;flex:none}
.bell,.badge,.ico{display:grid;place-items:center}
.bell{position:relative;width:40px;height:40px;padding:0;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer}
.bell:hover,.bell[aria-expanded=true]{border-color:var(--accent)}
.bell svg{width:20px;height:20px}
.badge{position:absolute;top:-7px;right:-7px;min-width:20px;height:20px;padding:0 6px;font-size:11px;font-weight:600;line-height:1;color:var(--accent-ink);background:var(--err);border:2px solid var(--surface);border-radius:999px;font-variant-numeric:tabular-nums}
.pop{position:absolute;right:0;top:calc(100% + 8px);z-index:10;width:min(360px,calc(100vw - 32px));overflow:hidden;transform-origin:top right;animation:pop-in .16s ease-out}
@keyframes pop-in{from{opacity:0;transform:translateY(-4px) scale(.98)}}
.head{gap:8px;padding:12px 14px;border-bottom:1px solid var(--border)}
.head strong{font-size:15px}
.link,.tab{font:inherit;font-size:13px;font-weight:600;background:none;cursor:pointer}
.link{padding:4px 2px;color:var(--accent);border:0}
.link:hover:not(:disabled){text-decoration:underline}
.link:disabled{color:var(--muted);cursor:not-allowed}
.tabs{display:flex;gap:4px;padding:6px;background:var(--bg);border-bottom:1px solid var(--border)}
.tab{flex:1;padding:6px 8px;color:var(--muted);border:1px solid transparent;border-radius:min(var(--radius),6px)}
.tab[aria-selected=true]{color:var(--text);background:var(--surface);border-color:var(--border)}
.tab .n{margin-left:4px;color:var(--accent);font-variant-numeric:tabular-nums}
.list{list-style:none;margin:0;padding:4px;max-height:320px;overflow-y:auto}
.item{display:flex;align-items:flex-start;gap:10px;width:100%;padding:10px;font:inherit;color:var(--muted);text-align:left;background:none;border:0;border-radius:min(var(--radius),6px);cursor:pointer}
.item:hover{background:var(--accent-soft)}
.item[data-unread]{color:var(--text);font-weight:600}
.ico{flex:none;width:28px;height:28px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:13px;font-weight:700}
.ico.ok{background:var(--ok-soft);color:var(--ok)}
.ico.warn{background:var(--warn-soft);color:var(--warn)}
.ico.info{background:var(--info-soft);color:var(--info)}
.txt{flex:1;min-width:0}
.time{display:block;font-size:12px;font-weight:400;color:var(--muted)}
.dot{flex:none;align-self:center;width:8px;height:8px;border-radius:50%;background:var(--accent)}
.empty{padding:24px 16px;text-align:center;color:var(--muted)}
.empty b{display:block;font-size:15px;color:var(--text)}
.check{display:inline-grid;place-items:center;width:36px;height:36px;margin-bottom:6px;border-radius:50%;background:var(--ok-soft);color:var(--ok);font-weight:700}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){.pop{animation:none}*{transition:none!important}}
</style>
