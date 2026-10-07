<script setup lang="ts">
import { reactive, computed } from 'vue';

const canales = ['Correo', 'Push', 'SMS'] as const;
type Canal = (typeof canales)[number];
type Evento = { id: string; nombre: string; detalle: string; bloqueado?: Canal };

const eventos: Evento[] = [
  { id: 'menciones', nombre: 'Menciones', detalle: 'Cuando alguien te menciona con @.' },
  { id: 'comentarios', nombre: 'Comentarios', detalle: 'Respuestas en los hilos que sigues.' },
  { id: 'asignaciones', nombre: 'Asignaciones', detalle: 'Tareas que te asignan o reasignan.' },
  { id: 'resumen', nombre: 'Resumen semanal', detalle: 'Cada lunes a las 9:00.' },
  { id: 'seguridad', nombre: 'Alertas de seguridad', detalle: 'Inicios de sesión y cambios de contraseña.', bloqueado: 'Correo' },
];
const on = reactive<Record<string, Record<Canal, boolean>>>({
  menciones: { Correo: true, Push: true, SMS: false },
  comentarios: { Correo: true, Push: true, SMS: false },
  asignaciones: { Correo: true, Push: false, SMS: false },
  resumen: { Correo: true, Push: false, SMS: false },
  seguridad: { Correo: true, Push: true, SMS: false },
});
const total = computed(() => eventos.reduce((n, e) => n + canales.filter((c) => on[e.id][c]).length, 0));
const libres = (c: Canal) => eventos.filter((e) => e.bloqueado !== c);
const marcadas = (c: Canal) => libres(c).filter((e) => on[e.id][c]).length;
const alternarColumna = (c: Canal, v: boolean) => libres(c).forEach((e) => (on[e.id][c] = v));
const indeterminado = (el: unknown, c: Canal) => { if (el) (el as HTMLInputElement).indeterminate = marcadas(c) > 0 && marcadas(c) < libres(c).length; };
</script>

<template>
  <section class="card" aria-labelledby="np-titulo">
    <header>
      <h2 id="np-titulo">Preferencias de notificación</h2>
      <p class="sum" aria-live="polite"><b>{{ total }}</b> de {{ eventos.length * canales.length }} activadas</p>
    </header>
    <div class="scroll">
      <table>
        <caption hidden>Elige por qué canal recibes cada tipo de aviso.</caption>
        <thead>
          <tr>
            <th scope="col">Evento</th>
            <th v-for="c in canales" :key="c" scope="col">
              <label>
                {{ c }}
                <input type="checkbox" :aria-label="`Activar todo por ${c}`" :checked="marcadas(c) === libres(c).length"
                       :ref="(el) => indeterminado(el, c)" @change="alternarColumna(c, ($event.target as HTMLInputElement).checked)">
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in eventos" :key="e.id">
            <th scope="row">{{ e.nombre }}<span>{{ e.detalle }}</span></th>
            <td v-for="c in canales" :key="c">
              <input v-model="on[e.id][c]" type="checkbox" :disabled="e.bloqueado === c"
                     :aria-label="`${e.nombre} por ${c}${e.bloqueado === c ? ' (obligatorio)' : ''}`">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="note">Los cambios se guardan solos. Las alertas de seguridad por correo son obligatorias.</p>
  </section>
</template>

<style scoped>
.card{max-width:640px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px;padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px;font-weight:600}
.sum{margin:0;color:var(--muted);font-variant-numeric:tabular-nums}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse}
th,td{padding:12px 8px;border-bottom:1px solid var(--border)}
tbody tr:last-child>*{border-bottom:0}
thead th{color:var(--muted);font-weight:600;text-align:center;vertical-align:bottom}
thead th:first-child,tbody th{padding-left:20px;text-align:left}
tbody th{min-width:110px;font-weight:600}
tbody th span{display:block;color:var(--muted);font-weight:400}
thead th label{color:var(--text);display:grid;justify-items:center;gap:6px;cursor:pointer}
td{width:64px;text-align:center}
tbody tr:hover{background:var(--accent-soft)}
input{appearance:none;display:block;width:18px;height:18px;margin:0 auto;border:1px solid var(--border);border-radius:5px;background:var(--surface);cursor:pointer;transition:background .14s,border-color .14s}
input:hover{border-color:var(--accent)}
input:checked,input:indeterminate{border-color:transparent;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.3l2.4 2.4 4.6-5' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat,linear-gradient(135deg,#22d3ee,#2f5bff)}
input:indeterminate{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M3 6h6' stroke='white' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E"),linear-gradient(135deg,#22d3ee,#2f5bff)}
input:disabled{opacity:.5;cursor:not-allowed}
input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.note{margin:0;padding:12px 20px;border-top:1px solid var(--border);color:var(--muted)}
@media (max-width:460px){tbody th span{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
