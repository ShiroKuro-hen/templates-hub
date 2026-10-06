<script setup lang="ts">
type Article = {
  titulo: string; href: string; extracto: string; etiqueta: string;
  autor: string; fecha: string; minutos: number;
};
withDefaults(defineProps<{ a?: Article }>(), {
  a: () => ({
    titulo: 'Cómo redujimos la latencia de la API un 40 %', href: '#', etiqueta: 'Ingeniería',
    extracto: 'Medimos cada salto de red, movimos la caché al borde y eliminamos consultas duplicadas. Esto es lo que aprendimos.',
    autor: 'Lucía Martín', fecha: '2026-09-28', minutos: 6,
  }),
});
const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const initials = (s: string) => s.split(' ').map((w) => w[0]).slice(0, 2).join('');
</script>

<template>
  <article class="article">
    <svg class="cover" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
      <path d="M0 40h320M0 80h320M0 120h320M80 0v160M160 0v160M240 0v160" fill="none" stroke="currentColor" stroke-opacity=".25" />
      <path d="M0 130 C60 120 90 60 150 70 S250 30 320 20" fill="none" stroke="url(#ln)" stroke-width="3" />
      <circle cx="150" cy="70" r="5" fill="currentColor" />
    </svg>
    <div class="body">
      <span class="tag">{{ a.etiqueta }}</span>
      <h3><a :href="a.href">{{ a.titulo }}</a></h3>
      <p class="excerpt">{{ a.extracto }}</p>
      <div class="meta">
        <span class="avatar" aria-hidden="true">{{ initials(a.autor) }}</span>
        <span class="author">{{ a.autor }}</span>
        <time :datetime="a.fecha">{{ fmt.format(new Date(a.fecha)) }}</time>
        <span class="read">{{ a.minutos }} min de lectura</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.article{position:relative;max-width:360px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;transition:border-color .14s;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.article:hover{border-color:var(--accent)}
.article:has(a:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.cover{display:block;width:100%;height:auto;aspect-ratio:16/8;background:var(--accent-soft);border-bottom:1px solid var(--border);color:var(--accent)}
.body{padding:16px}
.tag{display:inline-block;margin-bottom:8px;padding:1px 10px;border-radius:999px;background:var(--info-soft);color:var(--text);font-size:12px;font-weight:500}
h3{margin:0 0 6px;font-size:17px;line-height:1.3}
h3 a{color:inherit;text-decoration:none;outline:0}
h3 a::after{content:"";position:absolute;inset:0}
.article:hover h3 a{text-decoration:underline;text-underline-offset:3px}
.excerpt{margin:0 0 14px;color:var(--muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;color:var(--muted);font-size:13px}
.avatar{width:28px;height:28px;display:grid;place-items:center;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
.author{color:var(--text);font-weight:500}
.read{margin-left:auto;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
