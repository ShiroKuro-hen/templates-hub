<script setup lang="ts">
type Cta = { label: string; href: string };

defineProps<{
  badge?: string;
  title: string;
  subtitle: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
}>();
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div>
      <p v-if="badge" class="badge">{{ badge }}</p>
      <h1 id="hero-title">{{ title }}</h1>
      <p class="sub">{{ subtitle }}</p>
      <div class="row">
        <a class="btn main" :href="primary.href">{{ primary.label }}</a>
        <a v-if="secondary" class="btn" :href="secondary.href">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg>
          {{ secondary.label }}
        </a>
      </div>
      <p v-if="note" class="note">{{ note }}</p>
    </div>
    <svg class="art" viewBox="0 0 320 260" role="img" aria-label="Tablero de tareas con tres columnas">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#22d3ee" />
          <stop offset="1" stop-color="#2f5bff" />
        </linearGradient>
      </defs>
      <rect class="win" x="6" y="6" width="308" height="244" rx="10" />
      <rect v-for="x in [18, 115, 212]" :key="x" class="col" :x="x" y="56" width="90" height="182" rx="8" />
      <rect class="hot" x="26" y="112" width="74" height="46" rx="6" />
      <rect class="card" x="123" y="68" width="74" height="50" rx="6" />
      <circle cx="268" cy="52" r="22" fill="url(#hg)" />
      <path d="M258 52l7 7 13-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </section>
</template>

<style scoped>
.hero { display: grid; gap: 40px; align-items: center; max-width: 1040px; margin: 0 auto; padding: 32px 0; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
@media (min-width: 720px) { .hero { grid-template-columns: 1.1fr 1fr; padding: 48px 0; } }
.badge { display: inline-block; margin: 0 0 20px; padding: 4px 12px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); color: var(--muted); font-size: .85rem; font-weight: 500; }
h1 { margin: 0 0 16px; font-size: clamp(2.1rem, 6vw, 3.6rem); font-weight: 700; line-height: 1.05; letter-spacing: -.03em; text-wrap: balance; }
.sub { margin: 0 0 32px; max-width: 46ch; color: var(--muted); font-size: 1.1rem; line-height: 1.55; }
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.btn { display: inline-flex; gap: 8px; align-items: center; padding: 11px 20px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); font-weight: 600; font-size: 1rem; text-decoration: none; transition: filter .14s, border-color .14s, transform .14s; }
.btn:hover { border-color: var(--muted); }
.btn.main { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); box-shadow: var(--shadow); }
.btn.main:hover { filter: brightness(1.08); }
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.note { margin: 16px 0 0; color: var(--muted); font-size: .85rem; }
.art { width: 100%; height: auto; overflow: visible; }
.art .win, .art .card { fill: var(--surface); stroke: var(--border); }
.art .col { fill: var(--bg); stroke: var(--border); }
.art .hot { fill: var(--accent-soft); stroke: var(--accent); }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
