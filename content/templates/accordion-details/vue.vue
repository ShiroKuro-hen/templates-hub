<script setup lang="ts">
type Item = { id: string; pregunta: string; respuesta: string };

withDefaults(defineProps<{ items?: Item[]; name?: string; defaultOpenId?: string }>(), {
  name: 'faq',
  defaultOpenId: 'plan',
  items: () => [
    { id: 'plan', pregunta: '¿Puedo cambiar de plan en cualquier momento?', respuesta: 'Sí. El cambio se aplica al instante y cobramos solo la diferencia prorrateada.' },
    { id: 'baja', pregunta: '¿Cómo cancelo mi suscripción?', respuesta: 'Desde Ajustes → Facturación. Conservas el acceso hasta el final del período pagado.' },
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
.acc { display: grid; gap: 10px; font: 15px/1.5 system-ui, sans-serif; color: #17130f; interpolate-size: allow-keywords; }
details { border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
details[open] { background: #fff; box-shadow: 2px 2px 0 #17130f; transform: translate(2px, 2px); }
summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; font-weight: 700; cursor: pointer; list-style: none; border-radius: 8px; }
summary::-webkit-details-marker { display: none; }
summary::after { content: "+"; display: grid; place-items: center; flex: none; width: 24px; height: 24px; font: 700 16px ui-monospace, monospace; background: #ffd84d; border: 2px solid #17130f; border-radius: 50%; transition: transform .2s; }
details[open] summary::after { content: "−"; transform: rotate(180deg); background: #ff5a36; }
summary:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
p { margin: 0; padding: 0 14px 14px; color: #6b6258; }
details::details-content { block-size: 0; overflow: clip; transition: block-size .25s ease, content-visibility .25s allow-discrete; }
details[open]::details-content { block-size: auto; }
@media (prefers-reduced-motion: reduce) { details::details-content, summary::after { transition: none; } }
</style>
