<script setup lang="ts">
type Member = { name: string; role: string; email: string; profile: string };

withDefaults(defineProps<{ members?: Member[] }>(), {
  members: () => [
    { name: 'Ana Pérez', role: 'Directora de producto', email: 'ana@ejemplo.com', profile: '#' },
    { name: 'Luis Gómez', role: 'Ingeniero de plataforma', email: 'luis@ejemplo.com', profile: '#' },
    { name: 'Marta Ruiz', role: 'Diseñadora de sistemas', email: 'marta@ejemplo.com', profile: '#' },
    { name: 'Carlos Díaz', role: 'Responsable de seguridad', email: 'carlos@ejemplo.com', profile: '#' },
  ],
});
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
</script>

<template>
  <section class="team" aria-labelledby="team-title">
    <h2 id="team-title">Las personas detrás del producto</h2>
    <p class="lead">Un equipo pequeño que diseña, construye y opera la plataforma. Escríbenos directamente.</p>
    <ul class="grid">
      <li v-for="m in members" :key="m.email" class="member">
        <span class="avatar" aria-hidden="true">{{ initials(m.name) }}</span>
        <div><h3>{{ m.name }}</h3><p>{{ m.role }}</p></div>
        <div class="links">
          <a :href="`mailto:${m.email}`" :aria-label="`Escribir a ${m.name}`">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </a>
          <a :href="m.profile" :aria-label="`Perfil profesional de ${m.name}`">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></svg>
          </a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.team{max-width:1040px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.team h2{margin:0;font-size:22px;line-height:1.25}
.team .lead{margin:4px 0 20px;color:var(--muted);max-width:60ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;margin:0;padding:0;list-style:none}
.member{display:flex;flex-direction:column;gap:12px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.avatar{display:grid;place-items:center;width:48px;height:48px;box-sizing:border-box;border:1px solid transparent;border-radius:50%;font-weight:600;font-size:16px;color:var(--text);
        background:linear-gradient(var(--accent-soft),var(--accent-soft)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.member h3{margin:0;font-size:15px}
.member p{margin:0;color:var(--muted)}
.links{display:flex;gap:6px;margin-top:auto}
.links a{display:grid;place-items:center;width:32px;height:32px;box-sizing:border-box;color:var(--muted);border:1px solid var(--border);border-radius:var(--radius);transition:color .14s,border-color .14s}
.links a:hover{color:var(--accent);border-color:var(--accent)}
.links a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
