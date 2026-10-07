<script setup lang="ts">
type Doc = { id: string; titulo: string; editado: string; lineas: number[] };

withDefaults(defineProps<{ docs?: Doc[] }>(), {
  docs: () => [
    { id: 'q3', titulo: 'Informe trimestral Q3', editado: 'Editado hace 2 horas por Marta Ruiz', lineas: [55, 90, 78, 84, 40] },
    { id: 'plan', titulo: 'Plan de lanzamiento', editado: 'Editado ayer por Luis Gómez', lineas: [70, 86, 62, 90, 52] },
    { id: 'pres', titulo: 'Presupuesto 2026', editado: 'Editado hace 3 días por Carlos Díaz', lineas: [45, 80, 92, 66, 74] },
  ],
});
const emit = defineEmits<{ (e: 'abrir' | 'compartir' | 'archivar', d: Doc): void }>();
</script>

<template>
  <div class="grid">
    <article v-for="d in docs" :key="d.id" class="card">
      <div class="thumb">
        <div class="sk" aria-hidden="true"><i v-for="(w, i) in d.lineas" :key="i" :style="{ '--w': w }" /></div>
        <div class="acts" role="group" :aria-label="`Acciones de ${d.titulo}`">
          <button type="button" class="btn pri" @click="emit('abrir', d)">Abrir</button>
          <button type="button" class="btn" @click="emit('compartir', d)">Compartir</button>
          <button type="button" class="btn" @click="emit('archivar', d)">Archivar</button>
        </div>
      </div>
      <div class="body"><h2>{{ d.titulo }}</h2><p class="meta">{{ d.editado }}</p></div>
    </article>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:820px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s,box-shadow .14s}
.card:hover,.card:focus-within{border-color:var(--accent);box-shadow:var(--shadow)}
.thumb{position:relative;height:128px;background:var(--bg);border-bottom:1px solid var(--border)}
.sk{display:grid;align-content:center;gap:8px;height:100%;padding:0 20px;box-sizing:border-box}
.sk i{display:block;height:6px;width:calc(var(--w) * 1%);border-radius:999px;background:var(--border)}
.sk i:first-child{height:10px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.acts{position:absolute;right:10px;bottom:10px;left:10px;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;opacity:0;transform:translateY(4px);transition:opacity .14s,transform .14s}
.card:hover .acts,.card:focus-within .acts{opacity:1;transform:none}
@media (hover:none){.acts{opacity:1;transform:none}}
.btn{font:inherit;font-size:13px;font-weight:600;padding:3px 10px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn.pri{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.body{padding:12px 16px 14px}
h2{margin:0;font-size:15px;line-height:1.35}
.meta{margin:2px 0 0;color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
