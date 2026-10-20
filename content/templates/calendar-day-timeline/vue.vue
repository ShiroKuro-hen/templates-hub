<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

type Cat = 'reunion' | 'personal' | 'viaje';
type DayEvent = { title: string; start: number; dur: number; cat: Cat; place: string; who: string[] };
type Day = { date: Date; events: DayEvent[] };
type Placed = DayEvent & { id: number; i: number; n: number };
type FieldErrors = Partial<Record<'title' | 'start' | 'dur', string>>;

const START = 480, END = 1140, NOW = 640;
const fmtDay = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
const pad = (n: number) => String(n).padStart(2, '0');
const hm = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
const dayLabel = (d: Date) => { const t = fmtDay.format(d); return t[0].toUpperCase() + t.slice(1); };

const INITIAL_DAYS: Day[] = [
  { date: new Date(2026, 9, 20), events: [
    { title: 'Standup de equipo', start: 540, dur: 30, cat: 'reunion', place: 'Sala Ámbar', who: ['Ana Ruiz', 'Luis Gómez', 'Marta Sanz'] },
    { title: 'Revisión de diseño', start: 600, dur: 90, cat: 'reunion', place: 'Sala Cobalto', who: ['Ana Ruiz', 'Irene Pardo'] },
    { title: 'Llamada con proveedor', start: 630, dur: 60, cat: 'reunion', place: 'Videollamada', who: ['Pablo Díaz', 'Luis Gómez'] },
    { title: 'Comida con Lucía', start: 810, dur: 60, cat: 'personal', place: 'Restaurante Olivo', who: ['Lucía Mena'] },
    { title: 'Entrega del informe', start: 960, dur: 60, cat: 'reunion', place: 'Despacho 3B', who: ['Ana Ruiz', 'Carlos Vega'] },
    { title: 'Gimnasio', start: 1020, dur: 60, cat: 'personal', place: 'Club Norte', who: ['Tú'] },
  ] },
  { date: new Date(2026, 9, 21), events: [
    { title: 'Taller de accesibilidad', start: 570, dur: 120, cat: 'reunion', place: 'Sala Norte', who: ['Marta Sanz', 'Irene Pardo', 'Tú'] },
    { title: 'Entrevista UX', start: 660, dur: 60, cat: 'reunion', place: 'Videollamada', who: ['Irene Pardo', 'Carlos Vega'] },
    { title: 'Almuerzo de equipo', start: 840, dur: 60, cat: 'personal', place: 'Cantina Sur', who: ['Ana Ruiz', 'Luis Gómez'] },
    { title: 'Traslado al aeropuerto', start: 1020, dur: 90, cat: 'viaje', place: 'Terminal 1', who: ['Tú'] },
  ] },
  { date: new Date(2026, 9, 22), events: [
    { title: 'Vuelo a Lisboa', start: 480, dur: 150, cat: 'viaje', place: 'Aeropuerto de Barajas', who: ['Tú'] },
    { title: 'Revisión de presupuesto', start: 660, dur: 60, cat: 'reunion', place: 'Sala Cobalto', who: ['Carlos Vega', 'Ana Ruiz'] },
    { title: 'Llamada familiar', start: 780, dur: 30, cat: 'personal', place: 'Videollamada', who: ['Mamá'] },
    { title: 'Reunión con cliente', start: 795, dur: 75, cat: 'reunion', place: 'Oficinas Atlas', who: ['Pablo Díaz', 'Tú'] },
    { title: 'Entrevista de candidatos', start: 990, dur: 45, cat: 'reunion', place: 'Sala Ámbar', who: ['Irene Pardo', 'Marta Sanz'] },
  ] },
];

function layoutDay(events: DayEvent[]): Placed[] {
  const sorted = events.map((ev, id) => ({ ...ev, id, i: 0, n: 1 })).sort((a, b) => a.start - b.start || b.dur - a.dur);
  const out: Placed[] = [];
  let group: Placed[] = [], groupEnd = 0, lanes: number[] = [];
  const flush = () => {
    group.forEach((ev) => { ev.n = lanes.length; });
    out.push(...group);
    group = [];
    lanes = [];
  };
  for (const ev of sorted) {
    if (ev.start >= groupEnd) flush();
    let i = lanes.findIndex((end) => end <= ev.start);
    if (i === -1) i = lanes.push(0) - 1;
    lanes[i] = ev.start + ev.dur;
    ev.i = i;
    groupEnd = Math.max(groupEnd, ev.start + ev.dur);
    group.push(ev);
  }
  flush();
  return out;
}

function checkEvent(title: string, time: string, dur: number): FieldErrors {
  const errors: FieldErrors = {};
  if (!title) errors.title = 'Escribe un título.';
  const at = /^\d{2}:\d{2}$/.test(time) ? toMin(time) : NaN;
  if (!(at >= START && at < END)) errors.start = 'Elige una hora entre 08:00 y 18:59.';
  if (!Number.isInteger(dur) || dur < 15 || dur > 240 || dur % 15) errors.dur = 'Usa de 15 a 240 minutos, en tramos de 15.';
  else if (!errors.start && at + dur > END) errors.dur = 'El evento debe terminar antes de las 19:00.';
  return errors;
}

const days = ref<Day[]>(INITIAL_DAYS);
const current = ref(0);
const openId = ref<number | null>(null);
const addAt = ref<number | null>(null);
const errors = ref<FieldErrors>({});
const status = ref('');
const dialog = ref<HTMLDialogElement | null>(null);
const scroller = ref<HTMLDivElement | null>(null);
const nowLine = ref<HTMLLIElement | null>(null);
const heading = ref<HTMLHeadingElement | null>(null);
let opener: HTMLButtonElement | null = null;

const day = computed(() => days.value[current.value]);
const placed = computed(() => layoutDay(day.value.events));
const detailEvent = computed(() => (openId.value === null ? null : day.value.events[openId.value]));
const count = computed(() => day.value.events.length);
const hours = Array.from({ length: 12 }, (_, k) => ({ k, label: hm(START + k * 60) }));
const slots = Array.from({ length: 11 }, (_, k) => ({ k, label: hm(START + k * 60), min: START + k * 60 }));

watch(addAt, async (v) => {
  await nextTick();
  if (v !== null) dialog.value?.showModal();
  else dialog.value?.close();
});

watch(openId, async (v) => {
  if (v === null) return;
  await nextTick();
  heading.value?.focus();
});

function shift(n: number) {
  current.value = (current.value + n + days.value.length) % days.value.length;
  openId.value = null;
  status.value = `Mostrando ${dayLabel(day.value.date).toLowerCase()}.`;
}

async function showNow() {
  current.value = 0;
  status.value = 'Ahora son las 10:40.';
  await nextTick();
  const el = scroller.value, now = nowLine.value;
  if (!el || !now) return;
  const top = now.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  el.scrollTo({ top: top - el.clientHeight / 2, behavior });
}

function openDetail(id: number, e: MouseEvent) {
  opener = e.currentTarget as HTMLButtonElement;
  openId.value = id;
}

function closeDetail() {
  openId.value = null;
  opener?.focus();
}

function openAdd(min = 720) {
  errors.value = {};
  addAt.value = min;
}

function onSubmit(e: Event) {
  const form = e.target as HTMLFormElement;
  const data = new FormData(form);
  const title = String(data.get('title') ?? '').trim();
  const time = String(data.get('start') ?? '');
  const dur = Number(data.get('dur'));
  const found = checkEvent(title, time, dur);
  errors.value = found;
  const first = Object.keys(found)[0];
  if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
  if (Object.keys(found).length) return;
  const at = toMin(time);
  day.value.events.push({ title, start: at, dur, cat: 'personal', place: 'Por definir', who: ['Tú'] });
  openId.value = null;
  addAt.value = null;
  status.value = `Evento "${title}" añadido a las ${hm(at)}.`;
}
</script>

<template>
  <section class="cal" aria-labelledby="title">
    <header class="top">
      <div>
        <h2 id="title">{{ dayLabel(day.date) }}</h2>
        <p class="sub">{{ current === 0 ? 'Hoy · ' : '' }}{{ count }} {{ count === 1 ? 'evento' : 'eventos' }}</p>
      </div>
      <div class="tools">
        <button type="button" class="btn" aria-label="Día anterior" @click="shift(-1)">‹</button>
        <button type="button" class="btn" aria-label="Día siguiente" @click="shift(1)">›</button>
        <button type="button" class="btn ahora" @click="showNow">Ahora</button>
        <button type="button" class="btn main" @click="openAdd()">Añadir evento</button>
      </div>
    </header>
    <div ref="scroller" class="scroller" tabindex="0" role="region" aria-label="Agenda del día, desplazable">
      <div class="body">
        <ol class="hours" aria-hidden="true">
          <li v-for="h in hours" :key="h.k" :style="{ '--s': h.k }">{{ h.label }}</li>
        </ol>
        <ol class="day" aria-label="Eventos del día">
          <li v-for="s in slots" :key="s.k" class="slot" :style="{ '--s': s.k }">
            <button type="button" :aria-label="`Añadir evento a las ${s.label}`" @click="openAdd(s.min)"></button>
          </li>
          <li v-for="ev in placed" :key="ev.id" :class="['ev', ev.cat, { sh: ev.dur < 60 }]" :style="{ '--s': (ev.start - START) / 60, '--d': ev.dur / 60, '--i': ev.i, '--n': ev.n }">
            <button type="button" @click="openDetail(ev.id, $event)">
              <b>{{ ev.title }}</b>
              <time>{{ hm(ev.start) }} – {{ hm(ev.start + ev.dur) }}</time>
            </button>
          </li>
          <li v-if="current === 0" ref="nowLine" class="now" :style="{ '--s': (NOW - START) / 60 }" aria-hidden="true"></li>
        </ol>
      </div>
    </div>
    <section v-if="detailEvent" class="detail" aria-label="Detalle del evento" @keydown.esc="closeDetail">
      <h3 ref="heading" tabindex="-1">{{ detailEvent.title }}</h3>
      <p>{{ dayLabel(day.date) }} · {{ hm(detailEvent.start) }} – {{ hm(detailEvent.start + detailEvent.dur) }}</p>
      <dl>
        <dt>Lugar</dt>
        <dd>{{ detailEvent.place }}</dd>
        <dt>Asistentes</dt>
        <dd>
          <ul class="people">
            <li v-for="w in detailEvent.who" :key="w"><span class="av" aria-hidden="true">{{ initials(w) }}</span>{{ w }}</li>
          </ul>
        </dd>
      </dl>
      <button type="button" class="btn" @click="closeDetail">Cerrar detalle</button>
    </section>
    <p class="status" role="status">{{ status }}</p>
  </section>
  <dialog ref="dialog" aria-labelledby="dlg-title" @close="addAt = null">
    <form v-if="addAt !== null" :key="addAt" novalidate @submit.prevent="onSubmit">
      <h3 id="dlg-title">Nuevo evento</h3>
      <label>Título <input name="title" maxlength="60" aria-describedby="e-title" :aria-invalid="String(!!errors.title)" /></label>
      <p class="err" id="e-title">{{ errors.title }}</p>
      <label>Inicio <input name="start" type="time" step="900" :value="hm(addAt)" aria-describedby="e-start" :aria-invalid="String(!!errors.start)" /></label>
      <p class="err" id="e-start">{{ errors.start }}</p>
      <label>Duración (minutos) <input name="dur" type="number" min="15" max="240" step="15" value="60" aria-describedby="e-dur" :aria-invalid="String(!!errors.dur)" /></label>
      <p class="err" id="e-dur">{{ errors.dur }}</p>
      <div class="acts">
        <button type="button" class="btn" @click="addAt = null">Cancelar</button>
        <button type="submit" class="btn main">Añadir</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.cal { --h:56px; max-width:560px; margin:0 auto; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.top { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px 12px; padding:14px 16px; border-bottom:1px solid var(--border); }
h2 { margin:0; font-size:17px; font-weight:600; }
.sub { margin:2px 0 0; color:var(--muted); font-size:13px; }
.tools { display:flex; flex-wrap:wrap; gap:6px; }
button, input { font:inherit; color:var(--text); transition:background .14s, border-color .14s; }
button { background:none; border:0; cursor:pointer; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.btn { display:inline-flex; align-items:center; justify-content:center; min-width:32px; height:32px; padding:0 10px; border:1px solid var(--border); border-radius:min(var(--radius),6px); background:var(--surface); font-weight:500; }
.btn:hover { border-color:var(--muted); }
.btn.main { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
.scroller { max-height:420px; overflow-y:auto; }
.body { display:flex; padding:8px 12px; }
.hours, .day { margin:0; padding:0; list-style:none; height:calc(11 * var(--h)); }
.hours { position:relative; flex:none; width:44px; }
.hours li { position:absolute; right:6px; top:calc(var(--s) * var(--h)); transform:translateY(-50%); color:var(--muted); font-size:12px; line-height:1; font-variant-numeric:tabular-nums; }
.day { position:relative; flex:1; min-width:0; border-left:1px solid var(--border); background:repeating-linear-gradient(to bottom, var(--border) 0 1px, transparent 1px var(--h)); }
.slot, .ev, .now { position:absolute; margin:0; list-style:none; }
.slot { left:0; right:0; top:calc(var(--s) * var(--h)); height:var(--h); }
.slot button { display:block; width:100%; height:100%; }
.slot button:hover { background:var(--accent-soft); }
.ev { z-index:1; top:calc(var(--s) * var(--h) + 2px); height:calc(var(--d) * var(--h) - 4px); left:calc(var(--i) * 100% / var(--n) + 3px); width:calc(100% / var(--n) - 6px); }
.ev button { display:block; width:100%; height:100%; overflow:hidden; padding:4px 8px; text-align:left; font-size:12px; line-height:1.25; background:var(--cs); border:1px solid var(--c); border-left-width:3px; border-radius:min(var(--radius),6px); }
.ev button:hover { box-shadow:var(--shadow); }
.ev b, .ev time { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ev time { color:var(--muted); }
.ev.sh time { display:none; }
.reunion { --c:var(--accent); --cs:var(--accent-soft); }
.personal { --c:var(--ok); --cs:var(--ok-soft); }
.viaje { --c:var(--info); --cs:var(--info-soft); }
.now { z-index:0; left:0; right:0; top:calc(var(--s) * var(--h)); height:2px; margin-top:-1px; background:linear-gradient(90deg, var(--accent-2,#22d3ee), var(--accent,#2f5bff)); pointer-events:none; }
.now::before { content:""; position:absolute; left:-4px; top:-3px; width:8px; height:8px; border-radius:999px; background:var(--accent); }
.status { margin:0; min-height:40px; padding:10px 16px; border-top:1px solid var(--border); color:var(--muted); font-size:13px; }
.detail { padding:14px 16px; border-top:1px solid var(--border); background:var(--bg); }
.detail h3 { margin:0; font-size:15px; font-weight:600; }
.detail p { margin:2px 0 0; color:var(--muted); font-size:13px; }
.detail dl { display:grid; grid-template-columns:auto 1fr; gap:6px 12px; margin:12px 0; font-size:13px; }
.detail dt { color:var(--muted); }
.detail dd { margin:0; }
.people { display:flex; flex-wrap:wrap; gap:6px 10px; margin:0; padding:0; list-style:none; }
.people li { display:flex; align-items:center; gap:6px; }
.av { display:grid; place-items:center; width:24px; height:24px; border-radius:50%; background:var(--accent-soft); color:var(--accent); font-size:11px; font-weight:600; }
dialog { width:min(calc(100vw - 32px), 360px); padding:20px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
dialog::backdrop { background:rgba(10,15,28,.5); }
dialog h3 { margin:0 0 12px; font-size:16px; }
label { display:grid; gap:4px; margin-bottom:10px; font-weight:500; }
input { padding:8px 10px; background:var(--bg); border:1px solid var(--border); border-radius:min(var(--radius),6px); }
input[aria-invalid="true"] { border-color:var(--err); }
.err { margin:0; color:var(--err); font-size:12px; }
.err:empty { display:none; }
.acts { display:flex; justify-content:flex-end; gap:8px; margin-top:14px; }
@media (max-width:480px) {
  .ahora, .hours, .slot, .now { display:none; }
  .body { padding:8px 12px; }
  .day { display:flex; flex-direction:column; gap:8px; height:auto; padding:0; border:0; background:none; }
  .ev { position:static; width:auto; height:auto; }
  .ev button { height:auto; padding:8px 10px; }
  .ev.sh time { display:block; }
}
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
</style>
