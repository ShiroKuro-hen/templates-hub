<script setup lang="ts">
import { nextTick, ref } from 'vue';

const tabs = [
  { id: 'curl', label: 'cURL', code: `curl -X POST https://api.ejemplo.com/v1/pedidos \\
  -H "Authorization: Bearer $CLAVE" \\
  -H "Content-Type: application/json" \\
  -d '{"cliente": "cli_204", "total": 1280}'` },
  { id: 'js', label: 'JavaScript', code: `const res = await fetch('https://api.ejemplo.com/v1/pedidos', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${process.env.CLAVE}\`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ cliente: 'cli_204', total: 1280 }),
});
const pedido = await res.json();` },
  { id: 'py', label: 'Python', code: `import os, requests

res = requests.post(
    "https://api.ejemplo.com/v1/pedidos",
    headers={"Authorization": f"Bearer {os.environ['CLAVE']}"},
    json={"cliente": "cli_204", "total": 1280},
)
pedido = res.json()` },
];
const i = ref(0);
const estado = ref<'idle' | 'ok' | 'error'>('idle');
const btns = ref<HTMLButtonElement[]>([]);

async function ir(k: number) { i.value = k; await nextTick(); btns.value[k]?.focus(); }
function onKey(e: KeyboardEvent) {
  const n = tabs.length;
  const to = ({ ArrowRight: (i.value + 1) % n, ArrowLeft: (i.value - 1 + n) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
  if (to !== undefined) { e.preventDefault(); ir(to); }
}
async function copiar() {
  try {
    await navigator.clipboard.writeText(tabs[i.value].code);
    estado.value = 'ok'; setTimeout(() => (estado.value = 'idle'), 1600);
  } catch { estado.value = 'error'; }
}
</script>

<template>
  <div class="ct">
    <div class="bar">
      <div role="tablist" aria-label="Lenguaje del ejemplo" @keydown="onKey">
        <button v-for="(t, k) in tabs" :id="`t-${t.id}`" :key="t.id" ref="btns" role="tab" :aria-selected="k === i"
                :aria-controls="`p-${t.id}`" :tabindex="k === i ? 0 : -1" @click="i = k">{{ t.label }}</button>
      </div>
      <button type="button" class="copy" :data-ok="estado === 'ok' ? '' : undefined" @click="copiar">{{ estado === 'ok' ? 'Copiado' : 'Copiar' }}</button>
    </div>
    <div v-for="(t, k) in tabs" :id="`p-${t.id}`" :key="t.id" role="tabpanel" :aria-labelledby="`t-${t.id}`" tabindex="0" :hidden="k !== i">
      <pre><code>{{ t.code }}</code></pre>
    </div>
    <p class="msg" role="alert">{{ estado === 'error' ? 'No se pudo copiar. Selecciona el código y pulsa Ctrl+C.' : '' }}</p>
    <p class="sr" aria-live="polite">{{ estado === 'ok' ? 'Código copiado al portapapeles.' : '' }}</p>
  </div>
</template>

<style scoped>
.ct{max-width:680px;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 8px 0 4px;border-bottom:1px solid var(--border)}
[role=tablist]{display:flex;overflow-x:auto}
[role=tab]{position:relative;padding:10px 14px;font:inherit;color:var(--muted);background:none;border:0;cursor:pointer;white-space:nowrap;transition:color .14s}
[role=tab]:hover{color:var(--text)}
[role=tab][aria-selected=true]{color:var(--text);font-weight:600}
[role=tab][aria-selected=true]::after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:2px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.copy{flex:none;padding:5px 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:border-color .14s}
.copy:hover{border-color:var(--accent)}
.copy:focus-visible{outline-offset:2px}
.copy[data-ok]{color:var(--ok);border-color:var(--ok)}
[role=tabpanel][hidden]{display:none}
pre{margin:0;padding:16px;overflow:auto;background:var(--bg);font:13px/1.6 ui-monospace,"Cascadia Code",Menlo,monospace;tab-size:2}
.msg{margin:0;padding:8px 16px;color:var(--err);border-top:1px solid var(--border)}
.msg:empty{display:none}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
