<script setup lang="ts">
import { computed, ref } from 'vue';

const profile = { name: 'Valeria Montoya', handle: '@valeriamontoya', place: 'Lima, Perú', posts: 248, followers: 12480, following: 312,
  bio: 'Diseñadora de producto en Nimbus. Escribo sobre sistemas de diseño, accesibilidad y trabajo en equipo.' };
const on = ref(false);
const status = ref('');
const initials = profile.name.split(' ').map((w) => w[0]).join('');
const fmt = (n: number) => n.toLocaleString('es');
const followers = computed(() => fmt(profile.followers + (on.value ? 1 : 0)));

function toggle() {
  on.value = !on.value;
  status.value = on.value ? `Ahora sigues a ${profile.name}` : `Dejaste de seguir a ${profile.name}`;
}
</script>

<template>
  <article class="card" aria-labelledby="n">
    <svg class="cover" viewBox="0 0 800 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient>
        <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".18" /></pattern>
      </defs>
      <rect width="800" height="150" fill="url(#g)" />
      <rect width="800" height="150" fill="url(#p)" />
      <circle cx="640" cy="40" r="90" fill="none" stroke="#fff" stroke-opacity=".3" />
      <circle cx="640" cy="40" r="52" fill="none" stroke="#fff" stroke-opacity=".3" />
      <circle cx="640" cy="40" r="6" fill="#fff" fill-opacity=".8" />
    </svg>
    <div class="main">
      <div class="top">
        <span class="av" aria-hidden="true">{{ initials }}</span>
        <div class="acts">
          <button type="button">Enviar mensaje</button>
          <button type="button" :class="{ pri: !on }" @click="toggle">{{ on ? 'Siguiendo' : 'Seguir' }}</button>
        </div>
      </div>
      <h1 id="n">
        {{ profile.name }}
        <svg class="ver" viewBox="0 0 24 24" role="img" aria-label="Cuenta verificada">
          <path fill="currentColor" d="M12 2l2.4 1.8 3-.2 1 2.8 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8-2.5-1.7.9-2.9-.9-2.9 2.5-1.7 1-2.8 3 .2z" />
          <path fill="none" stroke="var(--accent-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 12.5l2.6 2.6L16 9.5" />
        </svg>
      </h1>
      <p class="handle">{{ profile.handle }}</p>
      <p class="bio">{{ profile.bio }}</p>
      <p class="loc">{{ profile.place }}</p>
      <dl>
        <div><dt>Publicaciones</dt><dd>{{ fmt(profile.posts) }}</dd></div>
        <div><dt>Seguidores</dt><dd>{{ followers }}</dd></div>
        <div><dt>Siguiendo</dt><dd>{{ fmt(profile.following) }}</dd></div>
      </dl>
      <p class="sr" role="status">{{ status }}</p>
    </div>
  </article>
</template>

<style scoped>
.card{max-width:640px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.cover{display:block;width:100%;height:150px}
.main{padding:0 20px 20px}
.top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:-44px}
.av{display:grid;place-items:center;width:88px;height:88px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:28px;font-weight:600;box-shadow:0 0 0 4px var(--surface)}
.acts{display:flex;gap:8px}
button{font:inherit;font-weight:600;padding:8px 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,filter .14s}
button:hover{background:var(--accent-soft)}
button.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
button.pri:hover{filter:brightness(1.08);background:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
h1{display:flex;align-items:center;gap:6px;margin:12px 0 0;font-size:20px;line-height:1.3}
.ver{width:18px;height:18px;color:var(--accent)}
.handle{margin:0;color:var(--muted)}
.bio{margin:10px 0;max-width:60ch}
.loc{margin:0;color:var(--muted)}
dl{display:flex;flex-wrap:wrap;gap:8px 28px;margin:16px 0 0;padding-top:16px;border-top:1px solid var(--border)}
dl div{display:flex;flex-direction:column-reverse}
dt{color:var(--muted);font-size:13px}
dd{margin:0;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
