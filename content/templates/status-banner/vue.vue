<script setup lang="ts">
import { useId } from 'vue';

type State = 'ok' | 'degraded' | 'down';
withDefaults(
  defineProps<{ state: State; title: string; detail: string; updated: string; href: string; linkText?: string }>(),
  { linkText: 'Ver incidente' },
);
const LABEL: Record<State, string> = { ok: 'Operativo', degraded: 'Degradado', down: 'Caído' };
const id = useId(); // Vue 3.5+
</script>

<template>
  <section class="banner" :data-state="state" :aria-labelledby="id" :role="state === 'down' ? 'alert' : undefined">
    <div class="body">
      <span class="state"><span class="dot" aria-hidden="true" />{{ LABEL[state] }}</span>
      <strong :id="id">{{ title }}</strong>
      <p>{{ detail }}</p>
    </div>
    <div class="meta">
      <span>Actualizado a las {{ updated }}</span>
      <a :href="href">{{ linkText }}</a>
    </div>
  </section>
</template>

<style scoped>
.banner{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.banner[data-state=ok]{--c:var(--ok);--soft:var(--ok-soft)}
.banner[data-state=degraded]{--c:var(--warn);--soft:var(--warn-soft)}
.banner[data-state=down]{--c:var(--err);--soft:var(--err-soft)}
.body{flex:1 1 260px;min-width:0}
.state{display:inline-flex;align-items:center;gap:8px;padding:2px 10px;border-radius:999px;background:var(--soft);font-size:12px;font-weight:600}
.dot{position:relative;width:8px;height:8px;border-radius:999px;background:var(--c)}
.dot::after{content:"";position:absolute;inset:-3px;border-radius:inherit;border:1px solid var(--c);animation:ping 1.8s ease-out infinite}
@keyframes ping{from{transform:scale(.6);opacity:1}to{transform:scale(1.6);opacity:0}}
strong{display:block;margin-top:6px;font-size:15px;font-weight:600}
p{margin:2px 0 0;color:var(--muted)}
.meta{display:flex;align-items:center;gap:16px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.meta a{color:var(--accent);font-size:14px;font-weight:500;text-decoration:none;border-radius:4px}
.meta a:hover{text-decoration:underline}
.meta a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.dot::after{animation:none;opacity:0}}
/* Tokens: ver pestaña HTML + CSS */
</style>
