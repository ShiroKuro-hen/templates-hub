<script setup lang="ts">
import { computed, ref } from 'vue';

type Pattern = 'dots' | 'lines' | 'grid' | 'waves';
type Tone = 'accent' | 'ok' | 'warn' | 'info' | 'muted';

const PATTERNS: { value: Pattern; label: string }[] = [
  { value: 'dots', label: 'Puntos' },
  { value: 'lines', label: 'Líneas' },
  { value: 'grid', label: 'Cuadrícula' },
  { value: 'waves', label: 'Ondas' },
];
const TONES: { value: Tone; label: string }[] = [
  { value: 'accent', label: 'Acento' },
  { value: 'ok', label: 'Éxito' },
  { value: 'warn', label: 'Aviso' },
  { value: 'info', label: 'Información' },
  { value: 'muted', label: 'Atenuado' },
];

function layers(pattern: Pattern, size: number, color: string): string {
  const dot = Math.max(1, Math.round(size / 8));
  const arc = Math.round(size * 0.4);
  switch (pattern) {
    case 'dots':
      return `radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 1}px)`;
    case 'lines':
      return `linear-gradient(${color} 2px, transparent 2px)`;
    case 'grid':
      return `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
    case 'waves':
      return `radial-gradient(circle at 50% 100%, transparent ${arc - 1}px, ${color} ${arc}px ${arc + 2}px, transparent ${arc + 3}px)`;
  }
}

const pattern = ref<Pattern>('dots');
const size = ref(24);
const tone = ref<Tone>('accent');
const msg = ref('');

const image = computed(() => layers(pattern.value, size.value, `var(--${tone.value})`));
const css = computed(() => `.patron {\n  background-color: var(--surface);\n  background-image: ${image.value};\n  background-size: ${size.value}px ${size.value}px;\n}`);

async function copy() {
  try {
    if (!navigator.clipboard) throw new Error('sin portapapeles');
    await navigator.clipboard.writeText(css.value);
    msg.value = 'CSS copiado.';
  } catch {
    msg.value = 'No se pudo copiar. Selecciona el código y cópialo a mano.';
  }
}
</script>

<template>
  <section class="gen" aria-labelledby="gen-title">
    <h1 id="gen-title">Generador de patrones de fondo</h1>
    <p class="lead">Elige un patrón, ajusta su tamaño y color, y copia el CSS.</p>
    <div class="layout">
      <div class="panel">
        <fieldset>
          <legend>Patrón</legend>
          <div class="chips">
            <label v-for="p in PATTERNS" :key="p.value" class="chip">
              <input v-model="pattern" type="radio" name="pattern" :value="p.value" />
              {{ p.label }}
            </label>
          </div>
        </fieldset>
        <div class="field">
          <label for="size">Tamaño: <output for="size">{{ size }}</output> px</label>
          <input id="size" v-model.number="size" type="range" min="8" max="48" />
        </div>
        <div class="field">
          <label for="color">Color</label>
          <select id="color" v-model="tone">
            <option v-for="t in TONES" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
      </div>
      <div class="out">
        <div class="preview" role="img" aria-label="Vista previa del patrón" :style="{ backgroundImage: image, backgroundSize: `${size}px ${size}px` }"></div>
        <pre tabindex="0" aria-label="CSS generado"><code>{{ css }}</code></pre>
        <button type="button" class="btn" @click="copy">Copiar CSS</button>
        <p class="msg" role="status">{{ msg }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
*{box-sizing:border-box}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.gen{max-width:880px;margin:0 auto}
h1{margin:0 0 4px;font-size:1.5rem;line-height:1.3;letter-spacing:-.02em}
.lead{margin:0 0 18px;color:var(--muted)}
.layout{display:grid;gap:16px}
@media(min-width:768px){.layout{grid-template-columns:1fr 1fr}}
.panel,.out{min-width:0;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
fieldset{min-width:0;margin:0 0 16px;padding:0;border:0}
legend,.field label{display:block;margin:0 0 8px;padding:0;font-weight:600}
.field{min-width:0;margin:0 0 16px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--border);border-radius:min(var(--radius),6px);cursor:pointer}
.chip:has(input:checked){border-color:var(--accent);background:var(--accent-soft)}
.chip:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
input[type=range]{width:100%;margin:0;accent-color:var(--accent)}
select{width:100%;font:inherit;padding:8px 10px;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:min(var(--radius),6px)}
.preview{height:224px;margin:0 0 12px;background-color:var(--surface);border:1px solid var(--border);border-radius:min(var(--radius),6px)}
pre{margin:0 0 12px;padding:12px;overflow-x:auto;font:13px/1.6 ui-monospace,Consolas,monospace;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:min(var(--radius),6px)}
.btn{padding:8px 14px;font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer}
.btn:hover{filter:brightness(1.08)}
.msg{min-height:1.5em;margin:8px 0 0;color:var(--muted);font-size:13px}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
