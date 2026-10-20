<script setup lang="ts">
import { ref } from 'vue';

type Kind = 'ok' | 'warn' | 'err';
type Toast = { id: number; kind: Kind; leaving: boolean };

const MAX = 3;
const COPY: Record<Kind, { title: string; text: string; role: 'status' | 'alert'; icon: string }> = {
  ok: { title: 'Cambios guardados', text: 'Tu perfil se actualizó correctamente.', role: 'status', icon: '✓' },
  warn: { title: 'Espacio casi lleno', text: 'Quedan 500 MB de 5 GB disponibles.', role: 'status', icon: '!' },
  err: { title: 'No se pudo guardar', text: 'Revisa tu conexión e inténtalo de nuevo.', role: 'alert', icon: '✕' },
};
const TRIGGERS: [Kind, string][] = [['ok', 'Éxito'], ['warn', 'Aviso'], ['err', 'Error']];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const toasts = ref<Toast[]>([]);
const group = ref<HTMLDivElement>();
let seq = 0;

function expire(ids: number[]) {
  const hit = (t: Toast) => ids.includes(t.id);
  if (calm) toasts.value = toasts.value.filter((t) => !hit(t));
  else toasts.value.filter(hit).forEach((t) => (t.leaving = true));
}

function drop(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function show(kind: Kind) {
  const live = toasts.value.filter((t) => !t.leaving);
  expire(live.slice(0, Math.max(0, live.length + 1 - MAX)).map((t) => t.id));
  toasts.value.push({ id: seq++, kind, leaving: false });
}

function closeBy(id: number) {
  group.value?.querySelector('button')?.focus();
  expire([id]);
}

function collapsed(e: TransitionEvent, id: number) {
  if (e.propertyName === 'grid-template-rows') drop(id);
}
</script>

<template>
  <main class="stage">
    <h1>Notificaciones</h1>
    <p class="lead">Dispara un aviso para ver cómo entra, se apila y se retira.</p>
    <div ref="group" class="triggers" role="group" aria-label="Disparar notificación">
      <button v-for="[kind, label] in TRIGGERS" :key="kind" type="button" class="btn" @click="show(kind)">{{ label }}</button>
    </div>
    <section class="stack" aria-label="Notificaciones">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="wrap"
        :class="{ leaving: t.leaving }"
        @transitionend="collapsed($event, t.id)"
      >
        <div class="inner">
          <div class="toast" :class="t.kind" :role="COPY[t.kind].role">
            <i aria-hidden="true">{{ COPY[t.kind].icon }}</i>
            <div class="msg"><b>{{ COPY[t.kind].title }}</b><span>{{ COPY[t.kind].text }}</span></div>
            <button type="button" class="x" :aria-label="`Cerrar: ${COPY[t.kind].title}`" @click="closeBy(t.id)">×</button>
            <span class="bar" aria-hidden="true" @animationend="expire([t.id])" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.stage { --dur:.25s; --ease:cubic-bezier(.2,.8,.2,1); --life:5s; max-width:560px; margin:0 auto; padding:20px; color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
h1 { margin:0 0 4px; font-size:1.25rem; letter-spacing:-.01em; }
.lead { margin:0 0 16px; color:var(--muted); }
.triggers { display:flex; flex-wrap:wrap; gap:8px; }
.btn { padding:8px 14px; font:inherit; font-weight:600; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; }
.btn:hover { border-color:var(--accent); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.stack { position:fixed; right:16px; bottom:16px; width:min(360px, calc(100vw - 32px)); display:flex; flex-direction:column; gap:8px; }
.wrap { display:grid; grid-template-rows:1fr; transition:grid-template-rows var(--dur) var(--ease); }
.wrap.leaving { grid-template-rows:0fr; }
.wrap.leaving .toast { opacity:0; transform:translateX(16px); }
.inner { min-height:0; overflow:hidden; }
.toast { --c:var(--info); position:relative; display:flex; align-items:flex-start; gap:12px; padding:12px 40px 14px 14px; overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); animation:enter var(--dur) var(--ease) backwards; transition:opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.toast.ok { --c:var(--ok); }
.toast.warn { --c:var(--warn); }
.toast.err { --c:var(--err); }
.toast i { flex:none; width:22px; height:22px; display:grid; place-items:center; border-radius:50%; background:var(--c); color:var(--accent-ink); font:600 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif; font-style:normal; }
.msg { flex:1; min-width:0; }
.msg b { display:block; font-weight:600; }
.msg span { color:var(--muted); font-size:13px; }
.x { position:absolute; top:8px; right:8px; width:28px; height:28px; font:inherit; font-size:18px; line-height:1; color:var(--muted); background:none; border:0; border-radius:var(--radius); cursor:pointer; }
.x:hover { background:var(--bg); color:var(--text); }
.bar { position:absolute; left:0; right:0; bottom:0; height:3px; background:var(--c); transform-origin:left; animation:drain var(--life) linear forwards; }
.toast:hover .bar, .toast:focus-within .bar { animation-play-state:paused; }
@keyframes enter { from { opacity:0; transform:translateX(16px); } }
@keyframes drain { from { transform:scaleX(1); } to { transform:scaleX(0); } }
@media (prefers-reduced-motion:reduce) { .toast { animation:none; transition:none; } .wrap { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
