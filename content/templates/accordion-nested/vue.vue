<script setup lang="ts">
import { computed, reactive } from 'vue';

type Pregunta = { id: string; q: string; a: string };
type Seccion = { id: string; titulo: string; preguntas: Pregunta[] };

const secciones: Seccion[] = [
  { id: 'cuenta', titulo: 'Cuenta y acceso', preguntas: [
    { id: 'pass', q: 'Cómo restablezco mi contraseña', a: 'Elige "¿Olvidaste tu contraseña?" y sigue el enlace del correo. Caduca en 30 minutos.' },
    { id: '2fa', q: 'Cómo activo la verificación en dos pasos', a: 'En Seguridad, selecciona "Activar" y escanea el código QR con tu app de autenticación.' },
    { id: 'invitar', q: 'Cómo invito a mi equipo', a: 'En Miembros, escribe los correos y asigna un rol. Cada invitación vence a los 7 días.' },
  ] },
  { id: 'pagos', titulo: 'Facturación', preguntas: [
    { id: 'facturas', q: 'Dónde descargo mis facturas', a: 'En Facturación, abre el historial y elige el icono de descarga junto a cada pago.' },
    { id: 'tarjeta', q: 'Cómo cambio el método de pago', a: 'Edita la tarjeta en Facturación. El cambio se aplica desde el próximo ciclo.' },
  ] },
];
const ids = secciones.flatMap((s) => [s.id, ...s.preguntas.map((p) => p.id)]);
const abierto = reactive<Record<string, boolean>>({ cuenta: true });
const todo = computed(() => ids.every((id) => abierto[id]));
const alternar = () => { const v = !todo.value; ids.forEach((id) => (abierto[id] = v)); };
const marcar = (id: string, e: Event) => { abierto[id] = (e.target as HTMLDetailsElement).open; };
</script>

<template>
  <section class="card" aria-labelledby="an-titulo">
    <header>
      <h2 id="an-titulo">Centro de ayuda</h2>
      <button class="all" type="button" aria-controls="an-acc" @click="alternar">{{ todo ? 'Contraer todo' : 'Expandir todo' }}</button>
    </header>
    <div id="an-acc">
      <details v-for="s in secciones" :key="s.id" class="l1" :open="!!abierto[s.id]" @toggle="marcar(s.id, $event)">
        <summary :id="`an-${s.id}`">{{ s.titulo }} <span class="n">{{ s.preguntas.length }}</span></summary>
        <div class="sub" role="group" :aria-labelledby="`an-${s.id}`">
          <details v-for="p in s.preguntas" :key="p.id" class="l2" :open="!!abierto[p.id]" @toggle.stop="marcar(p.id, $event)">
            <summary>{{ p.q }}</summary>
            <p>{{ p.a }}</p>
          </details>
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:620px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;padding:14px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px;font-weight:600}
.all{padding:4px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:border-color .14s}
.all:hover{border-color:var(--accent)}
.all:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
summary{display:flex;align-items:center;gap:10px;cursor:pointer;list-style:none;transition:background .14s}
summary::-webkit-details-marker{display:none}
summary::after{content:"";order:3;flex:none;width:7px;height:7px;margin-left:auto;border:solid var(--muted);border-width:0 1px 1px 0;transform:rotate(45deg);transition:transform .14s}
details[open]>summary::after{transform:rotate(225deg)}
summary:hover{background:var(--accent-soft)}
.l1>summary{padding:14px 20px;font-weight:600}
.l1{border-bottom:1px solid var(--border)}
.l1:last-child{border-bottom:0}
.n{padding:0 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}
.sub{position:relative;margin:0 20px 12px 28px;padding-left:16px}
.sub::before{content:"";position:absolute;left:0;top:4px;bottom:4px;width:1px;background:linear-gradient(180deg,#22d3ee,#2f5bff)}
.l2{border-bottom:1px solid var(--border)}
.l2:last-child{border-bottom:0}
.l2>summary{padding:10px 8px;border-radius:var(--radius)}
.l2 p{margin:0;padding:0 8px 12px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
