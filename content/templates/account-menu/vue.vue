<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type Item = { label: string; d: string; kbd?: string; danger?: boolean };
const ITEMS: Item[] = [
  { label: 'Mi perfil', d: 'M16 8a4 4 0 1 0-8 0a4 4 0 1 0 8 0M4 21a8 8 0 0 1 16 0' },
  { label: 'Facturación', d: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18' },
  { label: 'Equipo', d: 'M12.5 8a3.5 3.5 0 1 0-7 0a3.5 3.5 0 1 0 7 0M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5' },
  { label: 'Atajos de teclado', kbd: '?', d: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10' },
  { label: 'Cerrar sesión', danger: true, d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' },
];
const props = withDefaults(defineProps<{ name?: string; email?: string; plan?: string; used?: number; total?: number }>(),
  { name: 'Lucía Ferrer', email: 'lucia.ferrer@norte.cloud', plan: 'Plan Business', used: 6.4, total: 10 });
const emit = defineEmits<{ select: [label: string] }>();

const open = ref(false);
const log = ref('Abre el menú desde tu avatar.');
const wrap = ref<HTMLElement | null>(null);
const btn = ref<HTMLButtonElement | null>(null);
const items = ref<HTMLButtonElement[]>([]);
const initials = computed(() => props.name.split(' ').map((w) => w[0]).join(''));

async function show(i: number) { open.value = true; await nextTick(); items.value.at(i)?.focus(); }
function trigger(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); show(e.key === 'ArrowDown' ? 0 : -1); }
}
function menu(e: KeyboardEvent) {
  const n = ITEMS.length, i = items.value.indexOf(document.activeElement as HTMLButtonElement);
  const to = ({ ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
  if (to !== undefined) { e.preventDefault(); items.value[to]?.focus(); }
  else if (e.key === 'Escape') { open.value = false; btn.value?.focus(); }
  else if (e.key === 'Tab') open.value = false;
}
function pick(it: Item) {
  log.value = it.danger ? 'Cerraste la sesión.' : `Elegiste «${it.label}».`;
  emit('select', it.label); open.value = false; btn.value?.focus();
}
const out = (e: MouseEvent) => { if (open.value && !wrap.value?.contains(e.target as Node)) open.value = false; };
onMounted(() => document.addEventListener('click', out));
onBeforeUnmount(() => document.removeEventListener('click', out));
</script>

<template>
  <main>
    <header class="bar">
      <span class="brand"><span class="logo" aria-hidden="true" />Norte Cloud</span>
      <div ref="wrap" class="wrap">
        <button ref="btn" class="trigger" type="button" aria-haspopup="menu" :aria-expanded="open" aria-controls="pop"
                @click="open ? (open = false) : show(0)" @keydown="trigger">
          <span class="avatar" aria-hidden="true">{{ initials }}</span>{{ name }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div id="pop" class="pop" :hidden="!open" @keydown="menu">
          <div class="head"><span class="avatar lg" aria-hidden="true">{{ initials }}</span><div><strong>{{ name }}</strong><span class="mail">{{ email }}</span></div></div>
          <div class="plan">
            <p><span class="badge">{{ plan }}</span><span>{{ used.toLocaleString('es') }} de {{ total }} GB</span></p>
            <div class="meter" aria-hidden="true"><i :style="{ width: `${(used / total) * 100}%` }" /></div>
          </div>
          <div role="menu" aria-label="Acciones de la cuenta">
            <template v-for="it in ITEMS" :key="it.label">
              <hr v-if="it.danger" role="separator">
              <button ref="items" class="item" :class="{ danger: it.danger }" role="menuitem" tabindex="-1" type="button" @click="pick(it)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="it.d" /></svg>
                {{ it.label }}<kbd v-if="it.kbd" aria-hidden="true">{{ it.kbd }}</kbd>
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>
    <p class="log" role="status">{{ log }}</p>
  </main>
</template>

<style scoped>
main{max-width:720px;min-height:400px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.brand{display:flex;align-items:center;gap:8px;font-weight:600}
.logo{width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.wrap{position:relative}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.trigger{font:inherit;display:flex;align-items:center;gap:8px;height:40px;padding:0 10px 0 6px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,border-color .14s}
.trigger:hover,.trigger[aria-expanded=true]{background:var(--accent-soft);border-color:var(--accent)}
.trigger svg{width:16px;height:16px;color:var(--muted);transition:transform .14s}
.trigger[aria-expanded=true] svg{transform:rotate(180deg)}
.avatar{flex:none;display:grid;place-items:center;width:28px;height:28px;border:1px solid transparent;border-radius:999px;font-size:12px;font-weight:600;color:var(--accent);background:linear-gradient(var(--accent-soft),var(--accent-soft)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.avatar.lg{width:40px;height:40px;font-size:14px}
.pop{position:absolute;right:0;top:calc(100% + 8px);z-index:10;width:280px;max-width:calc(100vw - 40px);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.pop[hidden]{display:none}
.head{display:flex;align-items:center;gap:12px;padding:16px}
.head strong{display:block}
.mail{display:block;color:var(--muted);overflow-wrap:anywhere}
.plan{padding:12px 16px;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.plan p{margin:0 0 8px;display:flex;align-items:center;justify-content:space-between;color:var(--muted);font-variant-numeric:tabular-nums}
.badge{padding:2px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
.meter{height:4px;border-radius:999px;background:var(--border);overflow:hidden}
.meter i{display:block;height:100%;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
[role=menu]{padding:6px}
hr{margin:6px 0;border:0;border-top:1px solid var(--border)}
.item{font:inherit;display:flex;align-items:center;gap:10px;width:100%;height:36px;padding:0 10px;color:var(--text);background:none;border:0;border-radius:var(--radius);text-align:left;cursor:pointer}
.item:hover,.item:focus-visible{background:var(--accent-soft)}
.item:focus-visible{outline-offset:-2px}
.item svg{width:16px;height:16px;flex:none;color:var(--muted)}
.item.danger,.item.danger svg{color:var(--err)}
kbd{margin-left:auto;padding:0 6px;font:inherit;font-size:12px;color:var(--muted);border:1px solid var(--border);border-radius:4px}
.log{margin:16px 4px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
