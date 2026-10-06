<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';

type Settings = { name: string; email: string; lang: string; weekly: boolean; mentions: boolean; news: boolean; mfa: boolean; timeout: string };
type Toggle = 'weekly' | 'mentions' | 'news';

const props = withDefaults(defineProps<{ initial?: Settings }>(), {
  initial: () => ({ name: 'Laura Méndez', email: 'laura@altamira.com', lang: 'Español', weekly: true, mentions: true, news: false, mfa: false, timeout: 'Tras 8 horas' }),
});
const emit = defineEmits<{ save: [s: Settings] }>();
const tabs = ['Perfil', 'Notificaciones', 'Seguridad'];
const notif: [Toggle, string, string][] = [
  ['weekly', 'Resumen semanal', 'Un correo cada lunes con la actividad del equipo.'],
  ['mentions', 'Menciones', 'Cuando alguien te menciona en un comentario.'],
  ['news', 'Novedades del producto', 'Funciones nuevas, como mucho una vez al mes.'],
];
const tab = ref(0);
const tabEls = ref<HTMLButtonElement[]>([]);
const saved = ref({ ...props.initial });
const s = reactive({ ...props.initial });
const msg = ref('Sin cambios pendientes.');
const dirty = computed(() => JSON.stringify(s) !== JSON.stringify(saved.value));

function go(i: number) { tab.value = (i + tabs.length) % tabs.length; tabEls.value[tab.value]?.focus(); }
function onKey(e: KeyboardEvent) {
  const next = ({ ArrowDown: tab.value + 1, ArrowRight: tab.value + 1, ArrowUp: tab.value - 1, ArrowLeft: tab.value - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
  if (next !== undefined) { e.preventDefault(); go(next); }
}
async function submit(e: Event) {
  const bad = (e.target as HTMLFormElement).querySelector<HTMLInputElement>(':invalid');
  if (bad) { tab.value = 0; await nextTick(); bad.reportValidity(); return; } // solo Perfil tiene campos obligatorios
  saved.value = { ...s }; emit('save', { ...s }); msg.value = 'Cambios guardados.';
}
function discard() { Object.assign(s, saved.value); msg.value = 'Cambios descartados.'; }
</script>

<template>
  <main class="wrap">
    <h1>Ajustes</h1>
    <p class="lead">Gestiona tu perfil, avisos y seguridad de la cuenta.</p>
    <form novalidate @submit.prevent="submit" @reset.prevent="discard" @input="msg = 'Tienes cambios sin guardar.'">
      <div role="tablist" aria-label="Secciones de ajustes" aria-orientation="vertical" @keydown="onKey">
        <button v-for="(t, i) in tabs" :key="t" ref="tabEls" type="button" role="tab" :id="`t${i}`" :aria-controls="`p${i}`"
                :aria-selected="tab === i" :tabindex="tab === i ? 0 : -1" @click="go(i)">{{ t }}</button>
      </div>
      <section role="tabpanel" id="p0" aria-labelledby="t0" :hidden="tab !== 0">
        <h2>Perfil</h2><p class="desc">Así te ven las personas de tu equipo.</p>
        <div class="fields">
          <label class="f">Nombre <input v-model="s.name" required autocomplete="name" /></label>
          <label class="f">Correo <input v-model="s.email" type="email" required autocomplete="email" /></label>
          <label class="f">Idioma <select v-model="s.lang"><option>Español</option><option>English</option><option>Português</option></select></label>
        </div>
      </section>
      <section role="tabpanel" id="p1" aria-labelledby="t1" :hidden="tab !== 1">
        <h2>Notificaciones</h2><p class="desc">Elige qué avisos recibes por correo.</p>
        <label v-for="[k, t, h] in notif" :key="k" class="row"><span>{{ t }}<small>{{ h }}</small></span><input v-model="s[k]" class="switch" type="checkbox" role="switch" /></label>
      </section>
      <section role="tabpanel" id="p2" aria-labelledby="t2" :hidden="tab !== 2">
        <h2>Seguridad</h2><p class="desc">Protege el acceso a tu cuenta.</p>
        <label class="row"><span>Verificación en dos pasos<small>Pide un código de tu app de autenticación al iniciar sesión.</small></span><input v-model="s.mfa" class="switch" type="checkbox" role="switch" /></label>
        <div class="fields"><label class="f">Cerrar sesión por inactividad
          <select v-model="s.timeout"><option>Tras 30 minutos</option><option>Tras 8 horas</option><option>Nunca</option></select></label></div>
      </section>
      <div class="bar">
        <p role="status">{{ msg }}</p>
        <button class="btn" type="reset" :disabled="!dirty">Descartar</button>
        <button class="btn primary" type="submit" :disabled="!dirty">Guardar cambios</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.wrap{max-width:960px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{font-size:22px;line-height:1.25;margin:0}
.lead{margin:2px 0 20px;color:var(--muted)}
form{display:grid;grid-template-columns:200px 1fr;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
[role=tablist]{display:flex;flex-direction:column;gap:2px;padding:12px;border-right:1px solid var(--border)}
[role=tab]{all:unset;position:relative;padding:8px 12px;border-radius:6px;color:var(--muted);font-weight:500;cursor:pointer;transition:background .14s,color .14s}
[role=tab]:hover{background:var(--bg);color:var(--text)}
[role=tab][aria-selected=true]{background:var(--accent-soft);color:var(--accent)}
[role=tab][aria-selected=true]::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
[role=tabpanel]{padding:24px;min-width:0}
[role=tabpanel][hidden]{display:none}
h2{font-size:16px;margin:0 0 4px}
.desc{margin:0 0 20px;color:var(--muted)}
.fields{display:grid;gap:16px;max-width:440px}
.f{display:grid;gap:6px;font-weight:600}
input:not([type=checkbox]),select{font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:9px 12px}
input:user-invalid{border-color:var(--err)}
.row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 0;border-top:1px solid var(--border)}
.row:first-of-type{border-top:0;padding-top:0}
.row small{display:block;color:var(--muted);font-size:13px}
.switch{appearance:none;flex:none;width:36px;height:20px;border-radius:999px;background:var(--border);position:relative;cursor:pointer;margin:0;transition:background .14s}
.switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:999px;background:var(--surface);box-shadow:var(--shadow);transition:transform .14s}
.switch:checked{background:var(--accent)}
.switch:checked::after{transform:translateX(16px)}
.bar{grid-column:1/-1;display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:12px 24px;border-top:1px solid var(--border);background:var(--bg)}
.bar p{margin:0 auto 0 0;color:var(--muted)}
.btn{font:inherit;font-weight:600;border-radius:var(--radius);padding:8px 14px;cursor:pointer;border:1px solid var(--border);background:var(--surface);color:var(--text)}
.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn:disabled{opacity:.5;cursor:not-allowed}
@media (max-width:680px){form{grid-template-columns:1fr}[role=tablist]{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid var(--border)}[role=tab]{white-space:nowrap}[role=tab][aria-selected=true]::before{left:12px;right:12px;top:auto;bottom:0;width:auto;height:2px}[role=tabpanel]{padding:20px 16px}.bar{padding:12px 16px;flex-wrap:wrap}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
