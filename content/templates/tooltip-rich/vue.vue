<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

type Ayuda = { id: string; campo: string; valor: string; titulo: string; texto: string; accion: string; href: string };

const ayudas: Ayuda[] = [
  { id: 'retencion', campo: 'Retención de datos', valor: '90 días', titulo: 'Retención de 90 días',
    texto: 'Los registros se eliminan al cumplirse 90 días. Exporta antes los que necesites conservar.', accion: 'Ver política', href: '#politica' },
  { id: 'sso', campo: 'Acceso con SSO', valor: 'Desactivado', titulo: 'Inicio de sesión único',
    texto: 'Tu equipo entra con la cuenta de la empresa. Necesitas el plan Business y un proveedor SAML.', accion: 'Configurar SSO', href: '#sso' },
];

function colocar(e: Event, id: string) {
  const p = e.currentTarget as HTMLElement;
  if (!p.matches(':popover-open')) return;
  const b = document.querySelector(`[popovertarget=${id}]`)!.getBoundingClientRect();
  p.style.left = `${Math.max(8, Math.min(b.left + b.width / 2 - p.offsetWidth / 2, innerWidth - p.offsetWidth - 8))}px`;
  p.style.top = `${b.bottom + 8 + p.offsetHeight < innerHeight ? b.bottom + 8 : Math.max(8, b.top - 8 - p.offsetHeight)}px`;
}
const cerrar = () => document.querySelectorAll<HTMLElement>(':popover-open').forEach((p) => p.hidePopover());
onMounted(() => addEventListener('scroll', cerrar, true));
onBeforeUnmount(() => removeEventListener('scroll', cerrar, true));
</script>

<template>
  <section class="card" aria-labelledby="tr-titulo">
    <h2 id="tr-titulo">Políticas del espacio</h2>
    <div v-for="a in ayudas" :key="a.id" class="row">
      <div class="name">
        {{ a.campo }}
        <button class="help" type="button" :popovertarget="a.id" :aria-label="`Más información sobre ${a.campo}`">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M6.2 6.2a1.9 1.9 0 1 1 2.6 1.8c-.5.3-.8.6-.8 1.2M8 11.4v.1" /></svg>
        </button>
        <div :id="a.id" class="tip" popover role="dialog" :aria-labelledby="`${a.id}-t`" @toggle="colocar($event, a.id)">
          <h3 :id="`${a.id}-t`">{{ a.titulo }}</h3>
          <p>{{ a.texto }}</p>
          <div class="acts">
            <a :href="a.href">{{ a.accion }}</a>
            <button type="button" :popovertarget="a.id" popovertargetaction="hide">Entendido</button>
          </div>
        </div>
      </div>
      <span class="val">{{ a.valor }}</span>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:520px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;padding:16px 20px;border-bottom:1px solid var(--border);font-size:16px;font-weight:600}
.row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border)}
.row:last-child{border-bottom:0}
.name{display:flex;align-items:center;gap:4px;font-weight:600}
.val{color:var(--muted);font-variant-numeric:tabular-nums;text-align:right}
.help{display:grid;place-items:center;width:28px;height:28px;padding:0;border:1px solid transparent;border-radius:999px;background:none;color:var(--muted);cursor:pointer;transition:background .14s,color .14s}
.help:hover,.help:has(+ :popover-open){background:var(--accent-soft);color:var(--accent)}
.help:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.help svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.tip{position:fixed;inset:auto;margin:0;width:280px;padding:16px;border:1px solid var(--border);border-radius:var(--radius);color:var(--text);box-shadow:var(--shadow);font-weight:400;
     background:linear-gradient(135deg,#22d3ee,#2f5bff) top/100% 2px no-repeat,var(--surface);
     opacity:0;transition:opacity .14s,display .14s allow-discrete,overlay .14s allow-discrete}
.tip:popover-open{opacity:1}
@starting-style{.tip:popover-open{opacity:0}}
.tip h3{margin:0 0 4px;font-size:14px;font-weight:600}
.tip p{margin:0 0 12px;color:var(--muted)}
.acts{display:flex;align-items:center;gap:12px}
.acts a{color:var(--accent);font-weight:600;text-decoration:none;border-radius:4px}
.acts a:hover{text-decoration:underline}
.acts button{margin-left:auto;padding:4px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;cursor:pointer}
.acts button:hover{border-color:var(--accent)}
.tip a:focus-visible,.tip button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
