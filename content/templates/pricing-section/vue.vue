<script setup lang="ts">
import { ref } from 'vue';

type Plan = { name: string; blurb: string; m: number; y: number; cta: string; pop?: boolean; items: string[] };
const plans: Plan[] = [
  { name: 'Inicial', blurb: 'Para probar Nimbo con tu equipo.', m: 0, y: 0, cta: 'Empezar gratis',
    items: ['Hasta 3 usuarios', '5 proyectos activos', 'Historial de 30 días', 'Soporte de la comunidad'] },
  { name: 'Equipo', blurb: 'Para equipos que automatizan su trabajo.', m: 12, y: 10, cta: 'Probar 14 días gratis', pop: true,
    items: ['Usuarios y proyectos ilimitados', '1.000 automatizaciones al mes', 'Historial de 1 año', 'Soporte por chat en 4 horas'] },
  { name: 'Empresa', blurb: 'Para organizaciones con requisitos de seguridad.', m: 29, y: 24, cta: 'Hablar con ventas',
    items: ['SSO y aprovisionamiento SCIM', 'Registro de auditoría completo', 'SLA de disponibilidad del 99,99 %', 'Gerente de cuenta dedicado'] },
];
const anual = ref(false);
const precio = (p: Plan) => (anual.value ? p.y : p.m);
const nota = (p: Plan) =>
  precio(p) === 0 ? 'gratis para siempre' : `por usuario al mes, ${anual.value ? `US$ ${p.y * 12} al año` : 'facturado cada mes'}`;
</script>

<template>
  <section class="sec" aria-labelledby="t">
    <header>
      <h2 id="t">Planes simples para equipos que crecen</h2>
      <p>Empieza gratis y cambia de plan cuando lo necesites. Sin permanencia ni costos ocultos.</p>
      <fieldset>
        <legend class="sr">Periodo de facturación</legend>
        <div class="toggle">
          <label><input type="radio" name="b" :checked="!anual" @change="anual = false" />Mensual</label>
          <label><input type="radio" name="b" :checked="anual" @change="anual = true" />Anual</label>
        </div>
        <span class="badge">Ahorra 17 %</span>
      </fieldset>
    </header>
    <div class="plans">
      <article v-for="p in plans" :key="p.name" class="plan" :class="{ pop: p.pop }">
        <h3>{{ p.name }}<span v-if="p.pop" class="badge">Más popular</span></h3>
        <p>{{ p.blurb }}</p>
        <div class="price">${{ precio(p) }}<small>{{ nota(p) }}</small></div>
        <a class="btn" :class="{ pri: p.pop }" href="#">{{ p.cta }}</a>
        <ul><li v-for="i in p.items" :key="i">{{ i }}</li></ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.sec{max-width:1000px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;--ck:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 8.5l3.2 3.2L13 4.8' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
header{text-align:center;margin-bottom:24px}
h2{margin:0 0 8px;font-size:clamp(24px,4vw,32px);line-height:1.2;letter-spacing:-.02em}
header p{margin:0 auto 20px;max-width:52ch;color:var(--muted)}
fieldset{border:0;margin:0;padding:0;min-width:0;display:inline-flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center}
.toggle{display:inline-flex;gap:2px;padding:3px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.toggle label{position:relative;padding:6px 16px;border-radius:6px;cursor:pointer;font-weight:500;color:var(--muted);transition:background .14s,color .14s}
.toggle input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.toggle label:has(:checked){background:var(--accent);color:var(--accent-ink)}
.toggle label:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.badge{padding:2px 10px;border-radius:999px;background:var(--ok-soft);color:var(--ok);font-size:12px;font-weight:600}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
.plan{display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.plan.pop{border-color:transparent;background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.plan h3{display:flex;justify-content:space-between;align-items:center;margin:0;font-size:16px}
.plan h3 .badge{background:var(--accent-soft);color:var(--accent)}
.plan p{margin:0;color:var(--muted)}
.price{font-size:36px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
.price small{display:block;margin-top:4px;font-size:13px;font-weight:400;letter-spacing:0;color:var(--muted)}
.btn{display:block;padding:9px 16px;text-align:center;font-weight:600;color:var(--text);text-decoration:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:filter .14s,border-color .14s}
.btn:hover{border-color:var(--accent);filter:brightness(.97)}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ul{flex:1;display:grid;align-content:start;gap:10px;margin:0;padding:16px 0 0;list-style:none;border-top:1px solid var(--border)}
li{display:flex;gap:10px}
li::before{content:"";flex:none;width:16px;height:16px;margin-top:3px;background:var(--ok);-webkit-mask:var(--ck) center/contain no-repeat;mask:var(--ck) center/contain no-repeat}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
