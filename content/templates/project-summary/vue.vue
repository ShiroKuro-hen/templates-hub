<script setup lang="ts">
type State = 'done' | 'now' | 'next';

const progress = 68;
const stats = [['Tareas', '34 de 50'], ['Presupuesto', '62 %'], ['Días restantes', '39']];
const milestones: { title: string; date: string; state: State }[] = [
  { title: 'Descubrimiento e investigación', date: '12 sep', state: 'done' },
  { title: 'Diseño de interfaz', date: '26 sep', state: 'done' },
  { title: 'Desarrollo del front-end', date: '20 oct', state: 'now' },
  { title: 'Pruebas de accesibilidad', date: '3 nov', state: 'next' },
  { title: 'Lanzamiento', date: '14 nov', state: 'next' },
];
const team = [
  { name: 'Ana Pérez', role: 'Dirección del proyecto' },
  { name: 'Marta Ruiz', role: 'Diseño de producto' },
  { name: 'Carlos Díaz', role: 'Desarrollo front-end' },
];

const LABEL: Record<State, string> = { done: 'Completado el', now: 'Vence el', next: 'Previsto el' };
const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');
</script>

<template>
  <section class="proj" aria-labelledby="ps-t">
    <div class="head">
      <div><h2 id="ps-t">Rediseño del portal de clientes</h2><p>Entrega prevista el 14 de noviembre.</p></div>
      <span class="badge">En curso</span>
    </div>
    <div class="pg">
      <div><label for="ps-p">Avance general</label><span>{{ progress }} %</span></div>
      <progress id="ps-p" :value="progress" max="100">{{ progress }} %</progress>
    </div>
    <dl class="stats">
      <div v-for="[k, v] in stats" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></div>
    </dl>
    <div class="cols">
      <div>
        <h3>Hitos</h3>
        <ol class="ms">
          <li v-for="m in milestones" :key="m.title" :class="m.state" :aria-current="m.state === 'now' ? 'step' : undefined">
            <span class="m" aria-hidden="true">
              <svg v-if="m.state === 'done'" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            </span>
            <div><b>{{ m.title }}</b><small>{{ LABEL[m.state] }} {{ m.date }}</small></div>
          </li>
        </ol>
      </div>
      <div>
        <h3>Responsables</h3>
        <ul class="team">
          <li v-for="t in team" :key="t.name">
            <span class="av" aria-hidden="true">{{ initials(t.name) }}</span>
            <div><b>{{ t.name }}</b><small>{{ t.role }}</small></div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.proj{max-width:720px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:flex-start;justify-content:space-between}
h2{margin:0;font-size:18px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.badge{display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:999px;background:var(--info-soft);font-size:12px;font-weight:600}
.badge::before{content:"";width:8px;height:8px;border-radius:999px;background:var(--info)}
.pg{margin-top:20px}
.pg div{display:flex;justify-content:space-between;margin-bottom:6px}
.pg label{font-weight:600}
.pg span{font-variant-numeric:tabular-nums}
progress{display:block;width:100%;height:8px;border:0;border-radius:999px;appearance:none;-webkit-appearance:none;background:var(--border);overflow:hidden}
progress::-webkit-progress-bar{background:var(--border);border-radius:999px}
progress::-webkit-progress-value{background:linear-gradient(90deg,#22d3ee,#2f5bff);border-radius:999px}
progress::-moz-progress-bar{background:var(--accent);border-radius:999px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1px;margin:20px 0;background:var(--border);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.stats div{padding:10px 16px;background:var(--surface)}
dt{color:var(--muted)}
dd{margin:0;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
h3{margin:0 0 12px;font-size:14px;font-weight:600}
ol,ul{margin:0;padding:0;list-style:none}
.ms li{position:relative;display:flex;gap:12px;padding-bottom:16px}
.ms li:last-child{padding-bottom:0}
.ms li:not(:last-child)::before{content:"";position:absolute;left:8px;top:20px;bottom:4px;width:1px;background:var(--border)}
.m{flex:none;display:grid;place-items:center;width:17px;height:17px;border:1px solid var(--border);border-radius:999px;background:var(--surface)}
.m svg{width:10px;height:10px;fill:none;stroke:var(--accent-ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.done .m{border-color:var(--ok);background:var(--ok)}
.now .m{border-color:var(--accent);background:var(--accent-soft)}
.now .m::after{content:"";width:7px;height:7px;border-radius:999px;background:var(--accent)}
.ms b{display:block;font-weight:500;line-height:1.3}
.next b{color:var(--muted)}
.ms small{color:var(--muted);font-size:13px}
.team li{display:flex;align-items:center;gap:12px;padding:6px 0}
.av{flex:none;display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--border);border-radius:999px;background:var(--bg);font-size:12px;font-weight:600}
.team b{display:block;font-weight:600;line-height:1.3}
.team small{color:var(--muted);font-size:13px}
/* Tokens: ver pestaña HTML + CSS */
</style>
