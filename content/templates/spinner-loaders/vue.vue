<script setup lang="ts">
type Variant = 'ring' | 'dots' | 'bars';

withDefaults(defineProps<{ variant?: Variant; label?: string }>(), { variant: 'ring', label: 'Cargando' });
const PARTS: Record<Variant, number> = { ring: 0, dots: 3, bars: 5 };
</script>

<template>
  <div :class="['spinner', variant]" role="status">
    <i v-for="n in PARTS[variant]" :key="n" />
    <span class="sr">{{ label }}</span>
  </div>
</template>

<style scoped>
.sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }

.ring { width:40px; height:40px; border:4px solid var(--accent-soft); border-top-color:var(--accent); border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.dots { display:flex; gap:8px; align-items:flex-end; height:28px; }
.dots i { width:10px; height:10px; background:var(--accent); border-radius:50%; animation:hop .6s ease-in-out infinite alternate; }
.dots i:nth-child(2) { animation-delay:.15s; opacity:.75; }
.dots i:nth-child(3) { animation-delay:.3s; opacity:.5; }
@keyframes hop { to { transform:translateY(-14px); } }

.bars { display:flex; gap:4px; align-items:center; height:40px; }
.bars i { width:5px; height:100%; background:linear-gradient(180deg,#22d3ee,#2f5bff); border-radius:3px; animation:stretch 1s ease-in-out infinite; }
.bars i:nth-child(2) { animation-delay:.1s; } .bars i:nth-child(3) { animation-delay:.2s; }
.bars i:nth-child(4) { animation-delay:.3s; } .bars i:nth-child(5) { animation-delay:.4s; }
@keyframes stretch { 0%, 100% { transform:scaleY(.3); } 50% { transform:scaleY(1); } }

@media (prefers-reduced-motion:reduce) { .ring, .dots i, .bars i { animation-duration:3s; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
