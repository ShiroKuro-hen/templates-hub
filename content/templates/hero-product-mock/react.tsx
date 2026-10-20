// CSS: copia las reglas .hero (y ::before), .eyebrow, h1, .sub, .row, .btn, .stage, .win (y su transición), .bar, .dots, .url, .body, .side, .main, .head, .chip, .chart, .tbl, .tr, .st y la media query de la pestaña HTML + CSS.

const BARS = [42, 58, 47, 66, 52, 74, 61, 80, 70, 88, 76, 94];
const ROWS: { client: string; status: string; tone: string; amount: string }[] = [
  { client: 'Hotel Mirador', status: 'Pagado', tone: 'ok', amount: '2.480 €' },
  { client: 'Vivero Norte', status: 'Pendiente', tone: 'warn', amount: '940 €' },
  { client: 'Estudio Alba', status: 'Enviado', tone: '', amount: '1.215 €' },
];

export function HeroProductMock() {
  return (
    <section className="hero" aria-labelledby="h">
      <p className="eyebrow">
        <i aria-hidden="true" />
        Panel 2.0 · informes en vivo
      </p>
      <h1 id="h">Ve cada venta, cada cliente y cada plazo en una sola pantalla.</h1>
      <p className="sub">
        Lumen une facturación, equipos y calendario en un tablero que se actualiza solo. Configura tu primer informe en cinco minutos.
      </p>
      <div className="row">
        <a className="btn main" href="#prueba">Probar 14 días gratis</a>
        <a className="btn" href="#tour">Recorrer el panel</a>
      </div>
      <div className="stage">
        <div className="win" aria-hidden="true">
          <div className="bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="url">app.lumen.es/panel</span>
          </div>
          <div className="body">
            <div className="side">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="main">
              <div className="head">
                <b>Ventas del trimestre</b>
                <span className="chip">+18 %</span>
              </div>
              <div className="chart">
                {BARS.map((h, i) => (
                  <i key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="tbl">
                <div className="tr">
                  <span>Cliente</span>
                  <span>Estado</span>
                  <span>Importe</span>
                </div>
                {ROWS.map((row) => (
                  <div className="tr" key={row.client}>
                    <span>{row.client}</span>
                    <em className={row.tone ? `st ${row.tone}` : 'st'}>{row.status}</em>
                    <span>{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
