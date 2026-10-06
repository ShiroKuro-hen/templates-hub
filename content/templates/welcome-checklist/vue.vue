<script setup lang="ts">
import { ref } from 'vue';

type Task = { id: string; title: string; detail: string; minutes: number; action?: { label: string; href: string } };

const tasks: Task[] = [
  { id: 'cuenta', title: 'Crea tu cuenta', detail: 'Tu cuenta está verificada con ana.lopez@lumen.es.', minutes: 1 },
  { id: 'equipo', title: 'Invita a tu equipo', detail: 'Tres personas ya tienen acceso. Puedes invitar a más desde Miembros.', minutes: 2 },
  { id: 'fuente', title: 'Conecta una fuente de datos', detail: 'Importa un CSV o conecta tu base de datos PostgreSQL para ver métricas reales.', minutes: 5, action: { label: 'Conectar fuente', href: '#fuentes' } },
  { id: 'panel', title: 'Crea tu primer panel', detail: 'Parte de la plantilla de ventas o empieza con un panel en blanco.', minutes: 4, action: { label: 'Crear panel', href: '#paneles' } },
  { id: 'alertas', title: 'Configura las alertas', detail: 'Recibe un aviso cuando una métrica cambie más de un 10 % en un día.', minutes: 3, action: { label: 'Configurar alertas', href: '#alertas' } },
];
const done = ref<string[]>(['cuenta', 'equipo']);
const firstPending = tasks.find((t) => !done.value.includes(t.id))?.id;
</script>

<template>
  <section class="card" aria-labelledby="ttl">
    <header class="head">
      <div>
        <h2 id="ttl">Configura tu espacio en Nimbus</h2>
        <p class="sub" aria-live="polite"><b>{{ done.length }}</b> de {{ tasks.length }} pasos completados</p>
      </div>
      <span class="pct" aria-hidden="true">{{ Math.round((done.length / tasks.length) * 100) }}%</span>
    </header>
    <progress :max="tasks.length" :value="done.length" aria-label="Progreso de configuración" />
    <ol class="tasks">
      <li v-for="t in tasks" :key="t.id">
        <input v-model="done" type="checkbox" :value="t.id" :aria-label="`Hecho: ${t.title}`" />
        <details :open="t.id === firstPending">
          <summary><span>{{ t.title }}</span><small>{{ t.minutes }} min</small></summary>
          <p>{{ t.detail }}</p>
          <a v-if="t.action" :href="t.action.href">{{ t.action.label }}</a>
        </details>
      </li>
    </ol>
    <p v-if="done.length === tasks.length" class="all-done">Todo listo. Comparte tu primer panel con el equipo.</p>
  </section>
</template>

<style scoped>
.card{max-width:560px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:20px 20px 12px}
h2{margin:0;font-size:17px;font-weight:600}
.sub{margin:2px 0 0;color:var(--muted)}
.sub b{color:var(--text);font-variant-numeric:tabular-nums}
.pct{font-size:22px;font-weight:600;font-variant-numeric:tabular-nums}
progress{display:block;width:calc(100% - 40px);height:6px;margin:0 20px 16px;border:0;border-radius:999px;background:var(--accent-soft);-webkit-appearance:none;appearance:none;overflow:hidden}
progress::-webkit-progress-bar{background:var(--accent-soft)}
progress::-webkit-progress-value{background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
progress::-moz-progress-bar{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.tasks{list-style:none;margin:0;padding:0;border-top:1px solid var(--border)}
.tasks li{display:flex;gap:12px;align-items:flex-start;padding:12px 20px;border-bottom:1px solid var(--border)}
.tasks li:last-child{border-bottom:0}
input[type=checkbox]{flex:none;width:18px;height:18px;margin:2px 0 0;accent-color:var(--accent);cursor:pointer}
details{flex:1;min-width:0}
summary{display:flex;gap:8px;cursor:pointer;font-weight:500;list-style:none;border-radius:4px}
summary::-webkit-details-marker{display:none}
summary small{margin-left:auto;color:var(--muted);font-size:13px;font-weight:400;font-variant-numeric:tabular-nums}
summary::after{content:"";flex:none;width:6px;height:6px;margin:6px 2px 0 4px;border:solid var(--muted);border-width:0 1px 1px 0;transform:rotate(45deg);transition:transform .14s}
details[open] summary::after{transform:rotate(-135deg);margin-top:9px}
li:has(:checked) summary span{color:var(--muted);text-decoration:line-through}
details p{margin:6px 0 0;color:var(--muted)}
details a{display:inline-block;margin-top:8px;color:var(--accent);font-weight:500;text-decoration:none;border-radius:4px}
details a:hover{text-decoration:underline}
.all-done{margin:0;padding:12px 20px;background:var(--ok-soft);border-top:1px solid var(--border)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
