<script setup lang="ts">
type Kind = 'accent' | 'info' | 'ok' | 'warn';
type Ev = { title: string; s: number; d: number; kind: Kind }; // s: horas desde las 8:00, d: duración en horas
type Day = { name: string; n: number; events: Ev[] };

const daily: Ev = { title: 'Daily', s: 1, d: 0.5, kind: 'accent' };
const days: Day[] = [
  { name: 'Lunes', n: 5, events: [
    { title: 'Planificación', s: 1, d: 1, kind: 'accent' },
    { title: 'Revisión de diseño', s: 3, d: 1.5, kind: 'info' },
    { title: 'Demo Norte Digital', s: 7, d: 1, kind: 'ok' } ] },
  { name: 'Martes', n: 6, events: [daily,
    { title: 'Entrevista UX', s: 2.5, d: 1, kind: 'warn' },
    { title: 'Sprint review', s: 6, d: 1.5, kind: 'info' } ] },
  { name: 'Miércoles', n: 7, events: [daily,
    { title: 'Taller de accesibilidad', s: 2, d: 2, kind: 'ok' },
    { title: '1:1 con Marta', s: 8, d: 0.5, kind: 'accent' } ] },
  { name: 'Jueves', n: 8, events: [daily,
    { title: 'Auditoría de seguridad', s: 3, d: 2, kind: 'warn' },
    { title: 'Retrospectiva', s: 7.5, d: 1, kind: 'info' } ] },
  { name: 'Viernes', n: 9, events: [daily,
    { title: 'Lanzamiento v2.5', s: 4, d: 1, kind: 'ok' },
    { title: 'Cierre de semana', s: 9, d: 0.5, kind: 'accent' } ] },
];

const TODAY = 6;
const NOW = 4.33; // 12:20
const hm = (x: number) => `${Math.floor(8 + x)}:${x % 1 ? '30' : '00'}`;
</script>

<template>
  <section class="cal" aria-labelledby="sw-t">
    <div class="top"><h2 id="sw-t">Semana del 5 al 9 de octubre</h2><p>Agenda del equipo de producto.</p></div>
    <div class="scroll"><div class="wk">
      <div class="hd">
        <span></span>
        <div v-for="d in days" :key="d.n" class="dh" :class="{ today: d.n === TODAY }" :aria-current="d.n === TODAY ? 'date' : undefined">
          {{ d.name.slice(0, 3) }} <b>{{ d.n }}</b>
        </div>
      </div>
      <div class="bd">
        <div class="hrs" aria-hidden="true"><span v-for="i in 10" :key="i">{{ 7 + i }}:00</span></div>
        <ol v-for="d in days" :key="d.n" class="day" :aria-label="`${d.name} ${d.n} de octubre`">
          <li v-for="e in d.events" :key="e.title" class="ev" :class="[e.kind, { sh: e.d < 1 }]" :style="{ '--s': e.s, '--d': e.d }">
            <b>{{ e.title }}</b><time>{{ hm(e.s) }} – {{ hm(e.s + e.d) }}</time>
          </li>
          <li v-if="d.n === TODAY" class="now" :style="{ '--s': NOW }" aria-hidden="true"></li>
        </ol>
      </div>
    </div></div>
  </section>
</template>

<style scoped>
.cal{max-width:1000px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.top{padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:18px;font-weight:600}
.top p{margin:2px 0 0;color:var(--muted)}
.scroll{overflow-x:auto}
.wk{--h:48px;min-width:720px}
.hd,.bd{display:grid;grid-template-columns:48px repeat(5,1fr)}
.hd{border-bottom:1px solid var(--border)}
.dh{padding:8px 0;text-align:center;color:var(--muted);border-left:1px solid var(--border)}
.dh b{display:inline-grid;place-items:center;min-width:28px;height:28px;margin-left:4px;border-radius:999px;color:var(--text);font-variant-numeric:tabular-nums}
.dh.today b{background:var(--accent);color:var(--accent-ink)}
.bd{padding-top:8px}
.hrs span{display:block;height:var(--h);padding-right:8px;text-align:right;color:var(--muted);font-size:12px;transform:translateY(-8px);font-variant-numeric:tabular-nums}
.day{position:relative;height:calc(10 * var(--h));margin:0;padding:0;list-style:none;border-left:1px solid var(--border);background:repeating-linear-gradient(to bottom,var(--border) 0 1px,transparent 1px var(--h))}
.ev{position:absolute;left:3px;right:3px;top:calc(var(--s) * var(--h) + 1px);height:calc(var(--d) * var(--h) - 3px);padding:2px 8px;border:1px solid var(--c);border-radius:6px;background:var(--cs);overflow:hidden;font-size:12px;line-height:1.2}
.ev b,.ev time{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ev time{color:var(--muted)}
.ev.sh time{display:none}
.accent{--c:var(--accent);--cs:var(--accent-soft)}
.info{--c:var(--info);--cs:var(--info-soft)}
.ok{--c:var(--ok);--cs:var(--ok-soft)}
.warn{--c:var(--warn);--cs:var(--warn-soft)}
.now{position:absolute;left:0;right:0;top:calc(var(--s) * var(--h));z-index:1;height:1px;background:linear-gradient(90deg,#22d3ee,#2f5bff)}
.now::before{content:"";position:absolute;left:-4px;top:-3px;width:7px;height:7px;border-radius:999px;background:var(--accent)}
/* Tokens: ver pestaña HTML + CSS */
</style>
