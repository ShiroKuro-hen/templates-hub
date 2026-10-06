import type { CSSProperties } from 'react';

type Member = { name: string; role: string; points: number; me?: boolean };

const TEAM: Member[] = [
  { name: 'Marta Ruiz', role: 'Ejecutiva sénior', points: 128 },
  { name: 'Carlos Díaz', role: 'Ejecutivo sénior', points: 114 },
  { name: 'Sofía Vega', role: 'Ejecutiva', points: 97 },
  { name: 'Luis Gómez', role: 'Ejecutivo', points: 81, me: true },
  { name: 'Ana Pérez', role: 'Ejecutiva', points: 64 },
  { name: 'Diego Torres', role: 'Junior', points: 42 },
];

const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');

export function TeamLeaderboard({ team = TEAM }: { team?: Member[] }) {
  const sorted = [...team].sort((a, b) => b.points - a.points);
  const max = sorted[0]?.points || 1;
  return (
    <section className="board" aria-labelledby="tl-t">
      <h2 id="tl-t">Ranking del equipo de ventas</h2>
      <p>Puntos acumulados en octubre. Se actualiza cada día.</p>
      <ol>
        {sorted.map((m, i) => (
          <li key={m.name} className="row" aria-current={m.me ? 'true' : undefined}>
            <span className="pos">{i + 1}</span>
            <span className="av" aria-hidden="true">{initials(m.name)}</span>
            <div className="who">
              <div className="name"><b>{m.name}</b>{m.me && <span className="me">Tú</span>}<small>{m.role}</small></div>
              <div className="bar" style={{ '--v': Math.round((m.points / max) * 100) } as CSSProperties} />
            </div>
            <span className="pts">{m.points} <small>pts</small></span>
          </li>
        ))}
      </ol>
    </section>
  );
}
// CSS: copia las reglas .board / ol / .row / .pos / .av / .who / .name / .me / .bar / .pts de la pestaña HTML + CSS.
