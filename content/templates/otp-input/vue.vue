<script setup lang="ts">
import { computed, ref } from 'vue';

const LEN = 6;
const emit = defineEmits<{ complete: [code: string] }>();
const digits = ref<string[]>(Array(LEN).fill(''));
const boxes = ref<HTMLInputElement[]>([]);
const code = computed(() => digits.value.join(''));
const focus = (i: number) => boxes.value[Math.max(0, Math.min(i, LEN - 1))]?.focus();

function fill(i: number, raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, LEN - i);
  [...d].forEach((c, j) => (digits.value[i + j] = c));
  focus(i + d.length);
}
function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement;
  const d = el.value.replace(/\D/g, '');
  if (d.length > 1) return fill(i, d); // autocompletado del SO
  digits.value[i] = d;
  el.value = d;
  if (d) focus(i + 1);
}
function onBack(i: number, e: KeyboardEvent) {
  if (digits.value[i] || i === 0) return;
  e.preventDefault();
  digits.value[i - 1] = '';
  focus(i - 1);
}
function onPaste(i: number, e: ClipboardEvent) {
  fill(i, e.clipboardData?.getData('text') ?? '');
}
</script>

<template>
  <form novalidate @submit.prevent="emit('complete', code)">
    <fieldset>
      <legend>Introduce el código de verificación</legend>
      <p id="hint" class="hint">Lo enviamos por SMS al +51 ••• ••• 482.</p>
      <div class="otp" aria-describedby="hint">
        <input v-for="(d, i) in digits" :key="i" ref="boxes" :value="d" placeholder=" " inputmode="numeric"
               :autocomplete="i === 0 ? 'one-time-code' : 'off'" :aria-label="`Dígito ${i + 1} de ${LEN}`"
               @focus="($event.target as HTMLInputElement).select()" @input="onInput(i, $event)"
               @keydown.backspace="onBack(i, $event)" @keydown.left.prevent="focus(i - 1)" @keydown.right.prevent="focus(i + 1)"
               @paste.prevent="onPaste(i, $event)" />
      </div>
      <div class="bar" aria-hidden="true"><i :style="{ '--p': code.length / LEN }" /></div>
    </fieldset>
    <div class="actions">
      <button type="button" class="ghost">Reenviar código</button>
      <button type="submit" :disabled="code.length < LEN">Verificar código</button>
    </div>
  </form>
</template>

<style scoped>
form{max-width:400px;margin:0 auto;padding:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
fieldset{margin:0;padding:0;border:0}
legend{padding:0;font-size:16px;font-weight:600}
.hint{margin:4px 0 16px;color:var(--muted)}
.otp{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.otp input{width:100%;min-width:0;aspect-ratio:1/1.15;box-sizing:border-box;padding:0;text-align:center;font:600 20px/1 system-ui,-apple-system,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s,background .14s}
.otp input:not(:placeholder-shown){border-color:var(--accent);background:var(--accent-soft)}
.otp input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bar{height:2px;margin-top:12px;border-radius:999px;background:var(--border);overflow:hidden}
.bar i{display:block;height:100%;background:linear-gradient(135deg,#22d3ee,#2f5bff);transform-origin:left;transform:scaleX(var(--p,0));transition:transform .16s}
.actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:20px;flex-wrap:wrap}
button{font:inherit;font-weight:600;padding:8px 16px;border-radius:var(--radius);cursor:pointer;transition:opacity .14s}
button[type=submit]{color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent)}
button[type=submit]:disabled{opacity:.45;cursor:not-allowed}
.ghost{color:var(--accent);background:none;border:1px solid transparent}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
