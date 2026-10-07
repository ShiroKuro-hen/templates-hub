<script setup lang="ts">
type Estado = 'curso' | 'riesgo' | 'listo';
type Proyecto = {
  id: string; titulo: string; responsable: string; estado: Estado; avance: number;
  entrega: string; presupuesto: string; equipo: string; hitos: { texto: string; iso: string; fecha: string }[];
  abierto?: boolean;
};

const ETIQUETA: Record<Estado, string> = { curso: 'En curso', riesgo: 'En riesgo', listo: 'Completado' };
const CLASE: Record<Estado, string> = { curso: '', riesgo: 'warn', listo: 'ok' };

withDefaults(defineProps<{ proyectos?: Proyecto[] }>(), {
  proyectos: () => [
    { id: 'nube', titulo: 'Migración a la nube', responsable: 'Marta Ruiz', estado: 'curso', avance: 68, entrega: '30 abr 2026',
      presupuesto: 'S/ 84.000', equipo: '7 personas', abierto: true,
      hitos: [{ texto: 'Pruebas de carga', iso: '2026-03-14', fecha: '14 mar' }, { texto: 'Corte de la base de datos', iso: '2026-04-02', fecha: '2 abr' }] },
    { id: 'panel', titulo: 'Rediseño del panel de clientes', responsable: 'Luis Gómez', estado: 'riesgo', avance: 41, entrega: '18 may 2026',
      presupuesto: 'S/ 52.500', equipo: '4 personas',
      hitos: [{ texto: 'Validar prototipo con clientes', iso: '2026-03-20', fecha: '20 mar' }, { texto: 'Entrega de componentes', iso: '2026-04-15', fecha: '15 abr' }] },
    { id: 'audit', titulo: 'Auditoría de seguridad anual', responsable: 'Carlos Díaz', estado: 'listo', avance: 100, entrega: '28 feb 2026',
      presupuesto: 'S/ 31.200', equipo: '3 personas', hitos: [{ texto: 'Informe final firmado', iso: '2026-02-28', fecha: '28 feb' }] },
  ],
});
</script>

<template>
  <div class="list">
    <details v-for="p in proyectos" :key="p.id" :open="p.abierto">
      <summary>
        <span><span class="ttl">{{ p.titulo }}</span><span class="own">Responsable: {{ p.responsable }}</span></span>
        <span class="end">
          <span class="badge" :class="CLASE[p.estado]">{{ ETIQUETA[p.estado] }}</span>
          <svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6" /></svg>
        </span>
        <span class="pg" :style="{ '--p': p.avance }"><i />{{ p.avance }}% completado</span>
      </summary>
      <div class="det">
        <dl>
          <div><dt>Entrega</dt><dd>{{ p.entrega }}</dd></div>
          <div><dt>Presupuesto</dt><dd>{{ p.presupuesto }}</dd></div>
          <div><dt>Equipo</dt><dd>{{ p.equipo }}</dd></div>
        </dl>
        <ul class="ms"><li v-for="h in p.hitos" :key="h.texto"><span>{{ h.texto }}</span><time :datetime="h.iso">{{ h.fecha }}</time></li></ul>
        <a class="btn" href="#">Ver proyecto</a>
      </div>
    </details>
  </div>
</template>

<style scoped>
.list{display:grid;gap:12px;max-width:620px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;interpolate-size:allow-keywords}
details{overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:box-shadow .14s}
details[open]{box-shadow:var(--shadow)}
details::details-content{block-size:0;overflow:hidden;transition:block-size .16s ease,content-visibility .16s allow-discrete}
details[open]::details-content{block-size:auto}
summary{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px 12px;padding:14px 16px;cursor:pointer;list-style:none}
summary::-webkit-details-marker{display:none}
summary:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.ttl{display:block;font-size:15px;font-weight:600;line-height:1.35}
.own{display:block;color:var(--muted);font-size:13px}
.end{display:flex;align-items:center;gap:10px}
.badge{display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:600;background:var(--info-soft)}
.badge::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--info)}
.badge.warn{background:var(--warn-soft)} .badge.warn::before{background:var(--warn)}
.badge.ok{background:var(--ok-soft)} .badge.ok::before{background:var(--ok)}
.chev{width:16px;height:16px;color:var(--muted);transition:transform .16s}
details[open] .chev{transform:rotate(180deg)}
.pg{grid-column:1/-1;display:flex;align-items:center;gap:10px;color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}
.pg i{flex:1;height:6px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.pg i::after{content:"";display:block;height:100%;width:calc(var(--p) * 1%);border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.det{padding:14px 16px 16px;border-top:1px solid var(--border)}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px 16px;margin:0 0 14px}
dt{color:var(--muted);font-size:13px}
dd{margin:0;font-weight:600}
.ms{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:6px}
.ms li{display:flex;justify-content:space-between;gap:12px}
.ms time{color:var(--muted);font-variant-numeric:tabular-nums}
.btn{display:inline-block;padding:6px 14px;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);text-decoration:none}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}details::details-content{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
