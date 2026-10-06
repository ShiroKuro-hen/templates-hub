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
.wrap { overflow-x: auto; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.wrap:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
table { width: 100%; min-width: 440px; border-collapse: collapse; text-align: center; }
caption, .sr { position: absolute; left: -9999px; }
th, td { padding: 10px 12px; border-bottom: 1px solid #17130f33; }
tbody th { text-align: left; font-weight: 500; }
thead th { border-bottom: 2px solid #17130f; vertical-align: bottom; }
.plan { display: block; font-size: 1.05rem; font-weight: 700; letter-spacing: -.02em; }
.price { display: block; font: 600 .8rem ui-monospace, monospace; color: #6b6258; }
.tag { display: inline-block; margin-bottom: 4px; padding: 1px 8px; border: 2px solid #17130f; border-radius: 99px; background: #ff5a36; font: 700 .7rem ui-monospace, monospace; }
.hl { background: #ffd84d55; border-left: 2px solid #17130f; border-right: 2px solid #17130f; }
thead .hl { background: #ffd84d; border-top: 2px solid #17130f; }
tbody tr:last-child .hl { border-bottom: 2px solid #17130f; }
.yes { color: #1f9d55; font-weight: 800; } .no { color: #d6293e; font-weight: 800; }
</style>
