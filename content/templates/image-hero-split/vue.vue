<script setup lang="ts">
type Cta = { label: string; href: string };

defineProps<{
  pill: string;
  title: string;
  subtitle: string;
  primary: Cta;
  secondary: Cta;
  note: string;
  floatTitle: string;
  floatText: string;
}>();
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="copy">
      <p class="pill">{{ pill }}</p>
      <h1 id="hero-title">{{ title }}</h1>
      <p class="sub">{{ subtitle }}</p>
      <div class="row">
        <a class="btn main" :href="primary.href">{{ primary.label }}</a>
        <a class="btn" :href="secondary.href">{{ secondary.label }}</a>
      </div>
      <p class="note">{{ note }}</p>
    </div>
    <figure class="frame">
      <div class="pic">
        <img src="/stock/isla-blanca.webp" alt="Pueblo blanco de una isla griega junto al mar" width="800" height="533" fetchpriority="high" />
      </div>
      <div class="float">
        <i aria-hidden="true">✓</i>
        <span><b>{{ floatTitle }}</b><small>{{ floatText }}</small></span>
      </div>
    </figure>
  </section>
</template>

<style scoped>
.hero { display: grid; gap: 40px; align-items: center; max-width: 1040px; margin: 0 auto; padding: clamp(24px, 5vw, 56px); background: linear-gradient(160deg, var(--accent-soft), var(--surface) 70%); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
@media (min-width: 768px) { .hero { grid-template-columns: 1fr 1fr; } .frame { order: 0; } }
.copy { min-width: 0; }
.frame { position: relative; order: -1; margin: 0; }
.pill { display: inline-block; margin: 0 0 20px; padding: 4px 12px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); color: var(--muted); font-size: .85rem; font-weight: 500; }
h1 { margin: 0 0 16px; font-size: clamp(2rem, 5.5vw, 3.4rem); font-weight: 700; line-height: 1.08; letter-spacing: -.03em; text-wrap: balance; }
.sub { margin: 0 0 28px; max-width: 46ch; color: var(--muted); font-size: 1.08rem; line-height: 1.55; }
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.btn { display: inline-flex; align-items: center; padding: 11px 20px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); font-weight: 600; font-size: 1rem; text-decoration: none; transition: filter .14s, border-color .14s; }
.btn:hover { border-color: var(--muted); }
.btn.main { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); box-shadow: var(--shadow); }
.btn.main:hover { filter: brightness(1.08); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.note { margin: 16px 0 0; color: var(--muted); font-size: .85rem; }
.pic { padding: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.pic img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: min(var(--radius), 6px); }
.float { position: absolute; left: -14px; bottom: 28px; display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.float i { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-2, #22d3ee), var(--accent, #2f5bff)); color: var(--accent-ink); font-style: normal; font-weight: 700; }
.float b { display: block; font-weight: 600; }
.float small { color: var(--muted); font-size: 12px; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
