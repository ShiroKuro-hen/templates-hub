<script setup lang="ts">
import { computed, ref } from 'vue';

type Level = 'ok' | 'warn' | 'err';
type Tone = Level | 'info';
type Step = 'investigating' | 'monitoring' | 'resolved';
type Day = { s: Level; up: number };
type Service = { name: string; days: Day[]; up: number; state: Level };
export type Incident = { svc: number; ago: number; level: Level; title: string; updates: [string, Step, string][] };

const TODAY = new Date(2026, 9, 20);
const DAYS = 90;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SVCS = ['API pública', 'Web', 'Base de datos', 'Correo', 'Autenticación', 'Almacenamiento', 'Pagos', 'Webhooks'];
const STATE: Record<Level, string> = { ok: 'Operativo', warn: 'Degradado', err: 'Incidencia' };
const RANK: Record<Level, number> = { ok: 0, warn: 1, err: 2 };
const STEP: Record<Step, [string, Tone]> = {
  investigating: ['Investigando', 'warn'],
  monitoring: ['En observación', 'info'],
  resolved: ['Resuelto', 'ok'],
};
const props = withDefaults(defineProps<{ incidents?: Incident[] }>(), {
  incidents: () => [
    { svc: 7, ago: 0, level: 'warn', title: 'Entregas de webhooks con retraso', updates: [
      ['07:48', 'investigating', 'Algunos webhooks se entregan con retraso. Revisamos la cola de reintentos.'],
    ] },
    { svc: 1, ago: 1, level: 'warn', title: 'Carga lenta del panel desde Europa', updates: [
      ['11:02', 'investigating', 'Algunos usuarios de Europa notan tiempos de carga superiores a 6 segundos.'],
      ['12:18', 'resolved', 'Una caché defectuosa ralentizaba el panel. Está corregida y los tiempos son los habituales.'],
    ] },
    { svc: 3, ago: 3, level: 'warn', title: 'Retrasos en el envío de correos', updates: [
      ['14:20', 'investigating', 'Los correos de verificación tardan hasta 15 minutos en llegar.'],
      ['15:55', 'monitoring', 'Reducimos la cola de envíos. Los tiempos vuelven a estar por debajo de 2 minutos.'],
    ] },
    { svc: 6, ago: 5, level: 'err', title: 'Cobros rechazados con tarjetas internacionales', updates: [
      ['08:12', 'investigating', 'Detectamos un aumento de rechazos al cobrar con tarjetas emitidas fuera de la UE.'],
      ['09:05', 'monitoring', 'Identificamos la causa en un proveedor externo. Aplicamos un ajuste y vigilamos las transacciones.'],
      ['10:40', 'resolved', 'Los cobros se procesan con normalidad. Reintentaremos los pagos rechazados de las últimas horas.'],
    ] },
  ],
});

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pct = (v: number) => `${v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
const fecha = (ago: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - ago);
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
};
const uptime = (s: Level, r: number) => (s === 'ok' ? 100 - r * 0.05 : s === 'warn' ? 98.5 + r * 1.2 : 90 + r * 6);

function history(seed: number, incidents: Incident[]): Day[] {
  const next = rng(seed);
  const days: Day[] = Array.from({ length: DAYS }, (_, i) => {
    const r = next();
    const s: Level = i < DAYS - 7 ? (r < 0.006 ? 'err' : r < 0.04 ? 'warn' : 'ok') : 'ok';
    return { s, up: uptime(s, next()) };
  });
  incidents.forEach(({ ago, level }) => {
    days[DAYS - 1 - ago] = { s: level, up: uptime(level, next()) };
  });
  return days;
}

const services = computed<Service[]>(() =>
  SVCS.map((name, svc) => {
    const days = history(svc * 7919 + 17, props.incidents.filter((x) => x.svc === svc));
    return { name, days, up: days.reduce((sum, d) => sum + d.up, 0) / DAYS, state: days[DAYS - 1].s };
  }),
);
const worst = computed<Level>(() => services.value.reduce<Level>((w, s) => (RANK[s.state] > RANK[w] ? s.state : w), 'ok'));
const hit = computed(() => services.value.filter((s) => s.state !== 'ok').length);
const banner = computed<[string, string]>(() => {
  if (worst.value === 'ok') return ['Todos los sistemas operativos', 'No hay incidencias abiertas.'];
  const afectados = hit.value === 1 ? '1 servicio afectado' : `${hit.value} servicios afectados`;
  return worst.value === 'warn'
    ? ['Rendimiento degradado', `${afectados}. Seguimos trabajando en ello.`]
    : ['Incidencia en curso', `${afectados}. Te avisaremos al resolverla.`];
});

const label = (d: Day, i: number) => `${fecha(DAYS - 1 - i)}: ${pct(d.up)} disponible, ${STATE[d.s]}`;

const tip = ref<{ text: string; x: number; y: number } | null>(null);
function showTip(e: Event) {
  const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-tip]');
  if (!cell) return;
  const r = cell.getBoundingClientRect();
  tip.value = { text: cell.dataset.tip ?? '', x: r.left + r.width / 2, y: r.top };
}
function moveFocus(e: KeyboardEvent) {
  if (e.key === 'Escape') return (tip.value = null);
  const bar = e.currentTarget as HTMLElement;
  const cells = Array.from(bar.children) as HTMLButtonElement[];
  const i = cells.indexOf(e.target as HTMLButtonElement);
  const next: Partial<Record<string, number>> = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: cells.length - 1 };
  const target = next[e.key];
  if (target === undefined) return;
  e.preventDefault();
  const j = Math.min(Math.max(target, 0), cells.length - 1);
  cells.forEach((c, k) => (c.tabIndex = k === j ? 0 : -1));
  cells[j].focus();
}

const email = ref('');
const error = ref('');
const sent = ref('');
const input = ref<HTMLInputElement | null>(null);
function submit() {
  const v = email.value.trim();
  error.value = !v ? 'Escribe tu correo para suscribirte.'
    : EMAIL.test(v) ? '' : 'Revisa el correo: debe tener @ y un dominio, por ejemplo ana@empresa.com.';
  if (error.value) return input.value?.focus();
  sent.value = v;
}
</script>

<template>
  <main class="page">
    <header class="top">
      <h1>Estado de Nimbo</h1>
      <p class="meta">Actualizado hoy a las 09:42</p>
    </header>
    <div class="banner" :data-s="worst" role="status" aria-live="polite">
      <span class="ico" aria-hidden="true" />
      <div><p class="bt">{{ banner[0] }}</p><p class="bs">{{ banner[1] }}</p></div>
    </div>
    <section class="sec" aria-labelledby="svc-t">
      <div class="sec-h">
        <h2 id="svc-t">Servicios</h2>
        <ul class="legend">
          <li data-s="ok"><i aria-hidden="true" />Operativo</li>
          <li data-s="warn"><i aria-hidden="true" />Degradado</li>
          <li data-s="err"><i aria-hidden="true" />Incidencia</li>
        </ul>
      </div>
      <p class="hint">Cada barra es un día. Con el teclado, usa las flechas para recorrerlas.</p>
      <ul class="svcs">
        <li v-for="s in services" :key="s.name" class="svc">
          <div class="svc-h">
            <h3>{{ s.name }}</h3>
            <p class="stat"><span class="pct">{{ pct(s.up) }}</span><span class="pill" :data-s="s.state"><i aria-hidden="true" />{{ STATE[s.state] }}</span></p>
          </div>
          <div
            class="bar"
            role="group"
            :aria-label="`Disponibilidad de ${s.name} en los últimos 90 días`"
            @pointerover="showTip"
            @pointerout="tip = null"
            @focusin="showTip"
            @focusout="tip = null"
            @keydown="moveFocus"
          >
            <button
              v-for="(d, i) in s.days"
              :key="i"
              type="button"
              class="cell"
              :data-s="d.s"
              :data-tip="label(d, i)"
              :aria-label="label(d, i)"
              :tabindex="i === DAYS - 1 ? 0 : -1"
            />
          </div>
          <div class="foot"><span>Hace 90 días</span><span>Hoy</span></div>
        </li>
      </ul>
    </section>
    <section class="sec" aria-labelledby="inc-t">
      <h2 id="inc-t">Incidencias de los últimos 7 días</h2>
      <ul class="incs">
        <li v-for="x in props.incidents" :key="x.title" class="inc">
          <h3>{{ x.title }}</h3>
          <p class="inc-meta">{{ SVCS[x.svc] }} · {{ fecha(x.ago) }}</p>
          <ol class="tl">
            <li v-for="[hora, st, texto] in x.updates" :key="hora" :data-s="STEP[st][1]">
              <div class="tl-h"><time>{{ hora }}</time><span class="pill"><i aria-hidden="true" />{{ STEP[st][0] }}</span></div>
              <p>{{ texto }}</p>
            </li>
          </ol>
        </li>
      </ul>
    </section>
    <section class="sec sub" aria-labelledby="sub-t">
      <h2 id="sub-t">Suscríbete a las actualizaciones</h2>
      <p v-if="sent" class="done" role="status">Listo. Te enviamos un enlace a {{ sent }} para confirmar la suscripción.</p>
      <form v-else novalidate @submit.prevent="submit">
        <label for="em">Correo electrónico</label>
        <div class="row">
          <input
            id="em"
            ref="input"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="tu@empresa.com"
            required
            :aria-invalid="error ? 'true' : 'false'"
            aria-describedby="em-hint em-err"
            @input="error = ''"
          />
          <button type="submit">Suscribirme</button>
        </div>
        <p v-if="error" id="em-err" class="err" role="alert">{{ error }}</p>
        <p id="em-hint" class="hint">Te avisamos al abrir, actualizar y cerrar una incidencia. Sin spam.</p>
      </form>
    </section>
    <div v-if="tip" class="tip" role="tooltip" :style="{ left: `${tip.x}px`, top: `${tip.y}px`, transform: 'translate(-50%, calc(-100% - 8px))' }">
      {{ tip.text }}
    </div>
  </main>
</template>

<style scoped>
[data-s=ok] { --c:var(--ok); --t:var(--ok-soft); }
[data-s=info] { --c:var(--info); --t:var(--info-soft); }
[data-s=warn] { --c:var(--warn); --t:var(--warn-soft); }
[data-s=err] { --c:var(--err); --t:var(--err-soft); }
.page { max-width:760px; margin:0 auto; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.top { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:6px 16px; margin-bottom:16px; }
h1, h2, h3, p { margin:0; }
h1 { font-size:26px; line-height:1.2; letter-spacing:-.01em; }
h2 { font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
h3 { font-size:15px; font-weight:600; }
.meta, .hint { color:var(--muted); font-size:13px; }
.hint { margin-bottom:6px; }
.banner { display:flex; align-items:center; gap:14px; padding:16px 18px; background:var(--t); border:1px solid var(--border); border-left:4px solid var(--c); border-radius:var(--radius); box-shadow:var(--shadow); }
.ico { flex:none; display:grid; place-items:center; width:32px; height:32px; border-radius:50%; background:var(--c); color:var(--accent-ink); font-weight:700; }
.ico::before { content:"✓"; }
.banner[data-s=warn] .ico::before { content:"!"; }
.banner[data-s=err] .ico::before { content:"✕"; }
.banner:not([data-s=ok]) .ico { animation:ring 2s ease-out infinite; }
@keyframes ring { from { box-shadow:0 0 0 0 var(--c); } to { box-shadow:0 0 0 8px transparent; } }
.bt { font-size:17px; font-weight:600; }
.bs { margin-top:2px; color:var(--muted); }
.sec { margin-top:28px; }
.sec-h { display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; gap:8px 16px; margin-bottom:6px; }
.legend { display:flex; flex-wrap:wrap; gap:6px 14px; margin:0; padding:0; list-style:none; font-size:12px; color:var(--muted); }
.legend li, .pill { display:inline-flex; align-items:center; gap:6px; }
.legend i, .pill i { flex:none; width:8px; height:8px; border-radius:50%; background:var(--c); }
.svcs, .incs { margin:0; padding:0; list-style:none; }
.svc, .inc { padding:16px 0; border-top:1px solid var(--border); }
.svc-h { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:6px 12px; }
.stat { display:flex; align-items:center; gap:12px; }
.pct { font-weight:600; font-variant-numeric:tabular-nums; }
.pill { padding:2px 10px; background:var(--t); border-radius:999px; font-size:12px; font-weight:600; white-space:nowrap; }
.bar { display:grid; grid-auto-flow:column; grid-auto-columns:minmax(4px,1fr); gap:2px; height:32px; margin-top:10px; padding:2px; box-sizing:border-box; overflow-x:auto; scrollbar-width:thin; }
.cell { min-width:0; padding:0; border:0; border-radius:2px; background:var(--c); cursor:default; }
.cell:focus-visible { outline-offset:1px; }
.foot { display:flex; justify-content:space-between; margin-top:6px; color:var(--muted); font-size:12px; }
.tip { position:fixed; z-index:10; max-width:260px; padding:6px 10px; border-radius:6px; background:var(--text); color:var(--bg); font-size:12px; pointer-events:none; box-shadow:var(--shadow); }
.inc-meta { margin-top:2px; color:var(--muted); font-size:13px; }
.tl { margin:12px 0 0; padding:0 0 0 18px; list-style:none; border-left:2px solid var(--border); }
.tl li { position:relative; padding-bottom:12px; }
.tl li:last-child { padding-bottom:0; }
.tl li::before { content:""; position:absolute; left:-24px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--c); box-shadow:0 0 0 3px var(--bg); }
.tl-h { display:flex; align-items:center; gap:8px; }
.tl time { font-size:13px; font-weight:600; font-variant-numeric:tabular-nums; }
.tl p { margin-top:2px; color:var(--muted); }
.sub { padding:20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.sub label { display:block; margin-bottom:6px; font-weight:500; }
.row { display:flex; flex-wrap:wrap; gap:8px; }
.row input { flex:1 1 220px; min-width:0; padding:9px 12px; font:inherit; color:var(--text); background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); }
.row input[aria-invalid=true] { border-color:var(--err); }
.row button { padding:9px 16px; font:inherit; font-weight:600; color:var(--accent-ink); background:var(--accent); border:1px solid var(--accent); border-radius:var(--radius); cursor:pointer; }
.err { margin-top:6px; color:var(--err); font-size:13px; }
.done { padding:12px 14px; background:var(--ok-soft); border:1px solid var(--ok); border-radius:var(--radius); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { * { animation:none !important; transition:none !important; } }
</style>
