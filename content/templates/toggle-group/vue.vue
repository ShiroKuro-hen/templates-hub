<script setup lang="ts">
import { computed, reactive } from 'vue';

type Feature = { id: string; titulo: string; descripcion: string; activo: boolean; plan?: string };

const features: Feature[] = [
  { id: 'autoguardado', titulo: 'Autoguardado', descripcion: 'Guarda tus cambios cada 30 segundos.', activo: true },
  { id: 'tiempo-real', titulo: 'Comentarios en tiempo real', descripcion: 'Muestra los comentarios del equipo sin recargar.', activo: true },
  { id: 'publica', titulo: 'Vista previa pública', descripcion: 'Cualquiera con el enlace puede ver el documento.', activo: false },
  { id: 'resumen', titulo: 'Resumen semanal', descripcion: 'Recibe los cambios de la semana cada lunes.', activo: true },
  { id: 'auditoria', titulo: 'Registro de auditoría', descripcion: 'Disponible al mejorar tu plan.', activo: false, plan: 'Plan Business' },
];
const on = reactive<Record<string, boolean>>(Object.fromEntries(features.map((f) => [f.id, f.activo])));
const disponibles = features.filter((f) => !f.plan);
const activas = computed(() => disponibles.filter((f) => on[f.id]).length);
</script>

<template>
  <div class="card" role="group" aria-labelledby="tg-titulo">
    <header>
      <h2 id="tg-titulo">Funciones del espacio</h2>
      <p class="sum" aria-live="polite"><b>{{ activas }}</b> de {{ disponibles.length }} activadas</p>
    </header>
    <div v-for="f in features" :key="f.id" class="row">
      <div>
        <label :for="`tg-${f.id}`">{{ f.titulo }}<span v-if="f.plan" class="badge">{{ f.plan }}</span></label>
        <p :id="`tg-${f.id}-d`">{{ f.descripcion }}</p>
      </div>
      <input :id="`tg-${f.id}`" v-model="on[f.id]" type="checkbox" role="switch" :disabled="!!f.plan" :aria-describedby="`tg-${f.id}-d`">
      <span class="st" aria-hidden="true"></span>
    </div>
  </div>
</template>

<style scoped>
.card{max-width:560px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px;padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px;font-weight:600}
.sum{margin:0;color:var(--muted);font-variant-numeric:tabular-nums}
.row{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border)}
.row:last-child{border-bottom:0}
.row div{flex:1;min-width:0}
.row label{font-weight:600}
.row p{margin:2px 0 0;color:var(--muted)}
.badge{margin-left:8px;padding:1px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
.st{order:1;min-width:6em;text-align:right;color:var(--muted);font-size:13px}
.st::after{content:"Desactivado"}
input:checked+.st{color:var(--text)}
input:checked+.st::after{content:"Activado"}
input:disabled+.st::after{content:"No disponible"}
input[role=switch]{order:2;appearance:none;position:relative;flex:none;width:40px;height:24px;margin:0;border:1px solid var(--border);border-radius:999px;background:var(--bg);cursor:pointer;transition:background .14s,border-color .14s}
input[role=switch]::before{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:var(--muted);transition:transform .14s,background .14s}
input[role=switch]:checked{border-color:transparent;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
input[role=switch]:checked::before{transform:translateX(16px);background:var(--accent-ink)}
input[role=switch]:disabled{opacity:.5;cursor:not-allowed}
input[role=switch]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:420px){.st{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
