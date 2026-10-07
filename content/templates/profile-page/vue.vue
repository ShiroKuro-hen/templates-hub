<script setup lang="ts">
import { ref } from 'vue';

type Item = { kind: 'ok' | 'info' | 'warn'; icon: string; antes: string; b: string; despues?: string; cita?: string; hora: string };
const grupos: { titulo: string; items: Item[] }[] = [
  { titulo: 'Hoy', items: [
    { kind: 'ok', icon: 'm5 12 5 5 9-10', antes: 'Publicó la automatización', b: 'Aprobaciones de gastos', despues: ' en Finanzas.', hora: '10:42' },
    { kind: 'info', icon: 'M4 5h16v11H9l-5 4z', antes: 'Comentó en', b: 'Rediseño del panel de métricas', despues: '.', cita: 'Propongo unificar los filtros en una sola barra.', hora: '09:15' },
  ] },
  { titulo: 'Ayer', items: [
    { kind: 'ok', icon: 'm5 12 5 5 9-10', antes: 'Completó 5 tareas en', b: 'Lanzamiento del cuarto trimestre', despues: '.', hora: '17:30' },
    { kind: 'warn', icon: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z', antes: 'Obtuvo la insignia', b: 'Mentora', despues: '.', hora: '11:08' },
  ] },
];
const proyectos: [string, string, number][] = [['Rediseño del panel de métricas', 'En curso', 72], ['Sistema de diseño Ion', 'En curso', 45], ['Onboarding móvil', 'Completado', 100]];
const insignias = ['Mentora', 'Colaboradora del año 2025', '100 flujos publicados', 'Primera semana sin errores'];
const tabs = ['Actividad', 'Proyectos', 'Insignias'];
const sigue = ref(false), tab = ref(0);
const btns = ref<HTMLButtonElement[]>([]);
function onKey(e: KeyboardEvent, i: number) {
  const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
  if (!k) return;
  tab.value = (i + k + tabs.length) % tabs.length;
  btns.value[tab.value]?.focus();
}
</script>

<template>
  <div class="page">
    <header class="box head">
      <div class="cover" aria-hidden="true" />
      <div class="info">
        <div class="ring"><div class="av" aria-hidden="true">MV</div></div>
        <div class="who">
          <h1>Mariana Vélez <span class="badge">Administradora</span></h1>
          <p>Diseñadora de producto en Nimbo. Lima, Perú.</p>
        </div>
        <div class="acts">
          <button class="btn" type="button" :aria-pressed="sigue" @click="sigue = !sigue">{{ sigue ? 'Siguiendo' : 'Seguir' }}</button>
          <button class="btn" type="button">Enviar mensaje</button>
        </div>
      </div>
      <dl class="stats">
        <div><dt>proyectos</dt><dd>48</dd></div>
        <div><dt>seguidores</dt><dd>{{ sigue ? '1.249' : '1.248' }}</dd></div>
        <div><dt>siguiendo</dt><dd>312</dd></div>
      </dl>
    </header>
    <div class="cols">
      <main class="box">
        <div role="tablist" aria-label="Secciones del perfil">
          <button v-for="(t, i) in tabs" :key="t" :ref="(el) => (btns[i] = el as HTMLButtonElement)" role="tab" :id="`t${i}`" :aria-controls="`p${i}`"
            :aria-selected="tab === i" :tabindex="tab === i ? 0 : -1" @click="tab = i" @keydown="onKey($event, i)">{{ t }}</button>
        </div>
        <div v-show="tab === 0" role="tabpanel" id="p0" aria-labelledby="t0" tabindex="0">
          <template v-for="g in grupos" :key="g.titulo">
            <h2>{{ g.titulo }}</h2>
            <ul class="feed">
              <li v-for="i in g.items" :key="i.hora">
                <span :class="['dot', i.kind === 'info' ? '' : i.kind]"><svg viewBox="0 0 24 24"><path :d="i.icon" /></svg></span>
                <p>{{ i.antes }} <b>{{ i.b }}</b>{{ i.despues }}<q v-if="i.cita">{{ i.cita }}</q><br /><small>{{ i.hora }}</small></p>
              </li>
            </ul>
          </template>
        </div>
        <div v-show="tab === 1" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">
          <div v-for="[n, estado, v] in proyectos" :key="n" class="prj"><b>{{ n }}</b><span class="badge">{{ estado }}</span><progress max="100" :value="v" :aria-label="`${v} % completado`" /></div>
        </div>
        <div v-show="tab === 2" role="tabpanel" id="p2" aria-labelledby="t2" tabindex="0"><ul class="tags"><li v-for="b in insignias" :key="b">{{ b }}</li></ul></div>
      </main>
      <aside>
        <section class="box"><h2>Acerca de</h2><p>Diseño interfaces claras para equipos de operaciones. Me interesa la accesibilidad y la documentación.</p></section>
        <section class="box"><h2>Habilidades</h2><ul class="tags"><li>Diseño de sistemas</li><li>Investigación</li><li>Prototipado</li><li>Accesibilidad</li></ul></section>
        <section class="box"><h2>Equipos</h2><ul class="tags"><li>Diseño de producto</li><li>Plataforma</li></ul></section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page{max-width:1000px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
:is(a,button,[role=tab]):focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.head{overflow:hidden}
.cover{height:112px;background:repeating-linear-gradient(135deg,transparent 0 14px,var(--border) 14px 15px),linear-gradient(135deg,var(--accent-soft),var(--info-soft))}
.info{display:flex;flex-wrap:wrap;align-items:flex-end;gap:16px 20px;padding:0 24px 16px}
.ring{margin-top:-44px;padding:1px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.av{display:grid;place-items:center;width:88px;height:88px;border-radius:50%;background:var(--accent-soft);box-shadow:inset 0 0 0 3px var(--surface);color:var(--accent);font-size:28px;font-weight:700}
.who{flex:1;min-width:200px}
h1{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0;font-size:22px;letter-spacing:-.01em}
.badge{padding:1px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
.who p{margin:2px 0 0;color:var(--muted)}
.acts{display:flex;gap:8px}
.btn{padding:8px 16px;font:inherit;font-weight:600;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:filter .14s,border-color .14s}
.btn:hover{border-color:var(--accent);filter:brightness(.97)}
.btn[aria-pressed=false]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.stats{display:flex;gap:32px;margin:0;padding:12px 24px;border-top:1px solid var(--border);font-variant-numeric:tabular-nums}
.stats div{display:flex;gap:6px;align-items:baseline}
.stats dt{order:2;color:var(--muted)}.stats dd{margin:0;font-size:16px;font-weight:700}
.cols{display:grid;grid-template-columns:1fr 280px;gap:16px;margin-top:16px;align-items:start}
[role=tablist]{display:flex;gap:4px;padding:0 12px;overflow-x:auto;border-bottom:1px solid var(--border)}
[role=tab]{padding:12px;font:inherit;color:var(--muted);background:none;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;white-space:nowrap}
[role=tab][aria-selected=true]{color:var(--text);font-weight:600;border-bottom-color:var(--accent)}
[role=tabpanel]{padding:20px}
h2{margin:0 0 12px;font-size:12px;font-weight:600;color:var(--muted)}
.feed{display:grid;gap:16px;margin:0 0 20px;padding:0;list-style:none}
.feed li{display:flex;gap:12px}
.dot{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--accent-soft);color:var(--accent)}
.dot.ok{background:var(--ok-soft);color:var(--ok)}.dot.warn{background:var(--warn-soft);color:var(--warn)}
.dot svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.feed p{margin:0}.feed small{color:var(--muted)}
q{display:block;margin-top:6px;padding-left:12px;border-left:1px solid var(--border);color:var(--muted);quotes:none}
.prj{display:grid;grid-template-columns:1fr auto;gap:4px 12px;padding:12px 0;border-bottom:1px solid var(--border)}
.prj:last-child{border:0}
progress{grid-column:1/-1;width:100%;height:6px;appearance:none;border:0;border-radius:999px;overflow:hidden;background:var(--border)}
progress::-webkit-progress-bar{background:var(--border)}
progress::-webkit-progress-value{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
progress::-moz-progress-bar{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
aside .box{padding:16px;margin-bottom:16px}
aside p{margin:0;color:var(--muted)}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.tags li{padding:1px 10px;border:1px solid var(--border);border-radius:999px;font-size:13px}
@media (max-width:760px){.cols{grid-template-columns:1fr}.stats{gap:20px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
