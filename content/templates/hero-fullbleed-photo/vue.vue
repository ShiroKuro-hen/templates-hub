<script setup lang="ts">
import { ref } from 'vue';

const DESTINOS = ['Islas griegas', 'Alpes', 'Costa'];
const FECHAS = ['Fin de semana', 'Esta semana', 'Este mes'];
const VIAJEROS = ['1 viajero', '2 viajeros', '3 viajeros', '4 viajeros', '5 viajeros', '6 viajeros'];

const destino = ref('');
const fechas = ref(FECHAS[0]);
const viajeros = ref(VIAJEROS[1]);
const error = ref(false);
const resumen = ref('');
const input = ref<HTMLInputElement | null>(null);

function buscar() {
  const q = destino.value.trim();
  error.value = !q;
  if (!q) input.value?.focus();
  resumen.value = q ? `Búsqueda: ${q} · ${fechas.value} · ${viajeros.value}.` : '';
}

function elegir(d: string) {
  destino.value = d;
  error.value = false;
}
</script>

<template>
  <section class="hero" aria-labelledby="h">
    <img class="photo" src="/stock/isla-blanca.webp" alt="Pueblo blanco griego junto al mar" width="800" height="533" fetchpriority="high" />
    <div class="scrim" aria-hidden="true" />
    <div class="content">
      <p class="eyebrow">Escapadas de temporada</p>
      <h1 id="h">Tu próxima escapada, a un clic</h1>
      <p class="sub">Compara hoteles, vuelos y casas rurales en un solo lugar y reserva con el precio final visible.</p>
      <form class="search" novalidate @submit.prevent="buscar">
        <div class="field">
          <label for="dest">Destino</label>
          <input id="dest" ref="input" v-model="destino" name="destino" type="text" autocomplete="off" placeholder="¿A dónde vas?"
            aria-describedby="dest-err" :aria-invalid="error" @input="error = false" />
          <span class="err" id="dest-err" :hidden="!error">Escribe un destino para buscar.</span>
        </div>
        <div class="field">
          <label for="when">Fechas</label>
          <select id="when" v-model="fechas" name="fechas">
            <option v-for="f in FECHAS" :key="f">{{ f }}</option>
          </select>
        </div>
        <div class="field">
          <label for="guests">Viajeros</label>
          <select id="guests" v-model="viajeros" name="viajeros">
            <option v-for="v in VIAJEROS" :key="v">{{ v }}</option>
          </select>
        </div>
        <button type="submit" class="go">Buscar</button>
      </form>
      <div class="chips" role="group" aria-label="Destinos sugeridos">
        <button v-for="d in DESTINOS" :key="d" type="button" @click="elegir(d)">{{ d }}</button>
      </div>
      <p class="summary" aria-live="polite">{{ resumen }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero{position:relative;isolation:isolate;display:flex;align-items:flex-end;min-height:480px;overflow:hidden;border-radius:var(--radius);color:rgba(255,255,255,.97)}
.photo,.scrim{position:absolute;inset:0;z-index:-2;width:100%;height:100%}
.photo{object-fit:cover}
.scrim{z-index:-1;background:linear-gradient(180deg,rgba(6,11,22,.45),rgba(6,11,22,.72) 45%,rgba(6,11,22,.92))}
.content{width:100%;padding:40px 16px 20px}
.eyebrow{display:inline-block;margin:0 0 16px;padding:4px 12px;border:1px solid rgba(255,255,255,.5);border-radius:999px;font-size:13px;font-weight:500}
h1{margin:0 0 12px;max-width:18ch;font-size:clamp(2rem,5.5vw,3.5rem);font-weight:700;line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
.sub{margin:0 0 22px;max-width:50ch;font-size:1.05rem;color:rgba(255,255,255,.9)}
.search{display:grid;gap:10px;padding:12px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.field{display:grid;gap:4px;min-width:0}
.field label{font-size:12px;font-weight:600;color:var(--muted)}
.field input,.field select{width:100%;min-width:0;padding:10px 12px;font:inherit;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.field input[aria-invalid=true]{border-color:var(--err)}
.err{font-size:12px;color:var(--err)}
.go{padding:11px 22px;font:600 1rem system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer;transition:filter .14s}
.go:hover{filter:brightness(1.08)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0}
.chips button{font:600 13px system-ui,-apple-system,"Segoe UI",sans-serif;padding:6px 14px;color:rgba(255,255,255,.97);background:rgba(6,11,22,.35);border:1px solid rgba(255,255,255,.5);border-radius:999px;cursor:pointer;transition:background .14s}
.chips button:hover{background:rgba(255,255,255,.2)}
.chips button:focus-visible{outline-color:rgba(255,255,255,.95)}
.summary{min-height:1.5em;margin:12px 0 0;font-weight:500}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(min-width:720px){
  .hero{min-height:540px}
  .content{padding:56px 40px 40px}
  .search{grid-template-columns:2fr 1fr 1fr auto;align-items:end}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
