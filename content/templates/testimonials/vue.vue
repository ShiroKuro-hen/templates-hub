<script setup lang="ts">
type Testimonial = { quote: string; name: string; role: string; color?: string };

withDefaults(defineProps<{ items?: Testimonial[]; title?: string }>(), {
  title: 'Equipos que ya trabajan con Nimbo',
  items: () => [
    { quote: 'Pasamos de cinco herramientas a una. Las revisiones semanales duran la mitad.', name: 'Lucía Méndez', role: 'Directora de operaciones, Finca Norte', color: '#c9d3ff' },
    { quote: 'Las automatizaciones nos ahorran unas ocho horas por semana.', name: 'Javier Ruiz', role: 'Líder de producto, Orbita Labs', color: '#fffdf8' },
    { quote: 'Enseñamos el avance real a los clientes, sin preparar presentaciones.', name: 'Sofía Paredes', role: 'Fundadora, Estudio Tramo', color: '#ff5a36' },
  ],
});
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
</script>

<template>
  <section class="quotes" aria-labelledby="quotes-title">
    <h2 id="quotes-title">{{ title }}</h2>
    <ul class="list">
      <li v-for="t in items" :key="t.name">
        <figure>
          <svg class="mark" viewBox="0 0 30 24" aria-hidden="true"><path d="M2 22V11C2 5 6 2 11 2v5C8 7 7 9 7 11h4v11zM17 22V11c0-6 4-9 9-9v5c-3 0-4 2-4 4h4v11z" /></svg>
          <blockquote><p>{{ t.quote }}</p></blockquote>
          <figcaption>
            <span class="av" :style="{ '--c': t.color ?? '#fffdf8' }" aria-hidden="true">{{ initials(t.name) }}</span>
            <span><span class="who">{{ t.name }}</span><span class="role">{{ t.role }}</span></span>
          </figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.quotes { max-width: 1040px; margin: 0 auto; padding: 36px 20px; color: #17130f; font: 15px/1.5 system-ui, sans-serif; }
h2 { max-width: 30rem; margin: 0 0 28px; font-size: clamp(1.6rem, 4.5vw, 2.4rem); line-height: 1.1; letter-spacing: -.03em; }
.list { display: grid; gap: 18px; margin: 0; padding: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr)); }
figure { display: flex; flex-direction: column; height: 100%; margin: 0; padding: 22px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
.mark { width: 30px; height: 24px; margin-bottom: 12px; fill: #ff5a36; stroke: #17130f; stroke-width: 2; }
blockquote { flex: 1; margin: 0 0 18px; font-size: 1.02rem; line-height: 1.55; }
figcaption { display: flex; gap: 12px; align-items: center; padding-top: 16px; border-top: 2px solid #17130f; }
.av { flex: none; display: grid; place-items: center; width: 42px; height: 42px; border: 2px solid #17130f; border-radius: 50%; background: var(--c); font: 700 .85rem ui-monospace, monospace; }
.who { display: block; font-weight: 700; }
.role { display: block; color: #6b6258; font-size: .85rem; }
</style>
