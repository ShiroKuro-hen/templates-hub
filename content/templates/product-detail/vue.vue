<script setup lang="ts">
import { computed, ref } from 'vue';

const colores = [['k1', 'Grafito'], ['k2', 'Azul ultramar'], ['k3', 'Niebla']] as const;
const vistas = ['Vista frontal', 'Detalle del auricular', 'Vista en ángulo'];
const tabs = [
  ['Descripción', 'Diseñados para concentrarte donde estés. La cancelación adaptativa ajusta el nivel de ruido 48.000 veces por segundo y el modo de conversación pausa la música cuando hablas.'],
  ['Especificaciones', 'Batería de 40 horas, Bluetooth 5.4 y cable USB-C, 254 g, 6 micrófonos con reducción de viento.'],
  ['Envíos y devoluciones', 'Enviamos en 24 horas hábiles. Si no te convencen, devuélvelos en 30 días y te reembolsamos el total, sin preguntas.'],
];
const fmt = (n: number) => 'US$ ' + n.toFixed(2).replace('.', ',');
const vista = ref(0), color = ref(0), estuche = ref(false), fav = ref(false), msg = ref(''), tab = ref(0);
const total = computed(() => 249 + (estuche.value ? 29 : 0));
const btns = ref<HTMLButtonElement[]>([]);
function onKey(e: KeyboardEvent, i: number) {
  const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
  if (!k) return;
  tab.value = (i + k + tabs.length) % tabs.length;
  btns.value[tab.value]?.focus();
}
</script>

<template>
  <div class="page">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="hp" viewBox="0 0 200 200"><path d="M44 120V98a56 56 0 0 1 112 0v22" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" /><rect x="30" y="104" width="34" height="62" rx="15" fill="currentColor" /><rect x="136" y="104" width="34" height="62" rx="15" fill="currentColor" /></symbol></svg>
    <div :class="['pd', 'c' + (color + 1)]">
      <section :class="['gal', 'v' + (vista + 1)]" aria-label="Galería del producto">
        <div class="stage" role="img" aria-label="Auriculares Nimbo Air"><svg viewBox="0 0 200 200"><use href="#hp" /></svg></div>
        <div class="thumbs" role="radiogroup" aria-label="Vistas del producto">
          <label v-for="(v, i) in vistas" :key="v">
            <input v-model="vista" type="radio" name="g" :value="i" /><span class="sr">{{ v }}</span>
            <svg viewBox="0 0 200 200"><use href="#hp" /></svg>
          </label>
        </div>
      </section>
      <section aria-labelledby="t">
        <div class="rate"><span class="stars" role="img" aria-label="4,7 de 5 estrellas">★★★★★</span><span>4,7</span><a href="#">1.284 reseñas</a></div>
        <h1 id="t">Auriculares Nimbo Air</h1>
        <p class="sub">Cancelación de ruido adaptativa y 40 horas de batería.</p>
        <div class="price"><output aria-live="polite">{{ fmt(total) }}</output><small>o 4 cuotas de {{ fmt(total / 4) }} sin intereses</small></div>
        <fieldset class="sw">
          <legend>Color: <b>{{ colores[color][1] }}</b></legend>
          <label v-for="([k, n], i) in colores" :key="k" :class="k"><input v-model="color" type="radio" name="c" :value="i" /><span class="sr">{{ n }}</span></label>
        </fieldset>
        <label class="extra"><input v-model="estuche" type="checkbox" />Añadir estuche de viaje<span>+ US$ 29,00</span></label>
        <span class="stock">En stock: llega el viernes 9 de octubre</span>
        <div class="btns">
          <button class="btn pri" type="button" @click="msg = `Añadido al carrito: Nimbo Air, ${colores[color][1]}.`">Añadir al carrito</button>
          <button class="btn" type="button" :aria-pressed="fav" @click="fav = !fav">{{ fav ? 'Guardado en favoritos' : 'Guardar en favoritos' }}</button>
        </div>
        <p class="msg" role="status">{{ msg }}</p>
        <ul class="perks"><li>Envío gratis en pedidos desde US$ 100</li><li>Devolución sin costo durante 30 días</li><li>Garantía de 2 años</li></ul>
      </section>
    </div>
    <section class="tabs" aria-label="Más información">
      <div role="tablist" aria-label="Información del producto">
        <button v-for="([t], i) in tabs" :key="t" :ref="(el) => (btns[i] = el as HTMLButtonElement)" role="tab" :id="`t${i}`" :aria-controls="`p${i}`"
          :aria-selected="tab === i" :tabindex="tab === i ? 0 : -1" @click="tab = i" @keydown="onKey($event, i)">{{ t }}</button>
      </div>
      <div v-for="([t, txt], i) in tabs" :key="t" v-show="tab === i" role="tabpanel" :id="`p${i}`" :aria-labelledby="`t${i}`" tabindex="0"><p>{{ txt }}</p></div>
    </section>
  </div>
</template>

<style scoped>
.page{max-width:1100px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit}
:is(a,button,[role=tab]):focus-visible,label:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.pd{--prod:var(--text);display:grid;grid-template-columns:1.1fr 1fr;gap:32px;align-items:start}
.pd.c2{--prod:var(--accent)}.pd.c3{--prod:var(--muted)}
.stage{position:relative;display:grid;place-items:center;aspect-ratio:1;overflow:hidden;color:var(--prod);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.stage::before{content:"";position:absolute;inset:12%;border:1px solid transparent;border-radius:50%;background:linear-gradient(var(--accent-soft),var(--accent-soft)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.stage svg{position:relative;width:72%;transition:transform .3s}
.gal.v2 .stage svg{transform:translate(27%,-17%) scale(2.4)}
.gal.v3 .stage svg{transform:rotate(-12deg) scale(1.25)}
.thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}
.thumbs label{position:relative;display:grid;place-items:center;aspect-ratio:4/3;overflow:hidden;color:var(--prod);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:border-color .14s}
.thumbs label:hover,.thumbs label:has(:checked){border-color:var(--accent)}
.thumbs input,.sw input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.thumbs svg{width:50%;pointer-events:none}
.thumbs label:nth-child(2) svg{transform:scale(1.6) translate(8%,-6%)}.thumbs label:nth-child(3) svg{transform:rotate(-12deg)}
.rate{display:flex;align-items:center;gap:8px;color:var(--muted)}
.stars{font-size:16px;letter-spacing:2px;background:linear-gradient(90deg,var(--warn) 94%,var(--border) 0);-webkit-background-clip:text;background-clip:text;color:transparent}
h1{margin:8px 0 4px;font-size:clamp(24px,3.5vw,32px);line-height:1.2;letter-spacing:-.02em}
.sub{margin:0 0 16px;color:var(--muted)}
.price{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.price output{font-size:32px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.price small{color:var(--muted);font-variant-numeric:tabular-nums}
.sw{display:flex;gap:12px;margin:20px 0 0;padding:0;border:0;min-width:0}
legend{padding:0;margin-bottom:8px;font-weight:600}
legend b{font-weight:400;color:var(--muted)}
.sw label{position:relative;width:32px;height:32px;border:1px solid var(--border);border-radius:50%;cursor:pointer;box-shadow:inset 0 0 0 3px var(--surface)}
.sw label:has(:checked){border-color:var(--accent);box-shadow:inset 0 0 0 3px var(--surface),0 0 0 1px var(--accent)}
.sw .k1{background:var(--text)}.sw .k2{background:var(--accent)}.sw .k3{background:var(--muted)}
.extra{display:flex;align-items:center;gap:10px;margin-top:20px;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.extra input{width:16px;height:16px;accent-color:var(--accent)}
.extra span{margin-left:auto;color:var(--muted);font-variant-numeric:tabular-nums}
.stock{display:inline-block;margin:16px 0;padding:2px 10px;border-radius:999px;background:var(--ok-soft);color:var(--ok);font-size:12px;font-weight:600}
.btns{display:grid;gap:8px}
.btn{padding:10px 16px;font:inherit;font-weight:600;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:filter .14s,border-color .14s}
.btn:hover{border-color:var(--accent);filter:brightness(.97)}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.msg{min-height:20px;margin:8px 0 0;color:var(--ok)}
.perks{display:grid;gap:4px;margin:8px 0 0;padding:16px 0 0;list-style:none;border-top:1px solid var(--border);color:var(--muted)}
.tabs{margin-top:40px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
[role=tablist]{display:flex;gap:4px;padding:0 12px;overflow-x:auto;border-bottom:1px solid var(--border)}
[role=tab]{padding:12px;font:inherit;color:var(--muted);background:none;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;white-space:nowrap}
[role=tab][aria-selected=true]{color:var(--text);font-weight:600;border-bottom-color:var(--accent)}
[role=tabpanel]{padding:20px}
[role=tabpanel] p{margin:0;max-width:70ch;color:var(--muted)}
@media (max-width:820px){.pd{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
