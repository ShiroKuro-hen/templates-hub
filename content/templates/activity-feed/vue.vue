<script setup lang="ts">
type Kind = 'deploy' | 'comment' | 'alert' | 'check';
type Item = { kind: Kind; who: string; what: string; time: string; quote?: string; isNew?: boolean };
type Group = { day: string; items: Item[] };

const ICON: Record<Kind, string> = {
  deploy: 'M12 19V5M5 12l7-7 7 7',
  comment: 'M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z',
  alert: 'M12 3l10 18H2zM12 10v4M12 17.5h.01',
  check: 'M5 13l4 4L19 7',
};

withDefaults(defineProps<{ feed?: Group[] }>(), {
  feed: () => [
    { day: 'Hoy', items: [
      { kind: 'deploy', who: 'Ana Pérez', what: 'desplegó v2.4.1 en producción.', time: '10:42', isNew: true },
      { kind: 'comment', who: 'Luis Gómez', what: 'comentó en «Migrar pagos a Stripe».', time: '09:15', isNew: true,
        quote: '¿Podemos revisar los webhooks antes del viernes?' },
      { kind: 'alert', who: 'Monitor', what: 'detectó una latencia de API superior a 800 ms en eu-west.', time: '08:03' },
    ] },
    { day: 'Ayer', items: [
      { kind: 'check', who: 'Marta Ruiz', what: 'completó «Revisión de accesibilidad».', time: '18:30' },
      { kind: 'check', who: 'Carlos Díaz', what: 'fusionó el pull request #482 en main.', time: '16:12' },
      { kind: 'comment', who: 'Sofía Vega', what: 'comentó en «Rediseño del panel».', time: '11:48',
        quote: 'Subí la nueva versión de los iconos.' },
    ] },
  ],
});
</script>

<template>
  <section class="feed" aria-labelledby="af-t">
    <h2 id="af-t">Actividad reciente</h2>
    <p>Lo último que ha pasado en el proyecto Portal de clientes.</p>
    <div v-for="g in feed" :key="g.day">
      <h3>{{ g.day }}</h3>
      <ol>
        <li v-for="i in g.items" :key="g.day + i.time" :class="[i.kind, { new: i.isNew }]">
          <span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path :d="ICON[i.kind]" /></svg></span>
          <div>
            <p><span v-if="i.isNew" class="sr">Nuevo. </span><b>{{ i.who }}</b> {{ i.what }}</p>
            <blockquote v-if="i.quote">{{ i.quote }}</blockquote>
            <time>{{ i.time }}</time>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.feed{max-width:560px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:18px;font-weight:600}
.feed>p{margin:2px 0 0;color:var(--muted)}
h3{margin:20px 0 12px;font-size:13px;font-weight:600;color:var(--muted)}
ol{margin:0;padding:0;list-style:none}
li{position:relative;display:flex;gap:12px;padding-bottom:16px}
li:last-child{padding-bottom:0}
li:not(:last-child)::before{content:"";position:absolute;left:16px;top:36px;bottom:4px;width:1px;background:var(--border)}
.ic{position:relative;flex:none;display:grid;place-items:center;width:32px;height:32px;border:1px solid currentColor;border-radius:999px}
.ic svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.deploy .ic{color:var(--ok);background:var(--ok-soft)}
.comment .ic{color:var(--info);background:var(--info-soft)}
.alert .ic{color:var(--err);background:var(--err-soft)}
.check .ic{color:var(--accent);background:var(--accent-soft)}
.new .ic::after{content:"";position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);box-shadow:0 0 0 2px var(--surface)}
li p{margin:0}
li b{font-weight:600}
blockquote{margin:8px 0 0;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--muted)}
time{display:block;margin-top:2px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* Tokens: ver pestaña HTML + CSS */
</style>
