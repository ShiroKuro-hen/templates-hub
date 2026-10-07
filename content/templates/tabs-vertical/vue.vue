<script setup lang="ts">
import { ref } from 'vue';

const tabs = [
  { id: 'perfil', label: 'Perfil', hint: 'Estos datos aparecen en tus comentarios y menciones.',
    rows: [['Nombre', 'Valeria Quispe'], ['Correo', 'valeria@nimbo.pe'], ['Zona horaria', 'Lima (UTC-5)']] },
  { id: 'seguridad', label: 'Seguridad', hint: 'Protege tu cuenta con verificación en dos pasos.',
    rows: [['Contraseña', 'Cambiada hace 42 días'], ['Verificación', 'App de autenticación activa'], ['Sesiones', '3 dispositivos']] },
  { id: 'avisos', label: 'Notificaciones', hint: 'Elige qué avisos recibes y por qué canal.',
    rows: [['Menciones', 'Correo y aplicación'], ['Resumen semanal', 'Lunes a las 08:00'], ['Alertas de pago', 'Solo aplicación']] },
  { id: 'pagos', label: 'Facturación', hint: 'Consulta tu plan y el próximo cobro.',
    rows: [['Plan', 'Business, 12 usuarios'], ['Próximo cobro', '1 de noviembre, S/ 1,940.00'], ['Método de pago', 'Visa terminada en 4242']] },
];
const sel = ref(0);
const btns = ref<HTMLButtonElement[]>([]);

function onKey(e: KeyboardEvent) {
  const n = tabs.length;
  const next = ({ ArrowDown: (sel.value + 1) % n, ArrowUp: (sel.value - 1 + n) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
  if (next === undefined) return;
  e.preventDefault();
  sel.value = next;
  btns.value[next]?.focus();
}
</script>

<template>
  <div class="tabs">
    <div role="tablist" aria-label="Ajustes de la cuenta" aria-orientation="vertical" @keydown="onKey">
      <button v-for="(t, i) in tabs" :key="t.id" ref="btns" role="tab" type="button" :id="`tab-${t.id}`"
              :aria-controls="`p-${t.id}`" :aria-selected="i === sel" :tabindex="i === sel ? 0 : -1" @click="sel = i">
        {{ t.label }}
      </button>
    </div>
    <div>
      <section v-for="(t, i) in tabs" :key="t.id" v-show="i === sel" role="tabpanel" :id="`p-${t.id}`"
               :aria-labelledby="`tab-${t.id}`" tabindex="0">
        <h2>{{ t.label }}</h2>
        <p>{{ t.hint }}</p>
        <dl><template v-for="[k, v] in t.rows" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></template></dl>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tabs{display:grid;grid-template-columns:200px 1fr;max-width:720px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
[role=tablist]{display:flex;flex-direction:column;gap:2px;padding:8px;border-right:1px solid var(--border)}
[role=tab]{position:relative;font:inherit;text-align:left;padding:10px 12px 10px 16px;border:0;border-radius:var(--radius);background:none;color:var(--muted);cursor:pointer;transition:background .14s,color .14s}
[role=tab]:hover{background:var(--accent-soft);color:var(--text)}
[role=tab][aria-selected=true]{background:var(--accent-soft);color:var(--text);font-weight:600}
[role=tab][aria-selected=true]::before{content:"";position:absolute;left:4px;top:10px;bottom:10px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
[role=tab]:focus-visible,[role=tabpanel]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
[role=tabpanel]{padding:20px 24px}
h2{margin:0 0 4px;font-size:16px}
p{margin:0 0 16px;color:var(--muted)}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:8px 20px}
dt{color:var(--muted)} dd{margin:0}
@media (max-width:520px){.tabs{grid-template-columns:1fr}[role=tablist]{border-right:0;border-bottom:1px solid var(--border)}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
