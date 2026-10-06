<script setup lang="ts">
import { computed, ref } from 'vue';

type Tipo = 'add' | 'chg' | 'fix';
type Release = { v: string; fecha: string; texto: string; cambios: [Tipo, string][] };

const etiqueta: Record<Tipo, string> = { add: 'Añadido', chg: 'Cambiado', fix: 'Corregido' };
const releases: Release[] = [
  { v: '2.4.0', fecha: '2026-09-18', texto: '18 de septiembre de 2026', cambios: [
    ['add', 'Exportación de informes a CSV y Excel.'], ['add', 'Etiquetas personalizadas en los proyectos.'],
    ['chg', 'El panel carga un 40 % más rápido.'], ['fix', 'Los filtros ya no se pierden al recargar la página.'],
  ] },
  { v: '2.3.2', fecha: '2026-09-02', texto: '2 de septiembre de 2026', cambios: [
    ['fix', 'Error al restablecer la contraseña con caracteres especiales.'], ['fix', 'Las fechas usan la zona horaria de cada persona.'],
  ] },
  { v: '2.3.0', fecha: '2026-08-12', texto: '12 de agosto de 2026', cambios: [
    ['add', 'Modo oscuro en toda la aplicación.'], ['chg', 'Nuevo diseño de la página de facturación.'],
    ['chg', 'Los enlaces de invitación caducan a los 7 días.'],
  ] },
];
const f = ref<'all' | Tipo>('all');
const visibles = computed(() =>
  releases
    .map((r) => ({ ...r, cambios: r.cambios.filter(([t]) => f.value === 'all' || t === f.value) }))
    .filter((r) => r.cambios.length),
);
</script>

<template>
  <div class="cl">
    <h1>Novedades del producto</h1>
    <fieldset>
      <legend>Filtrar por tipo de cambio</legend>
      <label v-for="k in (['all', 'add', 'chg', 'fix'] as const)" :key="k" class="f">
        <input v-model="f" type="radio" name="f" :value="k" />{{ k === 'all' ? 'Todo' : etiqueta[k] }}
      </label>
    </fieldset>
    <ol>
      <li v-for="r in visibles" :key="r.v" class="rel" :class="{ last: r.v === releases[0].v }">
        <h2>{{ r.v }}</h2><time :datetime="r.fecha">{{ r.texto }}</time>
        <ul>
          <li v-for="[t, txt] in r.cambios" :key="txt" :data-t="t"><span class="tag">{{ etiqueta[t] }}</span>{{ txt }}</li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.cl{max-width:680px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0 0 12px;font-size:24px;line-height:1.2}
fieldset{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 24px;padding:0;border:0}
legend{padding:0;margin-bottom:8px;font-weight:600}
.f{position:relative;padding:4px 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:border-color .14s,background .14s}
.f:hover{border-color:var(--accent)}
.f input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.f:has(:checked){background:var(--accent-soft);border-color:var(--accent);color:var(--accent);font-weight:600}
.f:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
ol,ul{list-style:none;margin:0;padding:0}
ol{margin-left:5px;border-left:1px solid var(--border)}
.rel{position:relative;padding:0 0 28px 24px}
.rel:last-child{padding-bottom:0}
.rel::before{content:"";position:absolute;left:-6px;top:6px;width:11px;height:11px;border-radius:999px;background:var(--surface);border:1px solid var(--muted)}
.rel.last::before{border-color:transparent;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.rel h2{display:inline;margin:0;font-size:18px;font-variant-numeric:tabular-nums}
.rel time{margin-left:10px;color:var(--muted)}
.rel ul{margin-top:10px}
.rel li{display:flex;align-items:baseline;gap:10px;padding:4px 0}
.tag{flex:none;width:84px;box-sizing:border-box;display:inline-flex;align-items:center;gap:6px;padding:0 8px;font-size:12px;font-weight:600;background:var(--ts);border-radius:999px}
.tag::before{content:"";width:6px;height:6px;border-radius:999px;background:var(--tc)}
[data-t=add]{--tc:var(--ok);--ts:var(--ok-soft)}
[data-t=chg]{--tc:var(--info);--ts:var(--info-soft)}
[data-t=fix]{--tc:var(--warn);--ts:var(--warn-soft)}
@media (max-width:420px){.cl{padding:16px}.rel li{flex-direction:column;gap:2px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
