<script setup lang="ts">
type Tipo = 'nota' | 'imp' | 'warn' | 'err';

const tipos: Record<Tipo, { titulo: string; d: string }> = {
  nota: { titulo: 'Nota', d: 'M2 8a6 6 0 1 0 12 0A6 6 0 1 0 2 8M8 7.5V11M8 5v.01' },
  imp: { titulo: 'Importante', d: 'M8 3.5l1.2 2.5 2.7.4-2 1.9.5 2.7L8 9.7l-2.4 1.3.5-2.7-2-1.9 2.7-.4z' },
  warn: { titulo: 'Advertencia', d: 'M8 2 14.5 13h-13zM8 6.5v3M8 11.5v.01' },
  err: { titulo: 'Peligro', d: 'M5 2h6l3 3v6l-3 3H5l-3-3V5zM6 6l4 4M10 6l-4 4' },
};
const avisos: { tipo: Tipo; texto: string }[] = [
  { tipo: 'nota', texto: 'Los cambios en los ajustes se aplican al guardarlos. No hace falta reiniciar los servicios.' },
  { tipo: 'imp', texto: 'Solo las personas con rol Administrador pueden eliminar un proyecto.' },
  { tipo: 'warn', texto: 'Al eliminar un proyecto se borran sus variables. Exporta una copia antes de continuar.' },
  { tipo: 'err', texto: 'Esta acción no se puede deshacer: se borran todos los datos y las copias de seguridad. Para confirmar, usa el comando de eliminación con --confirmar.' },
];
</script>

<template>
  <article>
    <h1>Eliminar un proyecto</h1>
    <p class="intro">Antes de borrar un proyecto, revisa estos avisos. Cada uno indica qué pasa y qué debes hacer.</p>
    <aside v-for="(a, i) in avisos" :key="i" class="co" :class="a.tipo === 'nota' ? '' : a.tipo" role="note" :aria-labelledby="`c${i}`">
      <svg class="ic" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="tipos[a.tipo].d" /></svg>
      <p :id="`c${i}`" class="t">{{ tipos[a.tipo].titulo }}</p>
      <div><p>{{ a.texto }}</p></div>
    </aside>
  </article>
</template>

<style scoped>
article{max-width:640px;margin:0 auto;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0 0 8px;font-size:24px;line-height:1.2}
.intro{margin:0 0 16px;color:var(--muted)}
.co{--c:var(--info);--s:var(--info-soft);display:grid;grid-template-columns:auto 1fr;gap:4px 10px;margin:0 0 12px;padding:12px 16px;background:var(--s);border:1px solid var(--c);border-radius:var(--radius)}
.co.imp{--c:var(--accent);--s:var(--accent-soft)}
.co.warn{--c:var(--warn);--s:var(--warn-soft)}
.co.err{--c:var(--err);--s:var(--err-soft)}
.ic{display:grid;place-items:center;width:22px;height:22px;color:var(--c)}
.imp .ic{color:#fff;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.t{align-self:center;margin:0;font-weight:600}
.co div{grid-column:2}
.co div>p{margin:0}
@media (max-width:420px){article{padding:16px}}
/* Tokens: ver pestaña HTML + CSS */
</style>
