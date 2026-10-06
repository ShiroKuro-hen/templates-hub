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
.features { max-width: 1040px; margin: 0 auto; padding: 36px 20px; color: #17130f; font: 15px/1.5 system-ui, sans-serif; }
.head { max-width: 34rem; margin: 0 0 28px; }
.head h2 { margin: 0 0 8px; font-size: clamp(1.6rem, 4.5vw, 2.4rem); line-height: 1.1; letter-spacing: -.03em; }
.head p { margin: 0; color: #6b6258; }
.grid { display: grid; gap: 16px; margin: 0; padding: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); }
@media (min-width: 860px) { .grid { grid-template-columns: repeat(3, 1fr); } }
.card { padding: 20px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
.ico { display: grid; place-items: center; width: 44px; height: 44px; margin-bottom: 14px; border: 2px solid #17130f; border-radius: 10px; background: #ffd84d; }
.card:nth-child(3n + 2) .ico { background: #ff5a36; }
.card:nth-child(3n) .ico { background: #c9d3ff; }
.ico svg { width: 24px; height: 24px; fill: none; stroke: #17130f; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.card h3 { margin: 0 0 6px; font-size: 1.1rem; letter-spacing: -.02em; }
.card p { margin: 0; color: #6b6258; font-size: .95rem; }
</style>
