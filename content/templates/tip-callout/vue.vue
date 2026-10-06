<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

type Kind = 'info' | 'consejo' | 'atencion';
type Tip = { id: string; kind: Kind; title: string; body: string; link?: { label: string; href: string } };

const tips: Tip[] = [
  { id: 'sync', kind: 'info', title: 'Los informes se actualizan cada hora', body: 'Los datos de ventas pueden tardar hasta 60 minutos en aparecer.', link: { label: 'Ver estado de sincronización', href: '#sync' } },
  { id: 'keys', kind: 'consejo', title: 'Filtra más rápido con atajos', body: 'Pulsa / para buscar y F para abrir los filtros desde cualquier panel.' },
  { id: 'pg', kind: 'atencion', title: 'Tu conexión con PostgreSQL caduca en 3 días', body: 'Renuévala para que los paneles sigan actualizándose.', link: { label: 'Renovar conexión', href: '#renovar' } },
];
const icons: Record<Kind, string> = {
  info: 'M8 7.25V11M8 5h.01M14.25 8a6.25 6.25 0 11-12.5 0 6.25 6.25 0 0112.5 0z',
  consejo: 'M8 1.75l1.5 4.25 4.25 1.5-4.25 1.5L8 13.25 6.5 9 2.25 7.5 6.5 6z',
  atencion: 'M8 2l6.25 11H1.75zM8 6.75v3M8 11.75h.01',
};
const hidden = ref<string[]>([]);
const visible = computed(() => tips.filter((t) => !hidden.value.includes(t.id)));

async function focusId(id: string) {
  await nextTick();
  document.getElementById(id)?.focus();
}
function dismiss(id: string) {
  const i = visible.value.findIndex((t) => t.id === id);
  const near = visible.value[i + 1] ?? visible.value[i - 1];
  hidden.value.push(id);
  focusId(near ? `x-${near.id}` : 'back');
}
function restore() {
  hidden.value = [];
  focusId(`x-${tips[0].id}`);
}
</script>

<template>
  <div class="root">
    <div class="tips">
      <aside v-for="t in visible" :key="t.id" class="tip" :class="t.kind" role="note">
        <span class="ico">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons[t.kind]" /></svg>
        </span>
        <div>
          <strong>{{ t.title }}</strong>
          <p>{{ t.body }}</p>
          <a v-if="t.link" :href="t.link.href">{{ t.link.label }}</a>
        </div>
        <button :id="`x-${t.id}`" type="button" class="x" :aria-label="`Descartar consejo: ${t.title}`" @click="dismiss(t.id)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" /></svg>
        </button>
      </aside>
    </div>
    <div v-if="!visible.length" class="none" role="status">
      <p>Has descartado todos los consejos.</p>
      <button id="back" type="button" class="btn" @click="restore">Restaurar consejos</button>
    </div>
  </div>
</template>

<style scoped>
.root{color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.tips{display:grid;gap:12px;max-width:600px;margin:0 auto}
.tip{--c:var(--info);--s:var(--info-soft);position:relative;display:flex;gap:12px;align-items:flex-start;padding:14px 12px 14px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.tip.consejo{--c:var(--ok);--s:var(--ok-soft)}
.tip.atencion{--c:var(--warn);--s:var(--warn-soft)}
.tip::before{content:"";position:absolute;top:-1px;left:8px;right:8px;height:1px;background:linear-gradient(90deg,var(--c),transparent 70%)}
.ico{display:grid;place-items:center;flex:none;width:32px;height:32px;background:var(--s);color:var(--c);border:1px solid var(--c);border-radius:var(--radius)}
.tip div{flex:1;min-width:0}
.tip strong{display:block;font-weight:600}
.tip p{margin:2px 0 0;color:var(--muted)}
.tip a{display:inline-block;margin-top:6px;color:var(--accent);font-weight:500;text-decoration:none;border-radius:4px}
.tip a:hover{text-decoration:underline}
.x{display:grid;place-items:center;flex:none;width:28px;height:28px;padding:0;background:none;border:0;border-radius:var(--radius);color:var(--muted);cursor:pointer;transition:background .14s}
.x:hover{color:var(--text);background:var(--accent-soft)}
.none{max-width:600px;margin:0 auto;padding:16px;text-align:center;color:var(--muted);border:1px dashed var(--border);border-radius:var(--radius)}
.none p{margin:0 0 8px}
.btn{height:36px;padding:0 16px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:500;cursor:pointer}
.btn:hover{background:var(--accent-soft)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
