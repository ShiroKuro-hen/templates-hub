<script setup lang="ts">
import { nextTick, ref } from 'vue';

type Category = { id: string; label: string; detail: string; locked?: boolean };
const categories: Category[] = [
  { id: 'necessary', label: 'Necesarias', detail: 'Permiten iniciar sesión y recordar tu carrito. Siempre activas.', locked: true },
  { id: 'analytics', label: 'Analíticas', detail: 'Nos dicen qué páginas se usan para mejorarlas.' },
  { id: 'prefs', label: 'Preferencias', detail: 'Recuerdan tu idioma y región.' },
  { id: 'marketing', label: 'Marketing', detail: 'Muestran anuncios según tu actividad en otros sitios.' },
];
type Consent = Record<string, boolean>;
const emit = defineEmits<{ save: [consent: Consent] }>();
const all = (v: boolean): Consent => Object.fromEntries(categories.map((c) => [c.id, !!c.locked || v]));
const consent = ref<Consent>(all(false));
const open = ref(true);
const status = ref('');
const reopen = ref<HTMLButtonElement>();

async function save(c: Consent) {
  consent.value = c;
  open.value = false;
  status.value = `Guardaste tus preferencias: ${categories.filter((x) => c[x.id]).map((x) => x.label).join(', ')}.`;
  emit('save', c);
  await nextTick();
  reopen.value?.focus();
}
</script>

<template>
  <section class="banner" aria-labelledby="cc-title" :hidden="!open">
    <h2 id="cc-title">Tu privacidad en este sitio</h2>
    <p>Usamos cookies necesarias para que el sitio funcione. Con tu permiso, también usamos otras para medir el uso y personalizar contenido. Lee la <a href="#">política de cookies</a>.</p>
    <div class="row">
      <button class="btn" type="button" @click="save(all(false))">Rechazar opcionales</button>
      <button class="btn" type="button" @click="save(all(true))">Aceptar todas</button>
    </div>
    <details>
      <summary>Configurar preferencias</summary>
      <form @submit.prevent="save(consent)">
        <label v-for="c in categories" :key="c.id" class="opt">
          <span><b>{{ c.label }}</b><small>{{ c.detail }}</small></span>
          <input v-model="consent[c.id]" class="switch" type="checkbox" role="switch" :disabled="c.locked" />
        </label>
        <div class="row"><button class="btn primary" type="submit">Guardar preferencias</button></div>
      </form>
    </details>
  </section>
  <p class="status" role="status">{{ status }}</p>
  <button ref="reopen" class="btn" type="button" :hidden="open" @click="open = true; status = ''">Cambiar preferencias de cookies</button>
</template>

<style scoped>
.banner{max-width:720px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.banner h2{margin:0;font-size:16px}
.banner p{margin:4px 0 0;color:var(--muted);max-width:68ch}
.banner a{color:var(--accent)}
.row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.btn{padding:8px 14px;font:inherit;font-weight:600;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--bg)}
.btn.primary{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.btn.primary:hover{filter:brightness(1.08)}
details{margin-top:16px;border-top:1px solid var(--border)}
summary{width:fit-content;margin-top:12px;padding:2px 4px;border-radius:4px;color:var(--accent);font-weight:600;cursor:pointer}
.opt{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--border)}
.opt b{display:block;font-weight:600}
.opt small{display:block;color:var(--muted);font-size:13px}
.switch{appearance:none;flex:none;position:relative;width:36px;height:20px;margin:2px 0 0;border:1px solid var(--border);border-radius:999px;background:var(--bg);cursor:pointer;transition:background .14s}
.switch::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--muted);transition:transform .14s}
.switch:checked{border-color:transparent;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.switch:checked::after{transform:translateX(16px);background:var(--surface)}
.switch:disabled{opacity:.6;cursor:not-allowed}
.btn:focus-visible,summary:focus-visible,.switch:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.status{margin:12px 0 0;color:var(--text)}
.status:empty{margin:0}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
