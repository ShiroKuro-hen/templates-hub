<script setup lang="ts">
type Milestone = { date: string; label: string; title: string; text: string; status: 'done' | 'now' | 'next' };

withDefaults(defineProps<{ items?: Milestone[] }>(), {
  items: () => [
    { date: '2026-01-12', label: '12 ene 2026', title: 'Prototipo validado', text: 'Probamos el flujo de reserva con 40 clientes de la tienda.', status: 'done' },
    { date: '2026-03-03', label: '3 mar 2026', title: 'Beta privada', text: 'Abrimos el acceso a 200 negocios con lista de espera.', status: 'done' },
    { date: '2026-06-20', label: '20 jun 2026', title: 'Lanzamiento público', text: 'Pagos con tarjeta, facturas automáticas y soporte por chat.', status: 'now' },
    { date: '2026-10-01', label: '1 oct 2026', title: 'App móvil', text: 'Versión para Android e iOS con notificaciones.', status: 'next' },
  ],
});
</script>

<template>
  <ol class="tl">
    <li v-for="m in items" :key="m.date" :class="m.status" :aria-current="m.status === 'now' ? 'step' : undefined">
      <time :datetime="m.date">{{ m.label }}</time>
      <h2>{{ m.title }} <span v-if="m.status === 'now'" class="state">En curso</span></h2>
      <p>{{ m.text }}</p>
    </li>
  </ol>
</template>

<style scoped>
.tl { position: relative; margin: 0; padding: 0; list-style: none; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.tl::before { content: ""; position: absolute; left: 11px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(135deg, #22d3ee, #2f5bff); border-radius: 2px; }
li { position: relative; padding: 0 0 20px 36px; }
li:last-child { padding-bottom: 0; }
li::before { content: ""; position: absolute; left: 4px; top: 2px; width: 16px; height: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 50%; }
.done::before { background: var(--ok); border-color: var(--ok); }
.now::before { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.next::before { border: 1px dashed var(--muted); }
time { display: block; margin-bottom: 2px; font-size: 12px; font-weight: 500; color: var(--muted); font-variant-numeric: tabular-nums; }
h2 { margin: 0; font-size: 1rem; font-weight: 600; }
p { margin: 2px 0 0; color: var(--muted); max-width: 52ch; }
.state { margin-left: 6px; padding: 1px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 600; vertical-align: 2px; }
/* Tokens: ver pestaña HTML + CSS */
</style>
