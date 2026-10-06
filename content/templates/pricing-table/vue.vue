<script setup lang="ts">
type Valor = boolean | string;
type Plan = { nombre: string; precio: string; destacado?: boolean };

const planes: Plan[] = [
  { nombre: 'Free', precio: '$0/mes' },
  { nombre: 'Pro', precio: '$12/mes', destacado: true },
  { nombre: 'Team', precio: '$39/mes' },
];
const filas: { caracteristica: string; valores: Valor[] }[] = [
  { caracteristica: 'Proyectos', valores: ['3', 'Ilimitados', 'Ilimitados'] },
  { caracteristica: 'Exportar a PDF', valores: [false, true, true] },
  { caracteristica: 'Dominio propio', valores: [false, true, true] },
  { caracteristica: 'Usuarios', valores: ['1', '1', 'Hasta 10'] },
  { caracteristica: 'Soporte prioritario', valores: [false, false, true] },
];
</script>

<template>
  <div class="wrap" role="region" aria-labelledby="cap" tabindex="0">
    <table>
      <caption id="cap">Comparativa de planes</caption>
      <thead>
        <tr>
          <td></td>
          <th v-for="p in planes" :key="p.nombre" scope="col" :class="{ hl: p.destacado }">
            <span v-if="p.destacado" class="tag">Recomendado</span>
            <span class="plan">{{ p.nombre }}</span>
            <span class="price">{{ p.precio }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in filas" :key="f.caracteristica">
          <th scope="row">{{ f.caracteristica }}</th>
          <td v-for="(v, i) in f.valores" :key="i" :class="{ hl: planes[i].destacado }">
            <template v-if="typeof v === 'string'">{{ v }}</template>
            <template v-else>
              <span :class="v ? 'yes' : 'no'" aria-hidden="true">{{ v ? '✓' : '✕' }}</span>
              <span class="sr">{{ v ? 'Incluido' : 'No incluido' }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.wrap{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
table{width:100%;min-width:440px;border-collapse:collapse;text-align:center;font-variant-numeric:tabular-nums}
caption,.sr{position:absolute;left:-9999px}
th,td{padding:12px 16px;border-bottom:1px solid var(--border)}
tbody tr:last-child>*{border-bottom:0}
tbody th{text-align:left;font-weight:500}
thead th{vertical-align:bottom}
.plan{display:block;font-size:16px;font-weight:600}
.price{display:block;font-size:13px;font-weight:400;color:var(--muted)}
.tag{display:inline-block;margin-bottom:6px;padding:1px 10px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:12px;font-weight:600}
.hl{background:var(--accent-soft)}
thead .hl{background:linear-gradient(135deg,#22d3ee,#2f5bff) top/100% 2px no-repeat,var(--accent-soft)}
.yes{color:var(--ok);font-weight:700}
.no{color:var(--muted);font-weight:700}
/* Tokens: ver pestaña HTML + CSS */
</style>
