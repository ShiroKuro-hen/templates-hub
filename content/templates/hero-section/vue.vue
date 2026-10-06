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
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg>
          {{ secondary.label }}
        </a>
      </div>
      <p v-if="note" class="note">{{ note }}</p>
    </div>
    <svg class="art" viewBox="0 0 320 260" role="img" aria-label="Tablero de tareas con tres columnas">
      <rect x="14" y="14" width="296" height="236" rx="12" fill="#17130f" />
      <rect x="6" y="6" width="296" height="236" rx="12" fill="#fffdf8" stroke="#17130f" stroke-width="3" />
      <path d="M6 42h296" stroke="#17130f" stroke-width="3" />
      <rect v-for="x in [20, 113, 206]" :key="x" :x="x" y="58" width="82" height="170" rx="8" fill="#f6f1e7" stroke="#17130f" stroke-width="3" />
      <rect x="28" y="112" width="66" height="44" rx="6" fill="#ffd84d" stroke="#17130f" stroke-width="3" />
      <rect x="121" y="128" width="66" height="34" rx="6" fill="#3b5bfd" stroke="#17130f" stroke-width="3" />
      <circle cx="268" cy="52" r="26" fill="#1f9d55" stroke="#17130f" stroke-width="3" />
      <path d="M256 52l9 9 16-18" fill="none" stroke="#fffdf8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </section>
</template>

<style scoped>
.hero { display: grid; gap: 28px; align-items: center; max-width: 1040px; margin: 0 auto; padding: 36px 20px; color: #17130f; font: 16px/1.5 system-ui, sans-serif; }
@media (min-width: 640px) { .hero { grid-template-columns: 1.15fr 1fr; padding: 44px 32px; } }
.badge { display: inline-flex; margin: 0 0 16px; padding: 4px 12px; border: 2px solid #17130f; border-radius: 99px; background: #ffd84d; font: 600 .75rem ui-monospace, monospace; }
h1 { margin: 0 0 14px; font-size: clamp(2rem, 6.2vw, 3.4rem); line-height: 1.02; letter-spacing: -.03em; }
.sub { margin: 0 0 24px; max-width: 46ch; color: #6b6258; font-size: 1.05rem; }
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.btn { display: inline-flex; gap: 8px; align-items: center; padding: 12px 20px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; color: #17130f; font-weight: 700; text-decoration: none; box-shadow: 4px 4px 0 #17130f; transition: transform .12s, box-shadow .12s; }
.btn.main { background: #ff5a36; }
.btn:hover, .btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
.btn:focus-visible { outline: 3px solid #ff5a36; outline-offset: 3px; }
.note { margin: 16px 0 0; color: #6b6258; font-size: .85rem; }
.art { width: 100%; height: auto; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
