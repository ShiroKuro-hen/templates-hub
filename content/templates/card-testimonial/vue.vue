<script setup lang="ts">
type Testimonio = {
  id: string; cita: string; puntos: number; cifra: string; resultado: string;
  nombre: string; cargo: string; empresa: string;
};

withDefaults(defineProps<{ items?: Testimonio[] }>(), {
  items: () => [
    { id: 't1', puntos: 5, cifra: '38%', resultado: 'menos tickets de soporte en tres meses',
      cita: 'Pasamos de gestionar incidencias por correo a verlas todas en un solo panel. El equipo responde en minutos y dejamos de perder pedidos.',
      nombre: 'Ana Pérez', cargo: 'Directora de Operaciones', empresa: 'Meridian Logística' },
    { id: 't2', puntos: 4, cifra: '99,98%', resultado: 'de disponibilidad desde el cambio',
      cita: 'La migración tomó un fin de semana y el lunes nadie notó el cambio. El soporte fue claro y directo en cada duda.',
      nombre: 'Jorge Salazar', cargo: 'Jefe de Tecnología', empresa: 'Andina Retail' },
  ],
});
const iniciales = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
</script>

<template>
  <div class="grid">
    <figure v-for="t in items" :key="t.id" class="card">
      <svg class="q" viewBox="0 0 32 24" aria-hidden="true">
        <path d="M0 24V13.5C0 6 4.2 1.2 11 0l1.2 3.6C8.4 4.8 6.6 7.2 6.4 10H12v14zM18 24V13.5C18 6 22.2 1.2 29 0l1.2 3.6C26.4 4.8 24.6 7.2 24.4 10H30v14z" />
      </svg>
      <div class="rate" role="img" :aria-label="`${t.puntos} de 5 estrellas`">
        <svg v-for="i in 5" :key="i" class="st" :class="{ on: i <= t.puntos }" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      </div>
      <blockquote><p>“{{ t.cita }}”</p></blockquote>
      <p class="kpi"><b>{{ t.cifra }}</b> {{ t.resultado }}</p>
      <figcaption>
        <span class="av" aria-hidden="true">{{ iniciales(t.nombre) }}</span>
        <span class="who"><b>{{ t.nombre }}</b><span>{{ t.cargo }}</span><span>{{ t.empresa }}</span></span>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;max-width:820px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{position:relative;display:flex;flex-direction:column;gap:14px;margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.q{position:absolute;top:18px;right:20px;width:28px;height:21px;fill:var(--accent-soft)}
.rate{display:flex;gap:2px}
.st{width:16px;height:16px;fill:var(--border)}
.st.on{fill:var(--warn)}
blockquote{margin:0}
blockquote p{margin:0;font-size:16px;line-height:1.55}
.kpi{margin:0;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--muted)}
.kpi b{color:var(--text);font-size:16px;font-variant-numeric:tabular-nums}
figcaption{display:flex;align-items:center;gap:12px;margin-top:auto}
.av{display:grid;place-items:center;flex:none;width:40px;height:40px;box-sizing:border-box;font-weight:600;border:1px solid transparent;border-radius:50%;
    background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.who b{display:block}
.who span{display:block;color:var(--muted);font-size:13px}
/* Tokens: ver pestaña HTML + CSS */
</style>
