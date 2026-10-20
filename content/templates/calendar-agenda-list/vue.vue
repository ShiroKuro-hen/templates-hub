<script setup lang="ts">
import { computed, ref } from 'vue';

type Cat = 'reunion' | 'personal' | 'viaje';
type AgendaEvent = { id: string; day: number; start: number; dur: number; cat: Cat; title: string; place: string; who: string[] };
type Filter = 'all' | Cat;

const pad = (n: number) => String(n).padStart(2, '0');
const hm = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
const fmtDate = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const CATS: Record<Cat, string> = { reunion: 'Reunión', personal: 'Personal', viaje: 'Viaje' };
const FILTERS: [Filter, string][] = [['all', 'Todos'], ['reunion', 'Reuniones'], ['personal', 'Personal'], ['viaje', 'Viajes']];

const DAYS = [
  { date: new Date(2026, 9, 20), rel: 'Hoy' },
  { date: new Date(2026, 9, 21), rel: 'Mañana' },
  { date: new Date(2026, 9, 22), rel: '' },
  { date: new Date(2026, 9, 23), rel: '' },
];
const EVENTS: AgendaEvent[] = [
  { id: 'standup', day: 0, start: 540, dur: 30, cat: 'reunion', title: 'Standup de equipo', place: 'Sala Ámbar', who: ['Ana Ruiz', 'Luis Gómez'] },
  { id: 'diseno', day: 0, start: 600, dur: 90, cat: 'reunion', title: 'Revisión de diseño', place: 'Sala Cobalto', who: ['Ana Ruiz', 'Irene Pardo'] },
  { id: 'lucia', day: 0, start: 810, dur: 60, cat: 'personal', title: 'Comida con Lucía', place: 'Restaurante Olivo', who: ['Lucía Mena'] },
  { id: 'taller', day: 1, start: 570, dur: 120, cat: 'reunion', title: 'Taller de accesibilidad', place: 'Sala Norte', who: ['Marta Sanz', 'Irene Pardo'] },
  { id: 'traslado', day: 1, start: 1020, dur: 90, cat: 'viaje', title: 'Traslado al aeropuerto', place: 'Terminal 1', who: ['Tú'] },
  { id: 'vuelo', day: 2, start: 480, dur: 150, cat: 'viaje', title: 'Vuelo a Lisboa', place: 'Aeropuerto de Barajas', who: ['Tú'] },
  { id: 'presupuesto', day: 2, start: 660, dur: 60, cat: 'reunion', title: 'Revisión de presupuesto', place: 'Sala Cobalto', who: ['Carlos Vega', 'Ana Ruiz'] },
  { id: 'familia', day: 3, start: 780, dur: 30, cat: 'personal', title: 'Llamada familiar', place: 'Videollamada', who: ['Mamá'] },
  { id: 'candidatos', day: 3, start: 990, dur: 45, cat: 'reunion', title: 'Entrevista de candidatos', place: 'Sala Ámbar', who: ['Irene Pardo', 'Marta Sanz'] },
];

const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const icsText = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
const fold = (line: string) => line.replace(/.{73}(?=.)/g, '$&\r\n ');

function icsFor(ev: AgendaEvent, date: Date): string {
  const stamp = (min: number) => `${ymd(date)}T${hm(min).replace(':', '')}00`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//templates-hub//Agenda//ES', 'BEGIN:VEVENT',
    `UID:${ev.id}@templates-hub`, 'DTSTAMP:20261020T080000Z',
    `DTSTART:${stamp(ev.start)}`, `DTEND:${stamp(ev.start + ev.dur)}`,
    `SUMMARY:${icsText(ev.title)}`, `LOCATION:${icsText(ev.place)}`,
    `DESCRIPTION:${icsText(`Asistentes: ${ev.who.join(', ')}`)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

const canDownload = () => typeof URL.createObjectURL === 'function' && location.origin !== 'null';

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const filter = ref<Filter>('all');
const icsShown = ref<Record<string, string>>({});
const status = ref('');

const visible = computed(() => EVENTS.filter((ev) => filter.value === 'all' || ev.cat === filter.value));
const count = computed(() => visible.value.length);
const groups = computed(() =>
  DAYS.map((day, k) => ({
    day,
    k,
    items: visible.value.filter((ev) => ev.day === k).sort((a, b) => a.start - b.start),
  })).filter((g) => g.items.length > 0),
);

function setFilter(value: Filter, label: string) {
  filter.value = value;
  status.value = `Mostrando ${label.toLowerCase()}.`;
}

function addToCalendar(ev: AgendaEvent) {
  const text = icsFor(ev, DAYS[ev.day].date), name = `${ev.id}.ics`;
  if (canDownload()) {
    try {
      download(name, text);
      delete icsShown.value[ev.id];
      status.value = `Descarga iniciada: ${name}.`;
      return;
    } catch {}
  }
  icsShown.value[ev.id] = text;
  status.value = 'La descarga no está disponible en esta vista: abajo tienes el texto del .ics.';
}
</script>

<template>
  <section class="agenda" aria-labelledby="title">
    <header class="head">
      <div>
        <h2 id="title">Próximos días</h2>
        <p class="sub">{{ count }} {{ count === 1 ? 'evento' : 'eventos' }}</p>
      </div>
      <div class="chips" role="group" aria-label="Filtrar por categoría">
        <button v-for="[value, label] in FILTERS" :key="value" type="button" class="chip" :aria-pressed="String(filter === value)" @click="setFilter(value, label)">
          {{ label }}
        </button>
      </div>
    </header>
    <div class="list" tabindex="0" role="region" aria-label="Eventos por día, desplazable">
      <section v-for="g in groups" :key="g.k" class="group" :aria-labelledby="`g${g.k}`">
        <h3 :id="`g${g.k}`" class="gh">
          <template v-if="g.day.rel">{{ g.day.rel }} <span class="date">{{ cap(fmtDate.format(g.day.date)) }}</span></template>
          <template v-else>{{ cap(fmtDate.format(g.day.date)) }}</template>
        </h3>
        <ol class="items">
          <li v-for="ev in g.items" :key="ev.id" class="item" :data-cat="ev.cat">
            <time class="when">{{ hm(ev.start) }} – {{ hm(ev.start + ev.dur) }}</time>
            <div class="info">
              <b>{{ ev.title }}</b>
              <p class="meta"><span :class="['dot', ev.cat]" aria-hidden="true"></span>{{ CATS[ev.cat] }} · {{ ev.place }}</p>
              <ul class="avs" :aria-label="`Asistentes: ${ev.who.join(', ')}`">
                <li v-for="w in ev.who" :key="w" aria-hidden="true">{{ initials(w) }}</li>
              </ul>
            </div>
            <button type="button" class="add" @click="addToCalendar(ev)">Añadir al calendario</button>
            <details v-if="icsShown[ev.id]" class="ics" open>
              <summary>Ver texto .ics</summary>
              <pre>{{ icsShown[ev.id] }}</pre>
            </details>
          </li>
        </ol>
      </section>
    </div>
    <p v-if="count === 0" class="empty">No hay eventos de esta categoría en los próximos días.</p>
    <p class="status" role="status">{{ status }}</p>
  </section>
</template>

<style scoped>
.agenda { max-width:560px; margin:0 auto; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.head { display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:12px; padding:14px 16px; border-bottom:1px solid var(--border); }
h2 { margin:0; font-size:17px; font-weight:600; }
.sub { margin:2px 0 0; color:var(--muted); font-size:13px; }
.chips { display:flex; flex-wrap:wrap; gap:6px; }
button { font:inherit; color:var(--text); background:none; border:0; cursor:pointer; transition:background .14s, border-color .14s, color .14s; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.chip { padding:4px 12px; border:1px solid var(--border); border-radius:999px; background:var(--surface); font-size:13px; font-weight:500; }
.chip:hover { border-color:var(--muted); }
.chip[aria-pressed="true"] { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
.list { max-height:520px; overflow-y:auto; }
.gh { position:sticky; top:0; z-index:1; display:flex; flex-wrap:wrap; align-items:baseline; gap:0 8px; margin:0; padding:8px 16px; background:var(--surface); border-bottom:1px solid var(--border); font-size:13px; font-weight:600; }
.gh .date { color:var(--muted); font-weight:400; }
.items { margin:0; padding:0; list-style:none; }
.item { display:grid; grid-template-columns:auto 1fr; gap:6px 14px; padding:12px 16px; border-bottom:1px solid var(--border); }
.when { grid-column:1; color:var(--muted); font-size:13px; white-space:nowrap; font-variant-numeric:tabular-nums; }
.info { grid-column:2; min-width:0; }
.info b { display:block; font-weight:600; overflow-wrap:anywhere; }
.meta { margin:2px 0 0; color:var(--muted); font-size:13px; }
.dot { display:inline-block; width:8px; height:8px; margin-right:6px; border-radius:50%; background:var(--c); }
.reunion { --c:var(--accent); }
.personal { --c:var(--ok); }
.viaje { --c:var(--info); }
.avs { display:flex; margin:8px 0 0; padding:0; list-style:none; }
.avs li { display:grid; place-items:center; width:24px; height:24px; margin-left:-6px; border:2px solid var(--surface); border-radius:50%; background:var(--accent-soft); color:var(--accent); font-size:10px; font-weight:600; }
.avs li:first-child { margin-left:0; }
.add { grid-column:2; justify-self:start; margin-top:4px; padding:4px 10px; border:1px solid var(--border); border-radius:min(var(--radius),6px); background:var(--surface); font-size:13px; font-weight:500; }
.add:hover { border-color:var(--accent); color:var(--accent); }
.ics { grid-column:2; font-size:13px; }
.ics summary { width:max-content; cursor:pointer; color:var(--accent); }
.ics pre { margin:6px 0 0; padding:8px; overflow-x:auto; background:var(--bg); border:1px solid var(--border); border-radius:min(var(--radius),6px); font:12px/1.4 ui-monospace,Consolas,monospace; white-space:pre; }
.empty { margin:0; padding:24px 16px; text-align:center; color:var(--muted); }
.status { margin:0; min-height:40px; padding:10px 16px; border-top:1px solid var(--border); color:var(--muted); font-size:13px; }
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
</style>
