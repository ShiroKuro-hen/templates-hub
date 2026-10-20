<script setup lang="ts">
const BARS = [42, 58, 47, 66, 52, 74, 61, 80, 70, 88, 76, 94];
const ROWS: { client: string; status: string; tone: string; amount: string }[] = [
  { client: 'Hotel Mirador', status: 'Pagado', tone: 'ok', amount: '2.480 €' },
  { client: 'Vivero Norte', status: 'Pendiente', tone: 'warn', amount: '940 €' },
  { client: 'Estudio Alba', status: 'Enviado', tone: '', amount: '1.215 €' },
];
</script>

<template>
  <section class="hero" aria-labelledby="h">
    <p class="eyebrow">
      <i aria-hidden="true" />
      Panel 2.0 · informes en vivo
    </p>
    <h1 id="h">Ve cada venta, cada cliente y cada plazo en una sola pantalla.</h1>
    <p class="sub">
      Lumen une facturación, equipos y calendario en un tablero que se actualiza solo. Configura tu primer informe en cinco minutos.
    </p>
    <div class="row">
      <a class="btn main" href="#prueba">Probar 14 días gratis</a>
      <a class="btn" href="#tour">Recorrer el panel</a>
    </div>
    <div class="stage">
      <div class="win" aria-hidden="true">
        <div class="bar">
          <span class="dots">
            <i />
            <i />
            <i />
          </span>
          <span class="url">app.lumen.es/panel</span>
        </div>
        <div class="body">
          <div class="side">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div class="main">
            <div class="head">
              <b>Ventas del trimestre</b>
              <span class="chip">+18 %</span>
            </div>
            <div class="chart">
              <i v-for="(h, i) in BARS" :key="i" :style="{ height: `${h}%` }" />
            </div>
            <div class="tbl">
              <div class="tr">
                <span>Cliente</span>
                <span>Estado</span>
                <span>Importe</span>
              </div>
              <div v-for="row in ROWS" :key="row.client" class="tr">
                <span>{{ row.client }}</span>
                <em :class="row.tone ? ['st', row.tone] : 'st'">{{ row.status }}</em>
                <span>{{ row.amount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position:relative; isolation:isolate; max-width:920px; margin:0 auto; padding-top:40px; text-align:left; }
.hero::before { content:""; position:absolute; inset:-40px 0 auto; height:520px; z-index:-1; background:radial-gradient(50% 60% at 80% 0,var(--accent-soft),transparent 70%); pointer-events:none; }
.eyebrow { display:inline-flex; align-items:center; gap:8px; margin:0 0 16px; color:var(--muted); font-size:13px; font-weight:600; }
.eyebrow i { width:8px; height:8px; border-radius:50%; background:var(--ok); box-shadow:0 0 0 4px var(--ok-soft); }
h1 { margin:0 0 14px; max-width:18ch; font-size:clamp(2.1rem,6vw,3.6rem); font-weight:700; line-height:1.05; letter-spacing:-.03em; text-wrap:balance; }
.sub { margin:0 0 24px; max-width:56ch; color:var(--muted); font-size:1.08rem; line-height:1.55; }
.row { display:flex; flex-wrap:wrap; gap:12px; }
.btn { display:inline-flex; align-items:center; padding:11px 20px; border:1px solid var(--border); border-radius:var(--radius); background:var(--surface); color:var(--text); font:600 1rem system-ui,sans-serif; text-decoration:none; }
.btn:hover { border-color:var(--accent); }
.btn.main { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); box-shadow:var(--shadow); }
.btn.main:hover { filter:brightness(1.08); }
.stage { perspective:1400px; margin-top:44px; }
.win { overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:0 30px 60px -24px rgba(14,23,38,.35),var(--shadow); transform:rotateX(6deg); transform-origin:50% 100%; }
@media (prefers-reduced-motion:no-preference) { .win { transition:transform .5s cubic-bezier(.2,.7,.2,1); } .stage:hover .win { transform:rotateX(0) translateY(-6px); } }
.bar { display:flex; align-items:center; gap:12px; padding:10px 12px; background:var(--bg); border-bottom:1px solid var(--border); }
.dots { display:flex; gap:6px; }
.dots i { width:10px; height:10px; border-radius:50%; background:var(--border); }
.url { flex:1; min-width:0; padding:3px 10px; border-radius:999px; background:var(--surface); color:var(--muted); font-size:12px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.body { display:grid; grid-template-columns:150px minmax(0,1fr); }
.side { display:grid; align-content:start; gap:10px; padding:14px 12px; background:var(--bg); border-right:1px solid var(--border); }
.side span { height:9px; border-radius:999px; background:var(--border); }
.side span:first-child { background:var(--accent); }
.side span:nth-child(3) { width:70%; }
.main { display:grid; align-content:start; gap:14px; min-width:0; padding:16px; }
.head { display:flex; align-items:center; justify-content:space-between; gap:8px; font-weight:600; }
.chip { padding:2px 8px; border-radius:999px; background:var(--ok-soft); color:var(--ok); font-size:12px; }
.chart { display:flex; align-items:flex-end; gap:6px; height:130px; padding:12px; border-radius:var(--radius); background:var(--accent-soft); }
.chart i { flex:1; min-width:0; border-radius:4px 4px 0 0; background:linear-gradient(180deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); }
.tbl { display:grid; overflow:hidden; font-size:13px; border:1px solid var(--border); border-radius:var(--radius); }
.tr { display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:8px; align-items:center; padding:9px 12px; border-top:1px solid var(--border); }
.tr:first-child { border-top:0; background:var(--bg); color:var(--muted); font-weight:600; }
.tr span:last-child { text-align:right; }
.st { justify-self:start; padding:1px 8px; border-radius:999px; background:var(--info-soft); color:var(--info); font-size:12px; font-style:normal; }
.st.ok { background:var(--ok-soft); color:var(--ok); }
.st.warn { background:var(--warn-soft); color:var(--warn); }
@media (max-width:560px) { .body { grid-template-columns:44px minmax(0,1fr); } .side { padding:12px 8px; } .tr { grid-template-columns:1.4fr 1fr .8fr; } }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
</style>
