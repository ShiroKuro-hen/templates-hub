<script setup lang="ts">
type Articulo = {
  id: string; categoria: string; tono: 'info' | 'ok'; titulo: string; resumen: string;
  lectura: string; fecha: string; iso: string; arte: 'linea' | 'colinas'; invertida?: boolean;
};

withDefaults(defineProps<{ articulos?: Articulo[] }>(), {
  articulos: () => [
    { id: 'a1', categoria: 'Seguridad', tono: 'info', titulo: 'Activa la verificación en dos pasos',
      resumen: 'Protege tu cuenta con un código temporal. Tarda menos de dos minutos.',
      lectura: 'Lectura de 4 min', fecha: '12 mar 2026', iso: '2026-03-12', arte: 'linea' },
    { id: 'a2', categoria: 'Facturación', tono: 'ok', titulo: 'Entiende tu primera factura',
      resumen: 'Revisa qué incluye cada línea, cómo se prorratea el plan y dónde descargar el PDF.',
      lectura: 'Lectura de 6 min', fecha: '3 feb 2026', iso: '2026-02-03', arte: 'colinas', invertida: true },
  ],
});
</script>

<template>
  <div class="list">
    <article v-for="a in articulos" :key="a.id" class="card" :class="{ rev: a.invertida }">
      <div class="art">
        <svg viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <defs><linearGradient :id="`g-${a.id}`" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
          <rect class="bg" width="240" height="180" />
          <template v-if="a.arte === 'linea'">
            <path class="gl" d="M0 45H240M0 90H240M0 135H240M60 0V180M120 0V180M180 0V180" />
            <path d="M0 140L50 110L95 124L150 66L240 40V180H0Z" :fill="`url(#g-${a.id})`" opacity=".16" />
            <path d="M0 140L50 110L95 124L150 66L240 40" fill="none" :stroke="`url(#g-${a.id})`" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
            <circle class="dot" cx="150" cy="66" r="6" />
          </template>
          <template v-else>
            <circle cx="170" cy="58" r="26" :fill="`url(#g-${a.id})`" />
            <path class="h1" d="M0 150Q60 100 120 130T240 110V180H0Z" />
            <path class="h2" d="M0 165Q70 125 130 150T240 135V180H0Z" />
          </template>
        </svg>
      </div>
      <div class="body">
        <span class="badge" :class="{ ok: a.tono === 'ok' }">{{ a.categoria }}</span>
        <h2>{{ a.titulo }}</h2>
        <p>{{ a.resumen }}</p>
        <div class="meta"><span>{{ a.lectura }}</span><time :datetime="a.iso">{{ a.fecha }}</time></div>
        <a class="btn" href="#">Leer guía</a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.list{display:grid;gap:16px;max-width:680px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{display:grid;grid-template-columns:minmax(120px,38%) 1fr;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s,box-shadow .14s}
.card:hover,.card:focus-within{border-color:var(--accent);box-shadow:var(--shadow)}
.art{position:relative;min-height:160px}
.art svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.rev .art{order:2}
.bg{fill:var(--accent-soft)}
.gl{fill:none;stroke:var(--border);stroke-width:1}
.dot{fill:var(--surface);stroke:var(--accent);stroke-width:2}
.h1{fill:var(--accent);opacity:.18}
.h2{fill:var(--accent);opacity:.35}
.body{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:18px 20px}
.badge{padding:0 10px;border-radius:999px;font-size:12px;font-weight:600;background:var(--info-soft);color:var(--info)}
.badge.ok{background:var(--ok-soft);color:var(--ok)}
h2{margin:0;font-size:17px;line-height:1.35}
p{margin:0;color:var(--muted)}
.meta{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.btn{margin-top:auto;padding:6px 14px;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);text-decoration:none}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:520px){.card{grid-template-columns:1fr}.art{height:140px;min-height:0}.rev .art{order:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
