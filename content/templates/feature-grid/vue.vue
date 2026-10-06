<script setup lang="ts">
type Feature = { icon: string; title: string; text: string }; // icon = atributo "d" de un path 24x24

withDefaults(defineProps<{ title?: string; intro?: string; features?: Feature[] }>(), {
  title: 'Lo necesario para llegar a tiempo',
  intro: 'Seis herramientas que trabajan juntas, sin integraciones que configurar.',
  features: () => [
    { icon: 'M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 4v16M15 4v10', title: 'Tableros flexibles', text: 'Organiza tareas en columnas, listas o calendario.' },
    { icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2', title: 'Plazos y recordatorios', text: 'Avisamos antes de que venza cada entrega.' },
    { icon: 'M4 5h16v11H9l-5 4z', title: 'Comentarios en contexto', text: 'Conversa dentro de cada tarea.' },
    { icon: 'M13 2L4 14h7l-1 8 9-12h-7z', title: 'Automatizaciones', text: 'Asigna, mueve y notifica de forma automática.' },
    { icon: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3', title: 'Informes en vivo', text: 'Mide el avance sin exportar hojas de cálculo.' },
    { icon: 'M7 11h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2zM8 11V8a4 4 0 018 0v3', title: 'Permisos por equipo', text: 'Decide quién ve, edita o aprueba.' },
  ],
});
</script>

<template>
  <section class="features" aria-labelledby="features-title">
    <div class="head">
      <h2 id="features-title">{{ title }}</h2>
      <p>{{ intro }}</p>
    </div>
    <ul class="grid">
      <li v-for="f in features" :key="f.title" class="card">
        <div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path :d="f.icon" /></svg></div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.features { max-width: 1040px; margin: 0 auto; padding: 24px 0; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.head { max-width: 36rem; margin: 0 0 36px; }
.head::before { content: ""; display: block; width: 40px; height: 3px; margin-bottom: 16px; border-radius: 3px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.head h2 { margin: 0 0 10px; font-size: clamp(1.6rem, 4.5vw, 2.4rem); font-weight: 700; line-height: 1.1; letter-spacing: -.025em; text-wrap: balance; }
.head p { margin: 0; color: var(--muted); font-size: 1.05rem; }
.grid { display: grid; grid-template-columns: 1fr; gap: 1px; margin: 0; padding: 0; list-style: none; border: 1px solid var(--border); border-radius: var(--radius); background: var(--border); box-shadow: var(--shadow); overflow: hidden; }
@media (min-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 860px) { .grid { grid-template-columns: repeat(3, 1fr); } }
.card { padding: 28px 24px; background: var(--surface); }
.ico { display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 16px; border-radius: var(--radius); background: var(--accent-soft); }
.ico svg { width: 22px; height: 22px; fill: none; stroke: var(--accent); stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.card h3 { margin: 0 0 6px; font-size: 1.05rem; font-weight: 600; letter-spacing: -.01em; }
.card p { margin: 0; color: var(--muted); }
/* Tokens: ver pestaña HTML + CSS */
</style>
