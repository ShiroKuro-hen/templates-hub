type Kpi = {
  label: string;
  data: number[];
  format?: (v: number) => string;
  goodWhenUp?: boolean; // false: que baje es bueno (p. ej. cancelaciones)
  bars?: boolean;
};

const W = 120, H = 36, P = 4;

function Sparkline({ data, bars, label, fmt }: { data: number[]; bars?: boolean; label: string; fmt: (v: number) => string }) {
  const min = Math.min(...data), max = Math.max(...data), last = data[data.length - 1];
  const X = (i: number) => P + (i * (W - 2 * P)) / (data.length - 1);
  const Y = (v: number) => P + (1 - (v - min) / (max - min || 1)) * (H - 2 * P);
  const pts = data.map((v, i) => `${X(i)},${Y(v)}`).join(' L');
  const bw = (W - 2 * P) / data.length;
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Tendencia de ${label}: de ${fmt(data[0])} a ${fmt(last)}`}>
      {bars ? data.map((v, i) => {
        const y = P + (1 - v / max) * (H - 2 * P); // barras parten de 0
        return <rect key={i} className="bar" x={P + i * bw + 1} y={y} width={bw - 2} height={H - P - y} rx={1.5} />;
      }) : (
        <>
          <path className="area" d={`M${X(0)},${H} L${pts} L${X(data.length - 1)},${H}Z`} />
          <path className="line" d={`M${pts}`} />
          <circle className="end" cx={X(data.length - 1)} cy={Y(last)} r={3.5} />
        </>
      )}
    </svg>
  );
}

export function KpiSparklines({ items }: { items: Kpi[] }) {
  return (
    <div className="kpis">
      {items.map((k) => {
        const fmt = k.format ?? String;
        const first = k.data[0], last = k.data[k.data.length - 1];
        const pct = Math.round(((last - first) / first) * 100);
        const good = pct >= 0 === (k.goodWhenUp ?? true);
        return (
          <article key={k.label} className={`kpi ${good ? 'good' : 'bad'}`}>
            <small>{k.label}</small>
            <strong>{fmt(last)}</strong>
            <span className="delta">{pct >= 0 ? '▲' : '▼'} {Math.abs(pct)}%</span>
            <Sparkline data={k.data} bars={k.bars} label={k.label} fmt={fmt} />
          </article>
        );
      })}
    </div>
  );
}
// CSS: copia las reglas .kpis / .kpi / .delta / .good / .bad / .spark (.line .area .end .bar) de la pestaña HTML + CSS.
