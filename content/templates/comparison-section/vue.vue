<script setup lang="ts">
type Cell = boolean | string; // true = incluido, false = no incluido, string = texto
type Row = { feature: string; nimbo: Cell; orbita: Cell; cumbre: Cell };

const rows: Row[] = [
  { feature: 'Automatizaciones sin código', nimbo: true, orbita: true, cumbre: false },
  { feature: 'Integraciones nativas', nimbo: '120+', orbita: '45', cumbre: '20' },
  { feature: 'Edición colaborativa en tiempo real', nimbo: true, orbita: false, cumbre: false },
  { feature: 'SSO y aprovisionamiento SCIM', nimbo: true, orbita: 'Costo extra', cumbre: false },
  { feature: 'Registro de auditoría', nimbo: true, orbita: true, cumbre: false },
  { feature: 'Datos alojados en Latinoamérica', nimbo: true, orbita: false, cumbre: false },
  { feature: 'Respuesta de soporte', nimbo: '4 h', orbita: '24 h', cumbre: '48 h' },
  { feature: 'Precio por usuario al mes', nimbo: 'US$ 12', orbita: 'US$ 18', cumbre: 'US$ 15' },
];
const cols = [['nimbo', 'Nimbo'], ['orbita', 'Órbita'], ['cumbre', 'Cumbre']] as const;
</script>

<template>
  <section class="sec" aria-labelledby="t">
    <h2 id="t">Nimbo frente a otras alternativas</h2>
    <p class="lead">Compara lo que incluye cada plan de equipo y elige con datos. Actualizado en septiembre de 2026.</p>
    <div class="wrap" role="region" aria-label="Tabla comparativa, desplázate para ver más columnas" tabindex="0">
      <table>
        <caption class="sr">Comparativa de funciones entre Nimbo, Órbita y Cumbre</caption>
        <thead>
          <tr>
            <th scope="col">Función</th>
            <th v-for="[k, label] in cols" :key="k" scope="col" :class="{ us: k === 'nimbo' }">
              <span v-if="k === 'nimbo'">{{ label }}</span><template v-else>{{ label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.feature">
            <th scope="row">{{ r.feature }}</th>
            <td v-for="[k] in cols" :key="k" :class="{ us: k === 'nimbo' }">
              <template v-if="typeof r[k] === 'string'"><b v-if="k === 'nimbo'">{{ r[k] }}</b><template v-else>{{ r[k] }}</template></template>
              <i v-else :class="r[k] ? 'yes' : 'no'"><b class="sr">{{ r[k] ? 'Incluido' : 'No incluido' }}</b></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.sec{max-width:900px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;--ck:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 8.5l3.2 3.2L13 4.8' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");--cx:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4l8 8M12 4l-8 8' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
h2{margin:0 0 8px;font-size:clamp(24px,4vw,32px);line-height:1.2;letter-spacing:-.02em}
.lead{margin:0 0 20px;max-width:60ch;color:var(--muted)}
.wrap{overflow-x:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.wrap:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
table{width:100%;min-width:600px;border-collapse:separate;border-spacing:0}
th,td{padding:12px 16px;text-align:center;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums}
tbody tr:last-child :is(th,td){border-bottom:0}
thead th{padding-top:16px;font-size:15px;font-weight:600;vertical-align:bottom}
th[scope=row]{position:sticky;left:0;z-index:1;background:var(--surface);text-align:left;font-weight:500}
thead th:first-child{text-align:left;color:var(--muted);font-weight:500}
.us{background:var(--accent-soft)}
thead .us span{display:inline-block;padding:2px 10px;border-radius:999px;color:var(--accent-ink);background:linear-gradient(135deg,#22d3ee,#2f5bff);font-size:13px}
td:not(.us){color:var(--muted)}
tbody tr{transition:background .14s}
tbody tr:hover :is(td:not(.us),th){background:var(--accent-soft)}
.yes,.no{display:inline-block;width:18px;height:18px;vertical-align:middle;-webkit-mask:var(--ck) center/contain no-repeat;mask:var(--ck) center/contain no-repeat;background:var(--ok)}
.no{-webkit-mask-image:var(--cx);mask-image:var(--cx);background:var(--muted);opacity:.7}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
