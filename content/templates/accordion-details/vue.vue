<script setup lang="ts">
type Item = { id: string; pregunta: string; respuesta: string };

withDefaults(defineProps<{ items?: Item[]; name?: string; defaultOpenId?: string }>(), {
  name: 'faq',
  defaultOpenId: 'plan',
  items: () => [
    { id: 'plan', pregunta: '¿Puedo cambiar de plan en cualquier momento?', respuesta: 'Sí. El cambio se aplica al instante y cobramos solo la diferencia prorrateada.' },
    { id: 'baja', pregunta: '¿Cómo cancelo mi suscripción?', respuesta: 'Abre Ajustes y entra en Facturación. Conservas el acceso hasta el final del período pagado.' },
    { id: 'ruc', pregunta: '¿Ofrecen facturas con RUC?', respuesta: 'Claro: añade tus datos fiscales en Facturación y las emitiremos cada mes.' },
  ],
});
</script>

<template>
  <div class="acc">
    <details v-for="it in items" :key="it.id" :name="name" :open="it.id === defaultOpenId">
      <summary>{{ it.pregunta }}</summary>
      <p>{{ it.respuesta }}</p>
    </details>
  </div>
</template>

<style scoped>
.acc { display: grid; gap: 8px; max-width: 640px; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); interpolate-size: allow-keywords; }
details { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); transition: border-color 140ms; }
details[open] { border-color: var(--accent); }
summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; font-weight: 600; cursor: pointer; list-style: none; border-radius: var(--radius); }
summary::-webkit-details-marker { display: none; }
summary::after { content: "+"; display: grid; place-items: center; flex: none; width: 24px; height: 24px; font-size: 16px; line-height: 1; background: var(--accent-soft); color: var(--accent); border-radius: 50%; transition: transform 160ms; }
details[open] summary::after { content: "−"; transform: rotate(180deg); background: linear-gradient(135deg, #22d3ee, #2f5bff); color: #fff; }
summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
p { margin: 0; padding: 0 16px 14px; color: var(--muted); }
details::details-content { block-size: 0; overflow: clip; transition: block-size 160ms ease, content-visibility 160ms allow-discrete; }
details[open]::details-content { block-size: auto; }
@media (prefers-reduced-motion: reduce) { details, details::details-content, summary::after { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
