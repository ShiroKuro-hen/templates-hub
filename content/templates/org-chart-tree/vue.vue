<script setup lang="ts">
import { reactive } from 'vue';

type Persona = { id: string; nombre: string; cargo: string; iniciales: string; equipo?: Persona[] };

const raiz: Persona = {
  id: 'lr', nombre: 'Lucía Ruiz', cargo: 'Directora general', iniciales: 'LR', equipo: [
    { id: 'mv', nombre: 'Marcos Vega', cargo: 'Dirección de producto', iniciales: 'MV', equipo: [
      { id: 'sn', nombre: 'Sofía Navarro', cargo: 'Gestora de diseño', iniciales: 'SN' },
      { id: 'ip', nombre: 'Iván Pérez', cargo: 'Gestor de ingeniería', iniciales: 'IP' },
    ] },
    { id: 'et', nombre: 'Elena Torres', cargo: 'Dirección comercial', iniciales: 'ET', equipo: [
      { id: 'cm', nombre: 'Carla Méndez', cargo: 'Responsable de ventas', iniciales: 'CM' },
      { id: 'jo', nombre: 'Javier Ortiz', cargo: 'Responsable de cuentas', iniciales: 'JO' },
    ] },
  ],
};

const abierto = reactive<Record<string, boolean>>({ lr: true, mv: true, et: true });
const alternar = (id: string) => { abierto[id] = !abierto[id]; };
</script>

<template>
  <section class="card" aria-labelledby="org-t">
    <h1 id="org-t">Organigrama</h1>
    <ul class="org">
      <li>
        <div class="node">
          <span class="av" aria-hidden="true">{{ raiz.iniciales }}</span>
          <div class="who"><b>{{ raiz.nombre }}</b><span>{{ raiz.cargo }}</span></div>
          <button class="tg" type="button" :aria-expanded="abierto.lr" aria-controls="eq-lr" :aria-label="`Equipo de ${raiz.nombre}`" @click="alternar('lr')">
            <span class="chev" aria-hidden="true" />
          </button>
        </div>
        <ul id="eq-lr" class="kids" :hidden="!abierto.lr">
          <li v-for="d in raiz.equipo" :key="d.id">
            <div class="node">
              <span class="av" aria-hidden="true">{{ d.iniciales }}</span>
              <div class="who"><b>{{ d.nombre }}</b><span>{{ d.cargo }}</span></div>
              <button class="tg" type="button" :aria-expanded="abierto[d.id]" :aria-controls="`eq-${d.id}`" :aria-label="`Equipo de ${d.nombre}`" @click="alternar(d.id)">
                <span class="chev" aria-hidden="true" />
              </button>
            </div>
            <ul :id="`eq-${d.id}`" class="kids" :hidden="!abierto[d.id]">
              <li v-for="p in d.equipo" :key="p.id">
                <div class="node">
                  <span class="av" aria-hidden="true">{{ p.iniciales }}</span>
                  <div class="who"><b>{{ p.nombre }}</b><span>{{ p.cargo }}</span></div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style scoped>
[hidden]{display:none!important}
ul{list-style:none;margin:0;padding:0}
.card{max-width:440px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0 0 12px;font-size:16px;font-weight:600}
.kids{padding-left:20px}
.kids>li{position:relative;padding-top:10px}
.kids>li::before{content:"";position:absolute;left:-20px;top:38px;width:20px;border-top:1px solid var(--border)}
.kids>li::after{content:"";position:absolute;left:-20px;top:0;bottom:0;width:1px;background:var(--border)}
.kids>li:last-child::after{bottom:auto;height:38px}
.node{display:flex;align-items:center;gap:12px;height:56px;padding:0 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.av{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff));color:var(--accent-ink);font-size:13px;font-weight:600}
.who{flex:1;min-width:0}
.who b,.who span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.who b{font-weight:600}
.who span{color:var(--muted);font-size:13px}
.tg{flex:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:1px solid var(--border);border-radius:min(var(--radius),6px);background:var(--surface);cursor:pointer;transition:border-color .14s}
.tg:hover{border-color:var(--accent)}
.tg:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.chev{width:7px;height:7px;border:solid var(--muted);border-width:0 2px 2px 0;transform:rotate(45deg);transition:transform .14s}
.tg[aria-expanded=false] .chev{transform:rotate(-45deg)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
