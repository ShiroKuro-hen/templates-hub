<script setup lang="ts">
import { ref } from 'vue';

type Plan = { name: string; desc: string; monthly: number; cta: string; href: string; features: string[]; featured?: boolean };
type Faq = { q: string; a: string };

withDefaults(defineProps<{ plans?: Plan[]; faq?: Faq[]; discount?: number }>(), {
  discount: 0.2,
  plans: () => [
    { name: 'Básico', desc: 'Para probar Nimbo con un equipo pequeño.', monthly: 0, cta: 'Empezar gratis', href: '#registro', features: ['Hasta 3 personas', '5 proyectos activos', '2 GB de almacenamiento'] },
    { name: 'Equipo', desc: 'Para equipos que trabajan a diario en Nimbo.', monthly: 12, cta: 'Probar 14 días gratis', href: '#registro', featured: true,
      features: ['Personas ilimitadas', 'Proyectos ilimitados', '100 GB y permisos por rol', 'Informes y automatizaciones'] },
    { name: 'Empresa', desc: 'Para organizaciones con requisitos de seguridad.', monthly: 29, cta: 'Hablar con ventas', href: '#ventas',
      features: ['Todo lo del plan Equipo', 'SSO y registro de auditoría', 'Disponibilidad garantizada del 99,9 %'] },
  ],
  faq: () => [
    { q: '¿Puedo cambiar de plan más adelante?', a: 'Sí. El cambio se aplica al momento y prorrateamos el importe en tu siguiente factura.' },
    { q: '¿Qué pasa al terminar la prueba gratis?', a: 'Tu espacio pasa al plan Básico. No perderás datos y puedes contratar cuando quieras.' },
    { q: '¿Qué formas de pago aceptáis?', a: 'Tarjeta de crédito o débito y, en planes anuales, transferencia bancaria.' },
  ],
});
const annual = ref(false);
const eur = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) + ' €';
</script>

<template>
  <main class="wrap">
    <header>
      <h1>Planes que crecen con tu equipo</h1>
      <p>Empieza gratis y cambia de plan cuando lo necesites. Todos incluyen soporte por correo y copias de seguridad diarias.</p>
      <fieldset class="billing">
        <legend>Periodo de facturación</legend>
        <label><input v-model="annual" type="radio" name="billing" :value="false" />Mensual</label>
        <label><input v-model="annual" type="radio" name="billing" :value="true" />Anual<span class="save">Ahorra un {{ Math.round(discount * 100) }} %</span></label>
      </fieldset>
    </header>

    <section class="plans" aria-label="Planes">
      <article v-for="p in plans" :key="p.name" class="plan" :class="{ featured: p.featured }">
        <h2>{{ p.name }}<span v-if="p.featured" class="tag">Más elegido</span></h2>
        <p>{{ p.desc }}</p>
        <p class="price">
          <strong>{{ eur(annual ? p.monthly * (1 - discount) : p.monthly) }}</strong>
          <span>{{ p.monthly === 0 ? 'siempre gratis' : `por persona y mes${annual ? ', facturado al año' : ''}` }}</span>
        </p>
        <a class="btn" :class="{ primary: p.featured }" :href="p.href">{{ p.cta }}</a>
        <ul>
          <li v-for="f in p.features" :key="f"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8.5l3 3 7-7" /></svg>{{ f }}</li>
        </ul>
      </article>
    </section>

    <section class="faq" aria-labelledby="faq">
      <h2 id="faq">Preguntas frecuentes</h2>
      <details v-for="(f, i) in faq" :key="f.q" name="faq" :open="i === 0"><summary>{{ f.q }}</summary><p>{{ f.a }}</p></details>
    </section>
  </main>
</template>

<style scoped>
.wrap{max-width:1040px;margin:0 auto;display:grid;gap:32px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{text-align:center;display:grid;justify-items:center;gap:8px;padding-top:12px}
h1{font-size:clamp(24px,4vw,32px);line-height:1.2;margin:0;letter-spacing:-.01em}
header p{margin:0;color:var(--muted);max-width:52ch}
.billing{display:inline-flex;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);padding:3px;margin:12px 0 0}
.billing legend{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.billing label{padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:500;color:var(--muted);transition:background .14s,color .14s}
.billing input{position:absolute;opacity:0;pointer-events:none}
.billing label:has(:checked){background:var(--accent-soft);color:var(--accent)}
.billing label:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.save{font-size:12px;font-weight:600;color:var(--ok);margin-left:4px}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;align-items:start}
.plan{position:relative;display:grid;gap:16px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.plan.featured{border-color:var(--accent)}
.plan.featured::before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.plan h2{font-size:16px;margin:0;display:flex;justify-content:space-between;align-items:center;gap:8px}
.tag{font-size:12px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent)}
.plan > p:not(.price){margin:-8px 0 0;color:var(--muted)}
.price{margin:0;display:flex;align-items:baseline;gap:6px}
.price strong{font-size:36px;line-height:1;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.price span{color:var(--muted)}
.btn{display:block;text-align:center;text-decoration:none;font-weight:600;border-radius:var(--radius);padding:10px 16px;border:1px solid var(--border);color:var(--text);background:var(--surface);transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
a:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ul{list-style:none;margin:0;padding:16px 0 0;border-top:1px solid var(--border);display:grid;gap:8px}
li{display:flex;gap:10px;align-items:flex-start}
li svg{flex:none;margin-top:3px;color:var(--ok)}
.faq{max-width:720px;width:100%;margin:0 auto}
.faq h2{font-size:20px;margin:0 0 12px}
details{border-bottom:1px solid var(--border)}
details:first-of-type{border-top:1px solid var(--border)}
summary{padding:14px 4px;cursor:pointer;font-weight:600;list-style:none;display:flex;justify-content:space-between;gap:12px;border-radius:4px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";color:var(--muted);font-weight:400;font-size:18px;line-height:1}
details[open] summary::after{content:"−"}
details p{margin:0;padding:0 4px 16px;color:var(--muted);max-width:65ch}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
