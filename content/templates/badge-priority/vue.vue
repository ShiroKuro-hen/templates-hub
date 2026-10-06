<script setup lang="ts">
type Priority = 'alta' | 'media' | 'baja';
type TagColor = 'accent' | 'ok' | 'info' | 'warn';
type Task = { title: string; priority: Priority; tags: { label: string; color: TagColor }[] };

const label: Record<Priority, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };
withDefaults(defineProps<{ tasks?: Task[] }>(), {
  tasks: () => [
    { title: 'Corregir pago duplicado en el checkout', priority: 'alta', tags: [{ label: 'Backend', color: 'accent' }] },
    { title: 'Revisar textos del onboarding', priority: 'media', tags: [{ label: 'Diseño', color: 'ok' }, { label: 'Documentación', color: 'info' }] },
    { title: 'Actualizar dependencias de pruebas', priority: 'baja', tags: [{ label: 'Infraestructura', color: 'warn' }] },
  ],
});
</script>

<template>
  <section class="card" aria-labelledby="sprint">
    <h2 id="sprint">Tareas del sprint</h2>
    <ul>
      <li v-for="t in tasks" :key="t.title" class="item">
        <div>
          <span class="title">{{ t.title }}</span>
          <ul class="tags" aria-label="Etiquetas">
            <li v-for="g in t.tags" :key="g.label" class="tag" :style="{ '--c': `var(--${g.color})` }">{{ g.label }}</li>
          </ul>
        </div>
        <span class="pri" :class="t.priority">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect y="8" width="3" height="4" rx=".5" /><rect x="4.5" y="5" width="3" height="7" rx=".5" /><rect x="9" y="2" width="3" height="10" rx=".5" />
          </svg>
          <span class="sr">Prioridad </span>{{ label[t.priority] }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.card{max-width:680px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card h2{margin:0;padding:14px 16px;font-size:16px;border-bottom:1px solid var(--border)}
ul{list-style:none;margin:0;padding:0}
.item{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;padding:12px 16px;border-bottom:1px solid var(--border)}
.item:last-child{border-bottom:0}
.title{font-weight:500}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.tag{display:inline-flex;align-items:center;gap:6px;padding:1px 8px;font-size:12px;color:var(--muted);border:1px solid var(--border);border-radius:999px}
.tag::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--c)}
.pri{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;font-size:12px;font-weight:600;color:var(--text);background:var(--soft);border:1px solid color-mix(in srgb,var(--c) 35%,transparent);border-radius:999px}
.pri svg{color:var(--c)}
.pri.alta{--c:var(--err);--soft:var(--err-soft)}
.pri.media{--c:var(--warn);--soft:var(--warn-soft)}
.pri.baja{--c:var(--info);--soft:var(--info-soft)}
.pri.media rect:nth-child(3),.pri.baja rect:nth-child(n+2){opacity:.25}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* Tokens: ver pestaña HTML + CSS */
</style>
