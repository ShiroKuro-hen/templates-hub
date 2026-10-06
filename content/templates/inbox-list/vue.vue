<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

type Mail = { id: number; from: string; time: string; subject: string; preview: string; unread: boolean };
const mails = ref<Mail[]>([
  { id: 1, from: 'Lucía Ortega', time: '09:41', subject: 'Informe de incidencias de septiembre', preview: 'Adjunto el resumen con los tiempos de respuesta.', unread: true },
  { id: 2, from: 'Soporte Nimbus', time: '08:15', subject: 'Tu ticket 4821 está resuelto', preview: 'Confirma si el problema de acceso continúa.', unread: true },
  { id: 3, from: 'Gonzalo Paredes', time: 'Ayer', subject: 'Agenda del comité del jueves', preview: 'Faltan dos puntos por confirmar.', unread: false },
  { id: 4, from: 'Facturación', time: 'Ayer', subject: 'Factura de septiembre disponible', preview: 'Descárgala desde el portal de cuenta.', unread: false },
  { id: 5, from: 'Rocío Aguirre', time: '3 oct', subject: 'Re: Revisión del contrato marco', preview: 'Acepto los cambios de la cláusula 7.', unread: true },
]);
const sel = ref<number[]>([]);
const all = ref<HTMLInputElement>();
const unread = computed(() => mails.value.filter((m) => m.unread).length);
const allOn = computed(() => mails.value.length > 0 && sel.value.length === mails.value.length);

watchEffect(() => { if (all.value) all.value.indeterminate = sel.value.length > 0 && !allOn.value; });

const toggleAll = (on: boolean) => (sel.value = on ? mails.value.map((m) => m.id) : []);
function mark(u: boolean) { mails.value.forEach((m) => { if (sel.value.includes(m.id)) m.unread = u; }); sel.value = []; }
function archive() { mails.value = mails.value.filter((m) => !sel.value.includes(m.id)); sel.value = []; }
</script>

<template>
  <section class="box" aria-labelledby="h">
    <div class="bar"><h2 id="h">Bandeja de entrada</h2><span class="badge">{{ unread }} sin leer</span></div>
    <div class="tools" role="toolbar" aria-label="Acciones de la selección">
      <label>
        <input ref="all" type="checkbox" :checked="allOn" :disabled="!mails.length" @change="toggleAll(($event.target as HTMLInputElement).checked)">
        <span>{{ sel.length ? `${sel.length} ${sel.length === 1 ? 'seleccionado' : 'seleccionados'}` : 'Seleccionar todo' }}</span>
      </label>
      <button type="button" :disabled="!sel.length" @click="mark(false)">Marcar como leído</button>
      <button type="button" :disabled="!sel.length" @click="mark(true)">Marcar como no leído</button>
      <button type="button" :disabled="!sel.length" @click="archive">Archivar</button>
    </div>
    <ul>
      <li v-for="m in mails" :key="m.id" class="row" :data-unread="m.unread || undefined">
        <input v-model="sel" type="checkbox" :value="m.id" :aria-label="`Seleccionar mensaje de ${m.from}`">
        <button class="open" type="button" @click="m.unread = false">
          <span class="who"><span v-if="m.unread" class="sr">No leído. </span>{{ m.from }}</span>
          <time>{{ m.time }}</time>
          <span class="sub"><b>{{ m.subject }}</b> - {{ m.preview }}</span>
        </button>
      </li>
    </ul>
    <p v-if="!mails.length" class="empty"><b>No quedan mensajes por revisar</b>Los mensajes nuevos aparecerán aquí.</p>
  </section>
</template>

<style scoped>
.box{max-width:680px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:10px 16px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px}
.badge{padding:0 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-variant-numeric:tabular-nums}
.tools{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:8px 16px;border-bottom:1px solid var(--border);color:var(--muted)}
.tools label{display:flex;align-items:center;gap:8px;margin-right:auto}
input[type=checkbox]{width:16px;height:16px;margin:0;accent-color:var(--accent)}
button{font:inherit;padding:4px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s}
button:hover:not(:disabled){background:var(--accent-soft)}
button:disabled{color:var(--muted);opacity:.6;cursor:not-allowed}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ul{list-style:none;margin:0;padding:0}
.row{display:flex;align-items:center;gap:12px;padding:0 16px;border-bottom:1px solid var(--border);transition:background .14s}
.row:last-child{border-bottom:0}
.row:hover,.row:has(input:checked){background:var(--accent-soft)}
.open{all:unset;box-sizing:border-box;flex:1;min-width:0;display:grid;grid-template-columns:1fr auto;gap:0 12px;padding:10px 0;cursor:pointer}
.open:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.who,.sub{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sub{grid-column:1/-1;color:var(--muted)}
.sub b{font-weight:500}
time{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.row[data-unread] .who,.row[data-unread] .sub b{font-weight:700}
.row[data-unread] .sub{color:var(--text)}
.row[data-unread] .who::before{content:"";display:inline-block;width:8px;height:8px;margin-right:8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.empty{margin:0;padding:32px 16px;text-align:center;color:var(--muted)}
.empty b{display:block;color:var(--text)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
