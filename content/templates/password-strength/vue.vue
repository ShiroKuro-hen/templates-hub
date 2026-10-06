<script setup lang="ts">
import { computed, ref } from 'vue';

const RULES = [
  { label: 'Al menos 8 caracteres', test: (v: string) => v.length >= 8 },
  { label: 'Mayúsculas y minúsculas', test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'Un número', test: (v: string) => /\d/.test(v) },
  { label: 'Un símbolo, como ! o #', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];
const NAMES = ['muy débil', 'débil', 'aceptable', 'buena', 'fuerte'];

const value = defineModel<string>({ default: '' });
const show = ref(false);
const met = computed(() => RULES.map((r) => r.test(value.value)));
const score = computed(() => met.value.filter(Boolean).length);
</script>

<template>
  <div class="card">
    <label for="pw">Nueva contraseña</label>
    <div class="field">
      <input id="pw" v-model="value" :type="show ? 'text' : 'password'" autocomplete="new-password" aria-describedby="level reqs" />
      <button type="button" class="toggle" :aria-pressed="show" aria-controls="pw" @click="show = !show">
        {{ show ? 'Ocultar' : 'Mostrar' }}
      </button>
    </div>
    <div class="meter" :data-score="score" aria-hidden="true"><i /><i /><i /><i /></div>
    <p id="level" aria-live="polite">Fortaleza: <b>{{ value ? NAMES[score] : 'sin evaluar' }}</b></p>
    <ul id="reqs" aria-label="Requisitos">
      <li v-for="(r, i) in RULES" :key="r.label" :class="{ ok: met[i] }">{{ r.label }}</li>
    </ul>
  </div>
</template>

<style scoped>
.card{max-width:420px;margin:0 auto;padding:20px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
label{display:block;margin-bottom:6px;font-weight:600}
.field{display:flex;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);transition:border-color .14s}
.field:focus-within{border-color:var(--accent);outline:2px solid var(--accent);outline-offset:2px}
.field input{flex:1;min-width:0;padding:9px 12px;font:inherit;color:var(--text);background:none;border:0;outline:0}
.toggle{font:inherit;font-weight:600;padding:0 12px;color:var(--accent);background:none;border:0;border-left:1px solid var(--border);border-radius:0 var(--radius) var(--radius) 0;cursor:pointer}
.toggle:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.meter{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:12px}
.meter i{height:4px;border-radius:999px;background:var(--border);transition:background .16s}
[data-score="1"] i:nth-child(-n+1){background:var(--err)}
[data-score="2"] i:nth-child(-n+2){background:var(--warn)}
[data-score="3"] i:nth-child(-n+3){background:var(--accent)}
[data-score="4"] i{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
#level{margin:6px 0 12px;color:var(--muted)}
#level b{color:var(--text)}
ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
li{display:flex;align-items:center;gap:8px;color:var(--muted);transition:color .14s}
li::before{content:"";flex:none;display:grid;place-items:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--border);box-sizing:border-box;font-size:10px;font-weight:700}
li.ok{color:var(--text)}
li.ok::before{content:"✓" / "Cumplido: ";color:var(--ok);border-color:var(--ok);background:var(--ok-soft)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
