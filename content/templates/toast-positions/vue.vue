<script setup lang="ts">
import { ref } from 'vue';

type Posicion = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type Aviso = { id: number; tipo: 'ok' | 'info' | 'warn' | 'err'; icono: string; titulo: string; texto: string };

const props = withDefaults(defineProps<{ duracion?: number }>(), { duracion: 5000 });
const posiciones: [Posicion, string][] = [
  ['top-left', 'Arriba izquierda'], ['top-center', 'Arriba centro'], ['top-right', 'Arriba derecha'],
  ['bottom-left', 'Abajo izquierda'], ['bottom-center', 'Abajo centro'], ['bottom-right', 'Abajo derecha'],
];
const mensajes: Omit<Aviso, 'id'>[] = [
  { tipo: 'ok', icono: '✓', titulo: 'Cambios guardados', texto: 'Se actualizó el proyecto Atlas.' },
  { tipo: 'info', icono: 'i', titulo: 'Nueva versión disponible', texto: 'Recarga la página para ver las mejoras.' },
  { tipo: 'warn', icono: '!', titulo: 'Almacenamiento al 90 %', texto: 'Libera espacio o amplía tu plan.' },
  { tipo: 'err', icono: '×', titulo: 'No se pudo sincronizar', texto: 'Revisa tu conexión y vuelve a intentarlo.' },
];
const pos = ref<Posicion>('bottom-right');
const avisos = ref<Aviso[]>([]);
let n = 0;

const cerrar = (id: number) => { avisos.value = avisos.value.filter((a) => a.id !== id); };
function mostrar() {
  const id = ++n;
  avisos.value.push({ id, ...mensajes[id % mensajes.length] });
  setTimeout(() => cerrar(id), props.duracion);
}
</script>

<template>
  <section class="card" aria-labelledby="tp-titulo">
    <div class="bar">
      <fieldset>
        <legend id="tp-titulo">Posición de los avisos</legend>
        <label v-for="[v, label] in posiciones" :key="v">
          <input v-model="pos" type="radio" name="pos" :value="v" @change="mostrar">{{ label }}
        </label>
      </fieldset>
      <button class="go" type="button" @click="mostrar">Mostrar aviso</button>
    </div>
    <div class="stage">
      <p>Vista previa de la pantalla</p>
      <div class="toasts" :data-pos="pos" role="region" aria-label="Notificaciones" aria-live="polite">
        <div v-for="a in avisos" :key="a.id" class="toast" :class="a.tipo">
          <span class="ic" aria-hidden="true">{{ a.icono }}</span>
          <div><b>{{ a.titulo }}</b><span class="m">{{ a.texto }}</span></div>
          <button class="x" type="button" aria-label="Cerrar aviso" @click="cerrar(a.id)">×</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:620px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:14px 20px;border-bottom:1px solid var(--border)}
fieldset{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;flex:1;min-width:240px;margin:0;padding:0;border:0}
legend{padding:0;margin-bottom:6px;font-weight:600}
fieldset label{display:block;padding:6px 4px;border:1px solid var(--border);border-radius:var(--radius);text-align:center;font-size:12px;cursor:pointer;transition:border-color .14s,background .14s}
fieldset label:hover{border-color:var(--accent)}
fieldset label:has(:checked){border-color:var(--accent);background:var(--accent-soft);font-weight:600}
fieldset label:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
fieldset input{position:absolute;opacity:0;pointer-events:none}
.go{padding:8px 16px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:600;cursor:pointer}
.go:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.stage{position:relative;height:300px;margin:16px;overflow:hidden;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.stage p{margin:0;padding:12px;color:var(--muted)}
.toasts{position:absolute;display:flex;flex-direction:column;gap:8px;width:min(250px,calc(100% - 24px));margin:12px;pointer-events:none}
[data-pos^=top]{top:0}
[data-pos^=bottom]{bottom:0;flex-direction:column-reverse}
[data-pos$=left]{left:0}
[data-pos$=right]{right:0}
[data-pos$=center]{left:0;right:0;margin-inline:auto}
.toast{--k:var(--info);--ks:var(--info-soft);position:relative;display:flex;gap:10px;padding:10px 12px;overflow:hidden;pointer-events:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);animation:in .14s ease-out}
.toast.ok{--k:var(--ok);--ks:var(--ok-soft)}
.toast.warn{--k:var(--warn);--ks:var(--warn-soft)}
.toast.err{--k:var(--err);--ks:var(--err-soft)}
.ic{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:50%;background:var(--ks);color:var(--k);font-size:12px;font-weight:700}
.toast div{flex:1;min-width:0}
.toast b{display:block}
.toast .m{color:var(--muted);font-size:13px}
.x{align-self:flex-start;width:24px;height:24px;padding:0;border:0;border-radius:4px;background:none;color:var(--muted);font-size:18px;line-height:1;cursor:pointer}
.x:hover{color:var(--text)}
.x:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.toast::after{content:"";position:absolute;left:0;bottom:0;height:2px;width:100%;background:linear-gradient(135deg,#22d3ee,#2f5bff);transform-origin:left;animation:t 5s linear forwards}
@keyframes in{from{opacity:0;transform:translateY(6px)}}
@keyframes t{to{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){.toast,.toast::after{animation:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
