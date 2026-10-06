<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const emit = defineEmits<{ select: [date: Date] }>();
const fmtM = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });
const fmtL = new Intl.DateTimeFormat('es', { dateStyle: 'full' });
const DAYS = [['L', 'lunes'], ['M', 'martes'], ['X', 'miércoles'], ['J', 'jueves'], ['V', 'viernes'], ['S', 'sábado'], ['D', 'domingo']];
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
const today = new Date(); today.setHours(0, 0, 0, 0);

const cursor = ref(new Date(today));
const sel = ref<Date | null>(null);
const body = ref<HTMLElement>();
const title = computed(() => { const t = fmtM.format(cursor.value); return t[0].toUpperCase() + t.slice(1); });
const weeks = computed(() => {
  const y = cursor.value.getFullYear(), m = cursor.value.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7, total = new Date(y, m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, i) => {
    const d = i - offset + 1;
    return d >= 1 && d <= total ? new Date(y, m, d) : null;
  });
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
});

async function go(d: Date, focus: boolean) {
  cursor.value = d;
  if (!focus) return;
  await nextTick();
  body.value?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
}
function pick(d: Date) { sel.value = d; go(d, true); emit('select', d); }
function shift(n: number) { const c = cursor.value; go(new Date(c.getFullYear(), c.getMonth() + n, 1), false); }

function onKeyDown(e: KeyboardEvent) {
  const c = cursor.value, y = c.getFullYear(), m = c.getMonth(), d = c.getDate(), dow = (c.getDay() + 6) % 7;
  const delta = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -dow, End: 6 - dow } as Record<string, number>)[e.key];
  if (delta !== undefined) go(new Date(y, m, d + delta), true);
  else if (e.key === 'PageUp' || e.key === 'PageDown') {
    const nm = m + (e.key === 'PageUp' ? -1 : 1);
    go(new Date(y, nm, Math.min(d, new Date(y, nm + 1, 0).getDate())), true);
  } else return;
  e.preventDefault();
}
</script>

<template>
  <section class="cal" aria-labelledby="cal-title">
    <header>
      <h2 id="cal-title" aria-live="polite">{{ title }}</h2>
      <div class="nav">
        <button type="button" aria-label="Mes anterior" @click="shift(-1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg></button>
        <button type="button" aria-label="Mes siguiente" @click="shift(1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg></button>
      </div>
    </header>
    <table aria-labelledby="cal-title">
      <thead><tr><th v-for="[s, l] in DAYS" :key="l" scope="col" :abbr="l">{{ s }}</th></tr></thead>
      <tbody ref="body" @keydown="onKeyDown">
        <tr v-for="(w, i) in weeks" :key="i">
          <td v-for="(d, j) in w" :key="j">
            <button v-if="d" type="button" :tabindex="same(d, cursor) ? 0 : -1" :aria-label="fmtL.format(d)"
                    :aria-current="same(d, today) ? 'date' : undefined" :aria-pressed="same(d, sel)" @click="pick(d)">{{ d.getDate() }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <footer>
      <p class="out" role="status">{{ sel ? `Fecha seleccionada: ${fmtL.format(sel)}.` : 'Selecciona una fecha para continuar.' }}</p>
      <button type="button" class="today" @click="go(new Date(today), true)">Hoy</button>
    </footer>
  </section>
</template>

<style scoped>
.cal{max-width:340px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
h2{margin:0;font-size:15px;font-weight:600}
.nav{display:flex;gap:4px}
button{font:inherit;color:var(--text);background:none;border:1px solid transparent;cursor:pointer;transition:background .14s,border-color .14s}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.nav button{display:grid;place-items:center;width:32px;height:32px;border-color:var(--border);border-radius:var(--radius)}
.nav button:hover{border-color:var(--muted)}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{padding:4px 0;font-size:12px;font-weight:500;color:var(--muted)}
td{padding:2px;text-align:center}
td button{position:relative;width:100%;max-width:40px;aspect-ratio:1;border-radius:var(--radius);font-variant-numeric:tabular-nums}
td button:hover{background:var(--accent-soft)}
td button[aria-current=date]{font-weight:600;color:var(--accent);border-color:var(--border)}
td button[aria-current=date]::after{content:"";position:absolute;left:50%;bottom:4px;width:4px;height:4px;margin-left:-2px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
td button[aria-pressed=true],td button[aria-pressed=true]:hover{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
td button[aria-pressed=true]::after{background:var(--accent-ink)}
footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
.out{margin:0;color:var(--muted);font-size:13px}
.today{flex:none;padding:4px 8px;border-radius:6px;color:var(--accent);font-weight:500}
.today:hover{background:var(--accent-soft)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
