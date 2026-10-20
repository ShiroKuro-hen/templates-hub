<script setup lang="ts">
import { ref } from 'vue';

type Mensaje = { y: number; x1: number; x2: number; etiqueta: string; descripcion: string; respuesta?: boolean };

const ACTORES = [
  { x: 50, lineas: ['Usuario'] },
  { x: 150, lineas: ['App'] },
  { x: 250, lineas: ['API'] },
  { x: 350, lineas: ['Base de', 'datos'] },
];
const MENSAJES: Mensaje[] = [
  { y: 100, x1: 50, x2: 150, etiqueta: 'Credenciales', descripcion: 'El usuario escribe su correo y contraseña, y pulsa Entrar.' },
  { y: 150, x1: 150, x2: 250, etiqueta: 'POST /login', descripcion: 'La app envía las credenciales por HTTPS al endpoint de inicio de sesión.' },
  { y: 200, x1: 250, x2: 350, etiqueta: 'Consulta', descripcion: 'La API busca al usuario por correo en la base de datos.' },
  { y: 250, x1: 350, x2: 250, etiqueta: 'Hash', descripcion: 'La base de datos devuelve el hash guardado, no la contraseña.', respuesta: true },
  { y: 300, x1: 250, x2: 150, etiqueta: '200 + token', descripcion: 'La API compara el hash con bcrypt y responde con un token de sesión.', respuesta: true },
  { y: 350, x1: 150, x2: 50, etiqueta: 'Panel', descripcion: 'La app guarda el token y muestra el panel de inicio.', respuesta: true },
];
const PISTA = 'Pasa el foco sobre un mensaje para ver su descripción.';

const activo = ref<number | null>(null);
const linea = (lineas: string[], i: number) => 32 + (i - (lineas.length - 1) / 2) * 16;
</script>

<template>
  <figure class="card">
    <h1>Inicio de sesión</h1>
    <svg viewBox="0 0 400 450" role="img" aria-labelledby="seq-t seq-d" @pointerleave="activo = null">
      <title id="seq-t">Secuencia de inicio de sesión</title>
      <desc id="seq-d">El usuario envía sus credenciales a la app, que llama a la API. La API consulta la base de datos, valida la contraseña y devuelve un token que permite mostrar el panel.</desc>
      <defs>
        <marker id="ah" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="head" d="M0 0L9 5L0 10z" /></marker>
        <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="head hot" d="M0 0L9 5L0 10z" /></marker>
      </defs>
      <line v-for="a in ACTORES" :key="a.x" class="life" :x1="a.x" :y1="54" :x2="a.x" :y2="388" />
      <g v-for="a in ACTORES" :key="`caja-${a.x}`">
        <rect class="box" :x="a.x - 40" :y="10" :width="80" :height="44" :rx="6" />
        <text v-for="(t, i) in a.lineas" :key="t" :x="a.x" :y="linea(a.lineas, i)">{{ t }}</text>
      </g>
      <g v-for="(m, i) in MENSAJES" :key="m.etiqueta" :class="activo === i ? 'msg on' : 'msg'" tabindex="0" role="group"
         :aria-label="`${m.etiqueta}: ${m.descripcion}`"
         @pointerover="activo = i" @focus="activo = i" @blur="activo = null">
        <line :class="m.respuesta ? 'arrow reply' : 'arrow'" :x1="m.x1" :y1="m.y" :x2="m.x2" :y2="m.y" />
        <text :x="(m.x1 + m.x2) / 2" :y="m.y - 8">{{ m.etiqueta }}</text>
      </g>
      <rect class="note" x="10" y="400" width="380" height="40" rx="6" />
      <text x="200" y="420">Nota: la contraseña nunca se guarda en claro.</text>
    </svg>
    <p class="cap" aria-live="polite">{{ activo === null ? PISTA : MENSAJES[activo].descripcion }}</p>
  </figure>
</template>

<style scoped>
.card{max-width:440px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0 0 12px;font-size:16px;font-weight:600}
svg{display:block;width:100%;height:auto}
text{font:13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;fill:var(--text);text-anchor:middle;dominant-baseline:middle}
.box{fill:var(--surface);stroke:var(--border);stroke-width:1.5}
.life{stroke:var(--border);stroke-width:1.5;stroke-dasharray:4 4}
.msg{outline:none}
.msg text{font-size:12px;fill:var(--muted)}
.arrow{stroke:var(--text);stroke-width:1.5;marker-end:url(#ah);transition:stroke .14s}
.reply{stroke:var(--muted);stroke-dasharray:5 4}
.head{fill:var(--text)}
.head.hot{fill:var(--accent)}
.msg.on .arrow{stroke:var(--accent);stroke-width:2;marker-end:url(#ah-hot)}
.msg.on text{fill:var(--accent);font-weight:600}
.note{fill:var(--warn-soft);stroke:var(--warn);stroke-width:1.5}
.cap{min-height:3em;margin:12px 0 0;padding-top:10px;border-top:1px solid var(--border);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
