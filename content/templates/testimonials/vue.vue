<script setup lang="ts">
type Testimonial = { quote: string; name: string; role: string; featured?: boolean };

withDefaults(defineProps<{ items?: Testimonial[]; title?: string }>(), {
  title: 'Equipos que ya trabajan con Nimbo',
  items: () => [
    { quote: 'Pasamos de cinco herramientas a una. Las revisiones semanales duran la mitad.', name: 'Lucía Méndez', role: 'Directora de operaciones, Finca Norte' },
    { quote: 'Las automatizaciones nos ahorran unas ocho horas por semana.', name: 'Javier Ruiz', role: 'Líder de producto, Orbita Labs', featured: true },
    { quote: 'Enseñamos el avance real a los clientes, sin preparar presentaciones.', name: 'Sofía Paredes', role: 'Fundadora, Estudio Tramo' },
  ],
});
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
</script>

<template>
  <section class="quotes" aria-labelledby="quotes-title">
    <h2 id="quotes-title">{{ title }}</h2>
    <ul class="list">
      <li v-for="t in items" :key="t.name">
        <figure :class="{ featured: t.featured }">
          <svg class="mark" viewBox="0 0 30 24" aria-hidden="true"><path d="M2 22V11C2 5 6 2 11 2v5C8 7 7 9 7 11h4v11zM17 22V11c0-6 4-9 9-9v5c-3 0-4 2-4 4h4v11z" /></svg>
          <blockquote><p>{{ t.quote }}</p></blockquote>
          <figcaption>
            <span class="av" aria-hidden="true">{{ initials(t.name) }}</span>
            <span><span class="who">{{ t.name }}</span><span class="role">{{ t.role }}</span></span>
          </figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.quotes { max-width: 1040px; margin: 0 auto; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
h2 { max-width: 30rem; margin: 0 0 20px; font-size: clamp(1.4rem, 3.5vw, 1.875rem); line-height: 1.2; letter-spacing: -.02em; }
.list { display: grid; gap: 16px; margin: 0; padding: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
figure { position: relative; overflow: hidden; display: flex; flex-direction: column; height: 100%; margin: 0; padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
figure.featured { border-color: var(--accent); }
figure.featured::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.mark { width: 24px; height: 20px; margin-bottom: 12px; fill: var(--accent); opacity: .8; }
blockquote { flex: 1; margin: 0 0 16px; font-size: .9375rem; line-height: 1.6; }
blockquote p { margin: 0; }
figcaption { display: flex; gap: 12px; align-items: center; padding-top: 16px; border-top: 1px solid var(--border); }
.av { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-weight: 600; font-size: .8125rem; }
.who { display: block; font-weight: 600; }
.role { display: block; color: var(--muted); font-size: .8125rem; }
/* Tokens: ver pestaña HTML + CSS */
</style>
