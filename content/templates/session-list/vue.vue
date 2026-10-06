<script setup lang="ts">
import { computed, ref } from 'vue';

type Kind = 'laptop' | 'phone' | 'desktop' | 'tablet';
type Session = { id: string; name: string; detail: string; seen: string; kind: Kind; current?: boolean };

const ICON: Record<Kind, string> = {
  laptop: 'M5 5h14v10H5zM2 19h20',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  desktop: 'M3 4h18v12H3zM9 20h6M12 16v4',
  tablet: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
};
const props = withDefaults(defineProps<{ initial?: Session[]; onRevoke?: (ids: string[]) => Promise<void> }>(), {
  initial: () => [
    { id: '1', name: 'MacBook Pro 14"', detail: 'Chrome 126 en macOS, Lima, Perú', seen: 'Activa ahora', kind: 'laptop', current: true },
    { id: '2', name: 'iPhone 15', detail: 'App Norte Cloud 4.2 en iOS 18, Lima, Perú', seen: 'Hace 2 horas', kind: 'phone' },
    { id: '3', name: 'Equipo de oficina', detail: 'Edge 125 en Windows 11, Bogotá, Colombia', seen: 'Ayer a las 18:42', kind: 'desktop' },
    { id: '4', name: 'iPad Air', detail: 'Safari 17 en iPadOS, Madrid, España', seen: 'Hace 6 días', kind: 'tablet' },
  ],
});
const list = ref<Session[]>([...props.initial]);
const live = ref('');
const dlg = ref<HTMLDialogElement | null>(null);
const title = ref<HTMLElement | null>(null);
const others = computed(() => list.value.filter((s) => !s.current));
const plural = (n: number, a: string, b: string) => `${n} ${n === 1 ? a : b}`;

async function revoke(ids: string[], msg: string) {
  await props.onRevoke?.(ids);
  list.value = list.value.filter((s) => !ids.includes(s.id));
  live.value = msg; title.value?.focus();
}
function ask() { if (dlg.value) { dlg.value.returnValue = ''; dlg.value.showModal(); } }
function closed(e: Event) {
  if ((e.target as HTMLDialogElement).returnValue === 'ok') revoke(others.value.map((s) => s.id), 'Cerraste las demás sesiones.');
}
</script>

<template>
  <main class="card" aria-labelledby="t">
    <header>
      <div>
        <h1 id="t" ref="title" tabindex="-1">Sesiones activas <span class="meta">{{ plural(list.length, 'sesión activa', 'sesiones activas') }}</span></h1>
        <p>Estos dispositivos tienen la sesión abierta. Cierra los que no reconozcas.</p>
      </div>
      <button class="btn danger" type="button" :disabled="!others.length" @click="ask">Cerrar las demás sesiones</button>
    </header>
    <ul>
      <li v-for="s in list" :key="s.id" class="row">
        <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICON[s.kind]" /></svg></span>
        <div>
          <p class="name">{{ s.name }}<span v-if="s.current" class="badge">Este dispositivo</span></p>
          <p class="meta">{{ s.detail }}</p>
          <p class="meta"><span v-if="s.current" class="dot" aria-hidden="true" />{{ s.seen }}</p>
        </div>
        <button v-if="!s.current" class="btn" type="button" :aria-label="`Cerrar sesión en ${s.name}`"
                @click="revoke([s.id], `Sesión cerrada en ${s.name}.`)">Cerrar sesión</button>
      </li>
    </ul>
    <p v-if="!others.length" class="empty">No hay otras sesiones abiertas. Tu cuenta solo está activa en este dispositivo.</p>
    <dialog ref="dlg" aria-labelledby="dt" @close="closed">
      <form method="dialog">
        <h2 id="dt">¿Cerrar {{ plural(others.length, 'sesión', 'sesiones') }}?</h2>
        <p>Se cerrará la sesión en los demás dispositivos. Tendrás que iniciar sesión de nuevo en cada uno.</p>
        <div class="actions"><button class="btn" value="cancel">Cancelar</button><button class="btn fill" value="ok">Cerrar sesiones</button></div>
      </form>
    </dialog>
    <p class="sr" role="status" aria-live="polite">{{ live }}</p>
  </main>
</template>

<style scoped>
.card{max-width:640px;margin:0 auto;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px}
h1{margin:0;font-size:18px;line-height:1.3}
h1:focus{outline:none}
header p{margin:4px 0 0;color:var(--muted);max-width:44ch}
.meta{font-variant-numeric:tabular-nums}
ul{margin:0;padding:0;list-style:none}
.row{display:grid;grid-template-columns:40px 1fr auto;align-items:center;gap:14px;padding:16px 20px;border-top:1px solid var(--border)}
.ico{display:grid;place-items:center;width:40px;height:40px;color:var(--muted);background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.ico svg{width:20px;height:20px}
.name{margin:0;font-weight:600}
.row .meta{margin:0;color:var(--muted)}
h1 .meta{margin-left:6px;font-size:14px;font-weight:400;color:var(--muted)}
.badge{margin-left:6px;padding:2px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600;vertical-align:1px}
.dot{display:inline-block;width:8px;height:8px;margin-right:6px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{font:inherit;font-weight:600;height:32px;padding:0 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover:not(:disabled){background:var(--accent-soft);border-color:var(--accent)}
.btn:disabled{color:var(--muted);cursor:not-allowed}
.btn.danger{color:var(--err)}
.btn.danger:hover:not(:disabled){background:var(--err-soft);border-color:var(--err)}
.btn.fill{height:36px;color:var(--accent-ink);background:var(--err);border-color:var(--err)}
.btn.fill:hover{background:var(--err);filter:brightness(1.08)}
.empty{margin:0;padding:20px;border-top:1px solid var(--border);color:var(--muted)}
dialog{width:min(400px,calc(100vw - 40px));padding:24px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
dialog::backdrop{background:rgba(14,23,38,.5)}
dialog h2{margin:0 0 8px;font-size:16px}
dialog p{margin:0 0 20px;color:var(--muted)}
.actions{display:flex;justify-content:flex-end;gap:8px}
.actions .btn{height:36px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:460px){.row{grid-template-columns:40px 1fr}.row .btn{grid-column:2;justify-self:start}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
