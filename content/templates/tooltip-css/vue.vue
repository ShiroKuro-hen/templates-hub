<script setup lang="ts">
import { useId } from 'vue';

// Tooltip solo CSS: Vue solo conecta aria-describedby con el role="tooltip".
defineProps<{ tip: string; below?: boolean }>();
const id = useId();
</script>

<template>
  <span :class="['tip', { below }]">
    <button type="button" class="btn" :aria-describedby="id"><slot /></button>
    <span role="tooltip" :id="id">{{ tip }}</span>
  </span>
</template>

<style scoped>
.btn { font:600 14px system-ui, sans-serif; padding:8px 14px; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.btn:hover { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.tip { position:relative; display:inline-block; }
.tip [role="tooltip"] { position:absolute; left:50%; bottom:calc(100% + 8px); z-index:10; width:max-content; max-width:200px; padding:6px 10px; font:13px/1.35 system-ui, sans-serif; text-align:center; color:#f6f1e7; background:#17130f; border-radius:8px; opacity:0; visibility:hidden; transform:translate(-50%, 4px); transition:opacity .15s, transform .15s, visibility 0s .15s; }
.tip [role="tooltip"]::after { content:""; position:absolute; left:50%; top:100%; margin-left:-6px; border:6px solid transparent; border-top-color:#17130f; }
.tip [role="tooltip"]::before { content:""; position:absolute; left:0; right:0; top:100%; height:8px; }
.tip.below [role="tooltip"] { bottom:auto; top:calc(100% + 8px); transform:translate(-50%, -4px); }
.tip.below [role="tooltip"]::after { top:auto; bottom:100%; border-top-color:transparent; border-bottom-color:#17130f; }
.tip.below [role="tooltip"]::before { top:auto; bottom:100%; }
.tip:hover [role="tooltip"], .tip:has(:focus-visible) [role="tooltip"] { opacity:1; visibility:visible; transform:translate(-50%, 0); transition-delay:0s; }
@media (prefers-reduced-motion:reduce) { .tip [role="tooltip"] { transition:none; } }
</style>
