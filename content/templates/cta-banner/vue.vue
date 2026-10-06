<script setup lang="ts">
type Link = { label: string; href: string };

defineProps<{ title: string; text?: string; primary: Link; secondary?: Link }>();
</script>

<template>
  <section class="cta" aria-labelledby="cta-title">
    <svg class="deco" viewBox="0 0 160 160" aria-hidden="true">
      <circle cx="100" cy="60" r="56" fill="#ffd84d" stroke="#17130f" stroke-width="3" />
      <circle cx="100" cy="60" r="30" fill="none" stroke="#17130f" stroke-width="3" />
    </svg>
    <div class="txt">
      <h2 id="cta-title">{{ title }}</h2>
      <p v-if="text">{{ text }}</p>
    </div>
    <div class="row">
      <a class="btn" :href="primary.href">{{ primary.label }}</a>
      <a v-if="secondary" class="link" :href="secondary.href">{{ secondary.label }}</a>
    </div>
  </section>
</template>

<style scoped>
.cta { position: relative; overflow: hidden; display: grid; gap: 22px; align-items: center; max-width: 1040px; margin: 0 auto; padding: 32px 24px; border: 2px solid #17130f; border-radius: 10px; background: #ff5a36; color: #17130f; font: 16px/1.5 system-ui, sans-serif; box-shadow: 6px 6px 0 #17130f; }
@media (min-width: 720px) { .cta { grid-template-columns: 1fr auto; padding: 40px; } }
.deco { position: absolute; right: -30px; top: -30px; width: 160px; height: 160px; pointer-events: none; }
.txt { position: relative; max-width: 34rem; }
h2 { margin: 0 0 8px; font-size: clamp(1.7rem, 5vw, 2.6rem); line-height: 1.05; letter-spacing: -.03em; }
p { margin: 0; }
.row { position: relative; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.btn { padding: 13px 22px; border: 2px solid #17130f; border-radius: 10px; background: #17130f; color: #fffdf8; font-weight: 700; text-decoration: none; box-shadow: 4px 4px 0 #ffd84d; transition: transform .12s, box-shadow .12s; }
.btn:hover, .btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #ffd84d; }
.btn:focus-visible, .link:focus-visible { outline: 3px solid #17130f; outline-offset: 3px; }
.link { color: #17130f; font-weight: 700; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
