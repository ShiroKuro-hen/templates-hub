<script setup lang="ts">
import { ref } from 'vue';

type Status = 'ok' | 'warn' | 'err';
type ApiKey = { id: string; name: string; scope: string; secret: string; used: string; status: Status };

const LABEL: Record<Status, string> = { ok: 'Activa', warn: 'Sin uso reciente', err: 'Revocada' };
const props = withDefaults(defineProps<{ initial?: ApiKey[]; onRevoke?: (id: string) => Promise<void> }>(), {
  initial: () => [
    { id: '1', name: 'Producción web', scope: 'Lectura y escritura', secret: 'sk_live_8f3a91c2d7e04b5a6c1f', used: 'Hace 3 minutos', status: 'ok' },
    { id: '2', name: 'Panel de métricas', scope: 'Solo lectura', secret: 'sk_live_2b7d40e9a1c85f36d0a4', used: 'Ayer', status: 'ok' },
    { id: '3', name: 'Integración de facturación', scope: 'Facturación', secret: 'sk_live_c19e5a7f0b3d8246e1f9', used: 'Hace 41 días', status: 'warn' },
    { id: '4', name: 'Pruebas de CI', scope: 'Lectura y escritura', secret: 'sk_test_5d0a8e3c7b1f49a2e6d4', used: 'Hace 2 horas', status: 'ok' },
  ],
});
const mask = (s: string) => `${s.slice(0, s.lastIndexOf('_') + 1)}••••••••${s.slice(-4)}`;
const keys = ref<ApiKey[]>([...props.initial]);
const target = ref<ApiKey | null>(null);
const copied = ref<string | null>(null);
const live = ref('');
const dlg = ref<HTMLDialogElement | null>(null);
const title = ref<HTMLElement | null>(null);

async function copy(k: ApiKey) {
  try { await navigator.clipboard.writeText(k.secret); copied.value = k.id; live.value = 'Clave copiada.'; } catch { /* sin permiso */ }
  setTimeout(() => (copied.value = null), 1600);
}
function ask(k: ApiKey) {
  target.value = k;
  if (dlg.value) { dlg.value.returnValue = ''; dlg.value.showModal(); }
}
async function closed(e: Event) {
  const t = target.value;
  if ((e.target as HTMLDialogElement).returnValue !== 'ok' || !t) return;
  await props.onRevoke?.(t.id);
  keys.value = keys.value.map((k) => (k.id === t.id ? { ...k, status: 'err' } : k));
  live.value = `Clave «${t.name}» revocada.`; title.value?.focus();
}
</script>

<template>
  <main class="card" aria-labelledby="h">
    <header><h1 id="h" ref="title" tabindex="-1">Claves API</h1><p>Trata las claves como contraseñas. Revoca las que ya no uses.</p></header>
    <div class="scroll">
      <table>
        <caption class="sr">Claves API del proyecto Norte Cloud</caption>
        <thead><tr><th scope="col">Nombre</th><th scope="col">Clave</th><th scope="col">Último uso</th><th scope="col">Estado</th><th scope="col"><span class="sr">Acciones</span></th></tr></thead>
        <tbody>
          <tr v-for="k in keys" :key="k.id" :class="{ revoked: k.status === 'err' }">
            <td>{{ k.name }}<small>{{ k.scope }}</small></td>
            <td><code>{{ mask(k.secret) }}</code></td>
            <td>{{ k.used }}</td>
            <td><span class="badge" :class="k.status">{{ LABEL[k.status] }}</span></td>
            <td class="acts">
              <template v-if="k.status !== 'err'">
                <button class="btn" type="button" :aria-label="`Copiar clave de ${k.name}`" @click="copy(k)">{{ copied === k.id ? 'Copiado' : 'Copiar' }}</button>
                <button class="btn danger" type="button" :aria-label="`Revocar clave de ${k.name}`" @click="ask(k)">Revocar</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <dialog ref="dlg" aria-labelledby="dt" @close="closed">
      <form method="dialog">
        <h2 id="dt">¿Revocar «{{ target?.name }}»?</h2>
        <p>Las apps que usen esta clave dejarán de funcionar de inmediato. No se puede deshacer.</p>
        <div class="actions"><button class="btn" value="cancel">Cancelar</button><button class="btn fill" value="ok">Revocar clave</button></div>
      </form>
    </dialog>
    <p class="sr" role="status" aria-live="polite">{{ live }}</p>
  </main>
</template>

<style scoped>
.card{max-width:860px;margin:0 auto;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:20px}
h1{margin:0;font-size:18px;line-height:1.3}
h1:focus{outline:none}
header p{margin:4px 0 0;color:var(--muted)}
.scroll{overflow-x:auto;border-top:1px solid var(--border)}
table{width:100%;min-width:640px;border-collapse:collapse}
th,td{padding:12px 16px;text-align:left;vertical-align:middle;border-bottom:1px solid var(--border)}
tbody tr:last-child td{border-bottom:0}
th{font-weight:600;color:var(--muted);white-space:nowrap}
td small{display:block;color:var(--muted)}
code{font:13px ui-monospace,"Cascadia Code",Menlo,monospace;white-space:nowrap}
.acts{text-align:right;white-space:nowrap}
.acts .btn+.btn{margin-left:6px}
tr.revoked td{color:var(--muted)}
tr.revoked code{text-decoration:line-through}
.badge{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
.badge::before{content:"";width:8px;height:8px;border-radius:999px;background:currentColor}
.badge.ok{background:var(--ok-soft)}
.badge.ok::before{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.badge.warn{background:var(--warn-soft)}
.badge.warn::before{background:var(--warn)}
.badge.err{background:var(--err-soft)}
.badge.err::before{background:var(--err)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{font:inherit;font-weight:600;height:32px;padding:0 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn.danger{color:var(--err)}
.btn.danger:hover{background:var(--err-soft);border-color:var(--err)}
.btn.fill{height:36px;color:var(--accent-ink);background:var(--err);border-color:var(--err)}
.btn.fill:hover{background:var(--err);filter:brightness(1.08)}
dialog{width:min(420px,calc(100vw - 40px));padding:24px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
dialog::backdrop{background:rgba(14,23,38,.5)}
dialog h2{margin:0 0 8px;font-size:16px}
dialog p{margin:0 0 20px;color:var(--muted)}
.actions{display:flex;justify-content:flex-end;gap:8px}
.actions .btn{height:36px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
