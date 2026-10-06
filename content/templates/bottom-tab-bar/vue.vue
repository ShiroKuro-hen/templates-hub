<script setup lang="ts">
type Tab = { id: string; label: string; href: string; icon: string; badge?: number }; // icon: contenido SVG (paths)

const props = withDefaults(defineProps<{ tabs?: Tab[]; current: string }>(), {
  tabs: () => [
    { id: 'inicio', label: 'Inicio', href: '/', icon: '<path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z"/>' },
    { id: 'buscar', label: 'Buscar', href: '/buscar', icon: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>' },
    { id: 'pedidos', label: 'Pedidos', href: '/pedidos', icon: '<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10"/>' },
    { id: 'mensajes', label: 'Mensajes', href: '/mensajes', icon: '<path d="M4 5h16v11H9l-5 4z"/>', badge: 3 },
    { id: 'perfil', label: 'Perfil', href: '/perfil', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>' },
  ],
});
const emit = defineEmits<{ navigate: [id: string] }>();
</script>

<template>
  <nav aria-label="Principal">
    <ul class="tabs">
      <li v-for="t in props.tabs" :key="t.id">
        <a :href="t.href" :aria-current="t.id === current ? 'page' : undefined" @click.prevent="emit('navigate', t.id)">
          <span class="ico">
            <!-- v-html solo con iconos propios, nunca con datos del usuario -->
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="t.icon" />
            <span v-if="t.badge" class="badge" aria-hidden="true">{{ t.badge > 99 ? '99+' : t.badge }}</span>
          </span>
          {{ t.label }}
          <span v-if="t.badge" class="sr">, {{ t.badge }} sin leer</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tabs{display:grid;grid-template-columns:repeat(5,1fr);margin:0;padding:0 4px env(safe-area-inset-bottom);list-style:none;border-top:1px solid var(--border);background:var(--surface);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.tabs a{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;min-height:56px;padding:8px 2px 6px;box-sizing:border-box;font-size:11px;font-weight:500;color:var(--muted);text-decoration:none;transition:color .14s}
.tabs a:hover{color:var(--text)}
.tabs a:focus-visible{outline:2px solid var(--accent);outline-offset:-2px;border-radius:6px}
.tabs a[aria-current=page]{color:var(--accent);font-weight:600}
.tabs a[aria-current=page]::before{content:"";position:absolute;top:-1px;left:30%;right:30%;height:2px;border-radius:0 0 999px 999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.ico{position:relative;display:grid;place-items:center;width:24px;height:24px}
.badge{position:absolute;top:-4px;left:14px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;font-size:10px;font-weight:700;line-height:16px;text-align:center;font-variant-numeric:tabular-nums;color:var(--accent-ink);background:var(--err);box-shadow:0 0 0 2px var(--surface)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
