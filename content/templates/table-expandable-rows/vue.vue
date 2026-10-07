<script setup lang="ts">
import { computed, reactive } from 'vue';

type Row = { id: string; servicio: string; entorno: string; estado: string; tono: string; duracion: string; detalle: [string, string, boolean?][] };
const rows: Row[] = [
  { id: 'd1', servicio: 'api-pagos', entorno: 'Producción', estado: 'Completado', tono: 'ok', duracion: '2 min 14 s',
    detalle: [['Versión', 'v3.8.1'], ['Responsable', 'Lucía Vargas'], ['Cambios', 'Corrige el redondeo de impuestos en las facturas.']] },
  { id: 'd2', servicio: 'web-cliente', entorno: 'Preproducción', estado: 'En curso', tono: 'info', duracion: '1 min 03 s',
    detalle: [['Versión', 'v5.2.0-rc2'], ['Responsable', 'Marco Huamán'], ['Cambios', 'Nuevo flujo de registro con verificación por correo.']] },
  { id: 'd3', servicio: 'worker-correo', entorno: 'Producción', estado: 'Fallido', tono: 'err', duracion: '48 s',
    detalle: [['Versión', 'v1.14.3'], ['Responsable', 'Diana Salas'], ['Error', 'Tiempo de espera agotado al conectar con la cola.', true], ['Solución', 'Revisa la variable QUEUE_URL y vuelve a desplegar.']] },
];
const open = reactive<Record<string, boolean>>({});
const allOpen = computed(() => rows.every((r) => open[r.id]));
const toggleAll = () => { const v = !allOpen.value; rows.forEach((r) => (open[r.id] = v)); };
</script>

<template>
  <section class="card" aria-labelledby="t">
    <header>
      <h2 id="t">Despliegues recientes</h2>
      <button class="btn" type="button" @click="toggleAll">{{ allOpen ? 'Contraer todo' : 'Expandir todo' }}</button>
    </header>
    <div class="scroll">
      <table>
        <caption class="sr">Despliegues recientes. Usa el botón de cada fila para ver su detalle.</caption>
        <thead>
          <tr><th scope="col" class="tgc"><span class="sr">Detalle</span></th><th scope="col">Servicio</th><th scope="col">Entorno</th><th scope="col">Estado</th><th scope="col" class="num">Duración</th></tr>
        </thead>
        <tbody>
          <template v-for="r in rows" :key="r.id">
            <tr :class="{ open: open[r.id] }">
              <td class="tgc">
                <button class="tg" type="button" :aria-expanded="!!open[r.id]" :aria-controls="r.id"
                        :aria-label="`Detalle de ${r.servicio}`" @click="open[r.id] = !open[r.id]">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              </td>
              <th scope="row">{{ r.servicio }}</th><td>{{ r.entorno }}</td>
              <td><span class="b" :class="r.tono">{{ r.estado }}</span></td><td class="num">{{ r.duracion }}</td>
            </tr>
            <tr :id="r.id" :hidden="!open[r.id]">
              <td />
              <td colspan="4">
                <dl><template v-for="[k, v, bad] in r.detalle" :key="k"><dt>{{ k }}</dt><dd :class="{ err: bad }">{{ v }}</dd></template></dl>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:820px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px}
.btn{font:inherit;padding:8px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn:focus-visible,.tg:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scroll{overflow-x:auto}
table{width:100%;min-width:560px;border-collapse:collapse}
th,td{padding:10px 16px;text-align:left;border-bottom:1px solid var(--border)}
thead th{color:var(--muted);font-weight:600}
tbody tr:last-child>*{border-bottom:0}
tbody th{font-weight:600}
.tgc{width:44px;padding:4px 8px}
.tg{display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--radius);background:none;color:var(--muted);cursor:pointer}
.tg:hover{background:var(--accent-soft);color:var(--text)}
.tg svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .14s}
.tg[aria-expanded=true] svg{transform:rotate(90deg)}
tr.open>:first-child,tr.open+tr>:first-child{background-image:linear-gradient(180deg,#22d3ee,#2f5bff);background-position:left;background-size:3px 100%;background-repeat:no-repeat}
tr.open>*{background-color:var(--accent-soft)}
tr.open+tr>*{background-color:var(--bg)}
.num{text-align:right;font-variant-numeric:tabular-nums}
.b{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;color:var(--text)}
.b::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.b.ok{background:var(--ok-soft)} .b.ok::before{color:var(--ok)}
.b.info{background:var(--info-soft)} .b.info::before{color:var(--info)}
.b.err{background:var(--err-soft)} .b.err::before{color:var(--err)}
dl{display:grid;grid-template-columns:max-content 1fr;gap:4px 20px;margin:0;padding:4px 0}
dt{color:var(--muted)} dd{margin:0}
dd.err{color:var(--err)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
