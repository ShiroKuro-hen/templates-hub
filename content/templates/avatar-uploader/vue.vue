<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const emit = defineEmits<{ save: [file: File, zoom: number] }>();
const MAX_MB = 2;
const file = ref<File | null>(null), url = ref(''), zoom = ref(100);
const msg = ref({ text: 'Formatos PNG, JPG o WebP, hasta 2 MB.', kind: '' });

function revoke() { if (url.value) URL.revokeObjectURL(url.value); }
function pick(e: Event) {
  const input = e.target as HTMLInputElement, f = input.files?.[0];
  input.value = '';
  if (!f) return;
  if (!f.type.startsWith('image/')) { msg.value = { text: `"${f.name}" no es una imagen. Elige un archivo PNG, JPG o WebP.`, kind: 'err' }; return; }
  if (f.size > MAX_MB * 1024 ** 2) {
    const mb = (f.size / 1024 ** 2).toFixed(1).replace('.', ',');
    msg.value = { text: `La imagen pesa ${mb} MB. Elige una de hasta ${MAX_MB} MB.`, kind: 'err' }; return;
  }
  revoke(); file.value = f; url.value = URL.createObjectURL(f); zoom.value = 100;
  msg.value = { text: `${f.name} lista. Ajusta el zoom y guarda.`, kind: '' };
}
function clear() { revoke(); file.value = null; url.value = ''; msg.value = { text: 'Sin imagen. Elige una para continuar.', kind: '' }; }
function save() { if (file.value) emit('save', file.value, zoom.value); msg.value = { text: 'Avatar guardado. Ya aparece en tu perfil.', kind: 'ok' }; }
onBeforeUnmount(revoke);
</script>

<template>
  <section class="card" aria-labelledby="h">
    <h2 id="h">Foto de perfil</h2>
    <p class="muted">Elige una imagen cuadrada para que se vea mejor.</p>
    <div class="row">
      <div class="ring">
        <div class="avatar" :style="{ '--z': zoom / 100 }">
          <img v-if="url" :src="url" alt="Vista previa del avatar" />
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z" /></svg>
        </div>
      </div>
      <div class="ctl">
        <div class="btns">
          <input id="file" class="sr" type="file" accept="image/*" @change="pick" />
          <label class="btn" for="file">Elegir imagen</label>
          <button type="button" class="btn" :disabled="!url" @click="clear">Quitar</button>
        </div>
        <div class="zoom">
          <label for="zoom">Zoom <output for="zoom">{{ zoom }} %</output></label>
          <input id="zoom" v-model.number="zoom" type="range" min="100" max="300" step="5" :disabled="!url" />
        </div>
      </div>
    </div>
    <div class="foot">
      <p class="msg" :class="msg.kind" role="status">{{ msg.text }}</p>
      <button type="button" class="btn primary" :disabled="!url" @click="save">Guardar avatar</button>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:440px;margin:0 auto;padding:20px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.muted{margin:2px 0 0;color:var(--muted)}
.row{display:flex;flex-wrap:wrap;gap:24px;align-items:center;margin:20px 0}
.ring{flex:none;padding:1px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#2f5bff);box-shadow:0 0 0 5px var(--accent-soft)}
.avatar{display:grid;place-items:center;width:128px;height:128px;border-radius:50%;overflow:hidden;background:var(--surface);color:var(--muted)}
.avatar img{width:100%;height:100%;object-fit:cover;transform:scale(var(--z,1));transition:transform .12s}
.avatar svg{width:64px;height:64px;fill:currentColor}
.ctl{flex:1 1 180px;display:grid;gap:12px}
.btns{display:flex;flex-wrap:wrap;gap:8px}
.btn{display:inline-grid;place-items:center;height:36px;padding:0 14px;font:inherit;font-weight:500;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn:disabled:hover{background:var(--surface)}
.primary{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.primary:hover{background:var(--accent);filter:brightness(1.1)}
.primary:disabled:hover{background:var(--accent)}
.sr{position:absolute;width:1px;height:1px;opacity:0;overflow:hidden}
.sr:focus-visible+label,.btn:focus-visible,input[type=range]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.zoom label{display:flex;justify-content:space-between;margin-bottom:4px;font-weight:500}
output{color:var(--muted);font-variant-numeric:tabular-nums}
input[type=range]{width:100%;margin:0;accent-color:var(--accent)}
input[type=range]:disabled{opacity:.5}
.foot{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid var(--border)}
.msg{flex:1 1 200px;margin:0;color:var(--muted)}
.msg.err{color:var(--err)}.msg.ok{color:var(--ok)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
