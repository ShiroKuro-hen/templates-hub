import { useState } from 'react';
import type { SyntheticEvent } from 'react';

type Pregunta = { id: string; q: string; a: string };
type Seccion = { id: string; titulo: string; preguntas: Pregunta[] };

const SECCIONES: Seccion[] = [
  { id: 'cuenta', titulo: 'Cuenta y acceso', preguntas: [
    { id: 'pass', q: 'Cómo restablezco mi contraseña', a: 'Elige "¿Olvidaste tu contraseña?" y sigue el enlace del correo. Caduca en 30 minutos.' },
    { id: '2fa', q: 'Cómo activo la verificación en dos pasos', a: 'En Seguridad, selecciona "Activar" y escanea el código QR con tu app de autenticación.' },
    { id: 'invitar', q: 'Cómo invito a mi equipo', a: 'En Miembros, escribe los correos y asigna un rol. Cada invitación vence a los 7 días.' },
  ] },
  { id: 'pagos', titulo: 'Facturación', preguntas: [
    { id: 'facturas', q: 'Dónde descargo mis facturas', a: 'En Facturación, abre el historial y elige el icono de descarga junto a cada pago.' },
    { id: 'tarjeta', q: 'Cómo cambio el método de pago', a: 'Edita la tarjeta en Facturación. El cambio se aplica desde el próximo ciclo.' },
  ] },
];
const IDS = SECCIONES.flatMap((s) => [s.id, ...s.preguntas.map((p) => p.id)]);

export function AcordeonAnidado({ secciones = SECCIONES }: { secciones?: Seccion[] }) {
  const [abierto, setAbierto] = useState<Record<string, boolean>>({ cuenta: true });
  const todo = IDS.every((id) => abierto[id]);
  const marcar = (id: string) => (e: SyntheticEvent<HTMLDetailsElement>) => {
    const open = e.currentTarget.open;
    setAbierto((a) => (a[id] === open ? a : { ...a, [id]: open }));
  };

  return (
    <section className="card" aria-labelledby="an-titulo">
      <header>
        <h2 id="an-titulo">Centro de ayuda</h2>
        <button className="all" type="button" aria-controls="an-acc"
                onClick={() => setAbierto(Object.fromEntries(IDS.map((id) => [id, !todo])))}>
          {todo ? 'Contraer todo' : 'Expandir todo'}
        </button>
      </header>
      <div id="an-acc">
        {secciones.map((s) => (
          <details key={s.id} className="l1" open={!!abierto[s.id]} onToggle={marcar(s.id)}>
            <summary id={`an-${s.id}`}>{s.titulo} <span className="n">{s.preguntas.length}</span></summary>
            <div className="sub" role="group" aria-labelledby={`an-${s.id}`}>
              {s.preguntas.map((p) => (
                <details key={p.id} className="l2" open={!!abierto[p.id]} onToggle={marcar(p.id)}>
                  <summary>{p.q}</summary>
                  <p>{p.a}</p>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// CSS: copia las reglas .card, header, summary, .l1, .sub, .l2 y .n de la pestaña HTML + CSS.
