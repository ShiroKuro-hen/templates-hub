<script setup lang="ts">
import { computed, ref } from 'vue';

const PAISES = [
  { code: '51', name: 'Perú', mask: '### ### ###' },
  { code: '52', name: 'México', mask: '## #### ####' },
  { code: '57', name: 'Colombia', mask: '### ### ####' },
  { code: '56', name: 'Chile', mask: '# #### ####' },
  { code: '34', name: 'España', mask: '### ## ## ##' },
];
const maxOf = (mask: string) => mask.split('#').length - 1;
function formatear(d: string, mask: string) {
  let out = '', i = 0;
  for (const c of mask) { if (i >= d.length) break; out += c === '#' ? d[i++] : c; }
  return out;
}

const code = ref('51');
const d = ref('');
const estado = ref<'idle' | 'error' | 'ok'>('idle');
const tel = ref<HTMLInputElement>();

const p = computed(() => PAISES.find((x) => x.code === code.value)!);
const max = computed(() => maxOf(p.value.mask));
const k = computed(() => max.value - d.value.length);
const visible = computed(() => formatear(d.value, p.value.mask));
const s = computed(() => (k.value > 1 ? 's' : ''));
const texto = computed(() =>
  estado.value === 'error' ? `Faltan ${k.value} dígito${s.value}. Un número de ${p.value.name} tiene ${max.value}.`
  : estado.value === 'ok' ? `Número guardado: +${p.value.code} ${visible.value}.`
  : !d.value ? `Un número de ${p.value.name} tiene ${max.value} dígitos.`
  : k.value ? `Faltan ${k.value} dígito${s.value}.` : `Se guardará como +${p.value.code}${d.value}.`);

function onTel(e: Event) {
  const el = e.target as HTMLInputElement, v = el.value.trim();
  const sinPrefijo = v.startsWith('+' + code.value) ? v.slice(code.value.length + 1) : v;
  d.value = sinPrefijo.replace(/\D/g, '').slice(0, max.value);
  el.value = visible.value; estado.value = 'idle';
}
function onPais() { d.value = d.value.slice(0, max.value); estado.value = 'idle'; }
function submit() {
  estado.value = k.value ? 'error' : 'ok';
  if (k.value) tel.value?.focus();
}
</script>

<template>
  <main class="card">
    <form novalidate @submit.prevent="submit">
      <h1>Teléfono de contacto</h1>
      <p class="sub">Solo lo usaremos para confirmar tu pedido.</p>
      <label for="tel">Número de teléfono</label>
      <div class="grp" :class="{ bad: estado === 'error' }">
        <select v-model="code" aria-label="País" autocomplete="tel-country-code" @change="onPais">
          <option v-for="x in PAISES" :key="x.code" :value="x.code">{{ x.name }} +{{ x.code }}</option>
        </select>
        <input id="tel" ref="tel" type="tel" inputmode="numeric" autocomplete="tel-national" aria-describedby="h"
          :aria-invalid="estado === 'error'" :value="visible" :placeholder="formatear('9876543210', p.mask)" @input="onTel" />
      </div>
      <div class="meter" aria-hidden="true"><i :style="{ width: (d.length / max) * 100 + '%' }" /></div>
      <p id="h" class="hint" :class="estado === 'error' ? 'err' : !k ? 'ok' : ''" aria-live="polite">{{ texto }}</p>
      <div class="row"><button class="btn">Guardar número</button></div>
    </form>
  </main>
</template>

<style scoped>
.card{max-width:420px;margin:0 auto;padding:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;line-height:1.3}
.sub{margin:2px 0 18px;color:var(--muted)}
label{display:block;margin-bottom:6px;font-weight:600}
.grp{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s}
.grp:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.grp.bad{border-color:var(--err)}
select,input{font:inherit;color:var(--text);background:transparent;border:0;padding:8px 12px;min-width:0}
select{max-width:55%;border-right:1px solid var(--border);border-radius:var(--radius) 0 0 var(--radius);cursor:pointer}
option{background:var(--surface);color:var(--text)}
input{flex:1;font-variant-numeric:tabular-nums;border-radius:0 var(--radius) var(--radius) 0}
select:focus-visible,input:focus-visible{outline:0}
.meter{height:4px;margin-top:8px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.meter i{display:block;height:100%;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
.hint{min-height:21px;margin:8px 0 0;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.hint.err{color:var(--err)}
.hint.ok{color:var(--ok)}
.row{display:flex;justify-content:flex-end;margin-top:16px}
.btn{font:inherit;font-weight:600;padding:8px 16px;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
