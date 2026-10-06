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
      <h2>{{ m.title }} <span v-if="m.status === 'now'" class="state">· en curso</span></h2>
      <p>{{ m.text }}</p>
    </li>
  </ol>
</template>

<style scoped>
.tl { position: relative; margin: 0; padding: 0; list-style: none; font: 14px/1.5 system-ui, sans-serif; color: #17130f; }
.tl::before { content: ""; position: absolute; left: 11px; top: 6px; bottom: 6px; width: 4px; background: #17130f; border-radius: 2px; }
li { position: relative; padding: 0 0 18px 40px; }
li:last-child { padding-bottom: 0; }
li::before { content: ""; position: absolute; left: 2px; top: 2px; width: 22px; height: 22px; background: #fffdf8; border: 2px solid #17130f; border-radius: 50%; }
.done::before { background: #1f9d55; }
.now::before { background: #ff5a36; box-shadow: 3px 3px 0 #17130f; }
.next::before { border-style: dashed; }
time { display: inline-block; margin-bottom: 4px; padding: 1px 8px; font: 700 12px ui-monospace, monospace; background: #ffd84d; border: 2px solid #17130f; border-radius: 6px; }
.next time { background: #fffdf8; color: #6b6258; }
h2 { margin: 0; font-size: 16px; letter-spacing: -.01em; }
p { margin: 2px 0 0; color: #6b6258; max-width: 52ch; }
.state { font: 600 12px ui-monospace, monospace; color: #b83a1a; }
</style>
