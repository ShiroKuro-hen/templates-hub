<script setup lang="ts">
import { ref } from 'vue';

type Accion = { id: string; titulo: string; detalle: string; mensaje: string; icono: string };

defineProps<{ proyecto?: string }>();
const acciones: Accion[] = [
  { id: 'enlace', titulo: 'Copiar enlace', detalle: 'Cualquiera con el enlace puede ver', mensaje: 'Enlace copiado al portapapeles.',
    icono: 'M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1' },
  { id: 'correo', titulo: 'Enviar por correo', detalle: 'Invita a personas concretas', mensaje: 'Invitación enviada por correo.',
    icono: 'M3 5h14v10H3zM3 6l7 5 7-5' },
  { id: 'pdf', titulo: 'Exportar a PDF', detalle: 'Descarga una copia estática', mensaje: 'Exportación a PDF iniciada.',
    icono: 'M10 3v10m0 0-3.5-3.5M10 13l3.5-3.5M4 16h12' },
];
const hoja = ref<HTMLDialogElement | null>(null);
const mensaje = ref('');
const elegir = (a: Accion) => { mensaje.value = a.mensaje; hoja.value?.close(); };
</script>

<template>
  <div class="card">
    <h1>{{ proyecto ?? 'Proyecto Atlas' }}</h1>
    <p>Última edición hoy a las 10:42 por Ana Pérez.</p>
    <button class="btn main" type="button" @click="hoja?.showModal()">Compartir proyecto</button>
    <p id="msg" role="status">{{ mensaje }}</p>
  </div>
  <dialog ref="hoja" aria-labelledby="bs-titulo" @click="$event.target === hoja && hoja?.close()">
    <button class="grab" type="button" aria-label="Cerrar hoja" @click="hoja?.close()"><i></i></button>
    <h2 id="bs-titulo">Compartir {{ proyecto ?? 'Proyecto Atlas' }}</h2>
    <ul>
      <li v-for="(a, i) in acciones" :key="a.id">
        <button class="act" type="button" :autofocus="i === 0" @click="elegir(a)">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path :d="a.icono" /></svg>
          <span>{{ a.titulo }}<small>{{ a.detalle }}</small></span>
        </button>
      </li>
    </ul>
    <div class="foot"><button class="btn" type="button" @click="hoja?.close()">Cancelar</button></div>
  </dialog>
</template>

<style scoped>
.card{max-width:420px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;font-weight:600}
.card p{margin:4px 0 16px;color:var(--muted)}
.btn{padding:8px 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;font-weight:600;cursor:pointer;transition:border-color .14s}
.btn.main{border-color:var(--accent);background:var(--accent);color:var(--accent-ink)}
.btn:hover{border-color:var(--accent)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
#msg{min-height:1.5em;margin:12px 0 0;color:var(--muted)}
dialog{position:fixed;inset:auto 0 0;margin:0 auto;box-sizing:border-box;width:100%;max-width:520px;max-height:85vh;padding:0;overflow:auto;border:1px solid var(--border);border-bottom:0;border-radius:var(--radius) var(--radius) 0 0;background:var(--surface);color:var(--text);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;
       transform:translateY(100%);transition:transform .16s ease-out,overlay .16s allow-discrete,display .16s allow-discrete}
dialog[open]{transform:none}
@starting-style{dialog[open]{transform:translateY(100%)}}
dialog::backdrop{background:rgba(14,23,38,.5);opacity:0;transition:opacity .16s,overlay .16s allow-discrete,display .16s allow-discrete}
dialog[open]::backdrop{opacity:1}
@starting-style{dialog[open]::backdrop{opacity:0}}
.grab{display:block;width:100%;padding:10px 0 6px;border:0;background:none;cursor:pointer}
.grab i{display:block;width:40px;height:4px;margin:0 auto;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
dialog h2{margin:0;padding:4px 20px 12px;font-size:16px;font-weight:600}
ul{margin:0;padding:0 8px;list-style:none}
.act{display:flex;align-items:center;gap:12px;width:100%;padding:12px;border:0;border-radius:var(--radius);background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer;transition:background .14s}
.act:hover{background:var(--accent-soft)}
.act svg{flex:none;width:20px;height:20px;fill:none;stroke:var(--accent);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.act span{flex:1}
.act small{display:block;color:var(--muted)}
.foot{padding:8px 20px 20px}
.foot .btn{width:100%}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
