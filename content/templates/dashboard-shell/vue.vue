<script setup lang="ts">
import { computed, ref } from 'vue';

type Kpi = { label: string; value: string; delta: string; good: boolean };
type Order = { cliente: string; pedido: string; estado: 'Pagado' | 'Pendiente' | 'En revisión'; importe: string };

const props = withDefaults(defineProps<{ kpis?: Kpi[]; orders?: Order[]; active?: string }>(), {
  active: 'Resumen',
  kpis: () => [
    { label: 'Ingresos mensuales', value: '48 250 €', delta: '+12,4 %', good: true },
    { label: 'Usuarios activos', value: '3 812', delta: '+5,1 %', good: true },
    { label: 'Conversión', value: '4,7 %', delta: '−0,3 %', good: false },
    { label: 'Incidencias abiertas', value: '17', delta: '−6', good: true },
  ],
  orders: () => [
    { cliente: 'Altamira Logística', pedido: '#10482', estado: 'Pagado', importe: '1 240,00 €' },
    { cliente: 'Grupo Sendero', pedido: '#10481', estado: 'Pendiente', importe: '890,50 €' },
    { cliente: 'Estudio Faro', pedido: '#10479', estado: 'En revisión', importe: '2 310,00 €' },
  ],
});
const nav = [
  ['Resumen', 'M4 11l8-7 8 7v9h-5v-6H9v6H4z'],
  ['Proyectos', 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18'],
  ['Informes', 'M5 20V10M12 20V4M19 20v-7'],
  ['Equipo', 'M9 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6'],
  ['Ajustes', 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6M12 2v3M12 19v3M2 12h3M19 12h3'],
] as const;
const badge = { Pagado: 'b-ok', Pendiente: 'b-warn', 'En revisión': 'b-info' } as const;
const q = ref('');
const rows = computed(() => props.orders.filter((o) => `${o.cliente} ${o.pedido}`.toLowerCase().includes(q.value.trim().toLowerCase())));
</script>

<template>
  <div class="app">
    <nav class="side" aria-label="Principal">
      <div class="brand"><span class="logo" aria-hidden="true" />Nimbo</div>
      <ul>
        <li v-for="[label, d] in nav" :key="label">
          <a href="#" :aria-current="label === active ? 'page' : undefined">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path :d="d" /></svg>
            <span>{{ label }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="main">
      <header class="top">
        <div class="search" role="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input v-model="q" type="search" placeholder="Buscar clientes o pedidos" aria-label="Buscar clientes o pedidos" />
        </div>
        <button class="icon" type="button" aria-label="Notificaciones, 3 sin leer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg></button>
        <button class="avatar" type="button" aria-label="Cuenta de Laura Méndez">LM</button>
      </header>
      <main class="content">
        <div class="head">
          <div><h1>Resumen</h1><p>Datos de los últimos 30 días.</p></div>
          <button class="btn" type="button">Nuevo proyecto</button>
        </div>
        <dl class="kpis">
          <div v-for="k in kpis" :key="k.label" class="kpi">
            <dt>{{ k.label }}</dt>
            <dd><strong>{{ k.value }}</strong><span class="delta" :class="k.good ? 'up' : 'down'">{{ k.delta }}</span></dd>
          </div>
        </dl>
        <section class="panel" aria-labelledby="recent">
          <h2 id="recent">Actividad reciente</h2>
          <table>
            <thead><tr><th scope="col">Cliente</th><th scope="col">Pedido</th><th scope="col">Estado</th><th scope="col" class="num">Importe</th></tr></thead>
            <tbody>
              <tr v-for="o in rows" :key="o.pedido">
                <td>{{ o.cliente }}</td><td>{{ o.pedido }}</td>
                <td><span class="badge" :class="badge[o.estado]">{{ o.estado }}</span></td>
                <td class="num">{{ o.importe }}</td>
              </tr>
              <tr v-if="!rows.length" class="empty"><td colspan="4">No hay resultados. Prueba con otro nombre o número de pedido.</td></tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.side{border-right:1px solid var(--border);padding:16px 12px;display:flex;flex-direction:column;gap:20px}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px;padding:0 8px}
.logo{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#22d3ee,#2f5bff);flex:none}
.side ul{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.side a{display:flex;align-items:center;gap:10px;padding:8px;border-radius:6px;color:var(--muted);text-decoration:none;font-weight:500;transition:background .14s,color .14s}
.side a:hover{background:var(--bg);color:var(--text)}
.side a[aria-current=page]{background:var(--accent-soft);color:var(--accent)}
.main{min-width:0;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:12px;padding:12px 24px;border-bottom:1px solid var(--border)}
.search{flex:1;max-width:420px;position:relative}
.search svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted)}
.search input{width:100%;box-sizing:border-box;font:inherit;color:inherit;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:7px 12px 7px 34px}
.icon{margin-left:auto;width:34px;height:34px;display:grid;place-items:center;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--muted)}
.avatar{width:34px;height:34px;flex:none;border-radius:999px;border:0;background:var(--accent-soft);color:var(--accent);font:inherit;font-weight:600;font-size:13px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.content{padding:24px;display:grid;gap:24px}
.head{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px}
h1{font-size:22px;line-height:1.25;margin:0}
.head p{margin:2px 0 0;color:var(--muted)}
.btn{font:inherit;font-weight:600;border-radius:var(--radius);padding:8px 14px;background:var(--accent);color:var(--accent-ink);border:1px solid var(--accent)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:0}
.kpi{border:1px solid var(--border);border-radius:var(--radius);padding:16px}
.kpi dt{color:var(--muted)}
.kpi dd{margin:4px 0 0;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.kpi strong{font-size:24px;font-weight:650;font-variant-numeric:tabular-nums}
.delta,.badge{font-size:12px;font-weight:600;padding:1px 8px;border-radius:999px}
.up,.b-ok{background:var(--ok-soft);color:var(--ok)}.down{background:var(--err-soft);color:var(--err)}
.b-warn{background:var(--warn-soft);color:var(--warn)}.b-info{background:var(--info-soft);color:var(--info)}
.panel{border:1px solid var(--border);border-radius:var(--radius);overflow:auto}
.panel h2{font-size:15px;margin:0;padding:14px 16px;border-bottom:1px solid var(--border)}
table{width:100%;border-collapse:collapse;white-space:nowrap}
th,td{padding:10px 16px;text-align:left;border-bottom:1px solid var(--border)}
th{color:var(--muted);font-weight:600}
tbody tr:last-child td{border-bottom:0}
.num{text-align:right;font-variant-numeric:tabular-nums}
.empty td{text-align:center;color:var(--muted);padding:24px}
@media (max-width:760px){.app{grid-template-columns:1fr}.side{border-right:0;border-bottom:1px solid var(--border);flex-direction:row;align-items:center;overflow-x:auto;padding:10px 12px}.side ul{display:flex}.side a span{white-space:nowrap}.top,.content{padding-left:16px;padding-right:16px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
