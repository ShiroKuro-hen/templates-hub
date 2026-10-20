import { useState } from 'react';

type Mensaje = { y: number; x1: number; x2: number; etiqueta: string; descripcion: string; respuesta?: boolean };

const ACTORES = [
  { x: 50, lineas: ['Usuario'] },
  { x: 150, lineas: ['App'] },
  { x: 250, lineas: ['API'] },
  { x: 350, lineas: ['Base de', 'datos'] },
];
const MENSAJES: Mensaje[] = [
  { y: 100, x1: 50, x2: 150, etiqueta: 'Credenciales', descripcion: 'El usuario escribe su correo y contraseña, y pulsa Entrar.' },
  { y: 150, x1: 150, x2: 250, etiqueta: 'POST /login', descripcion: 'La app envía las credenciales por HTTPS al endpoint de inicio de sesión.' },
  { y: 200, x1: 250, x2: 350, etiqueta: 'Consulta', descripcion: 'La API busca al usuario por correo en la base de datos.' },
  { y: 250, x1: 350, x2: 250, etiqueta: 'Hash', descripcion: 'La base de datos devuelve el hash guardado, no la contraseña.', respuesta: true },
  { y: 300, x1: 250, x2: 150, etiqueta: '200 + token', descripcion: 'La API compara el hash con bcrypt y responde con un token de sesión.', respuesta: true },
  { y: 350, x1: 150, x2: 50, etiqueta: 'Panel', descripcion: 'La app guarda el token y muestra el panel de inicio.', respuesta: true },
];
const PISTA = 'Pasa el foco sobre un mensaje para ver su descripción.';

export function DiagramaSecuencia() {
  const [activo, setActivo] = useState<number | null>(null);

  return (
    <figure className="card">
      <h1>Inicio de sesión</h1>
      <svg viewBox="0 0 400 450" role="img" aria-labelledby="seq-t seq-d" onPointerLeave={() => setActivo(null)}>
        <title id="seq-t">Secuencia de inicio de sesión</title>
        <desc id="seq-d">El usuario envía sus credenciales a la app, que llama a la API. La API consulta la base de datos, valida la contraseña y devuelve un token que permite mostrar el panel.</desc>
        <defs>
          <marker id="ah" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="head" d="M0 0L9 5L0 10z" /></marker>
          <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="head hot" d="M0 0L9 5L0 10z" /></marker>
        </defs>
        {ACTORES.map((a) => (
          <line key={a.x} className="life" x1={a.x} y1={54} x2={a.x} y2={388} />
        ))}
        {ACTORES.map((a) => (
          <g key={`caja-${a.x}`}>
            <rect className="box" x={a.x - 40} y={10} width={80} height={44} rx={6} />
            {a.lineas.map((t, i) => (
              <text key={t} x={a.x} y={32 + (i - (a.lineas.length - 1) / 2) * 16}>{t}</text>
            ))}
          </g>
        ))}
        {MENSAJES.map((m, i) => (
          <g key={m.etiqueta} className={activo === i ? 'msg on' : 'msg'} tabIndex={0} role="group"
             aria-label={`${m.etiqueta}: ${m.descripcion}`}
             onPointerOver={() => setActivo(i)} onFocus={() => setActivo(i)} onBlur={() => setActivo(null)}>
            <line className={m.respuesta ? 'arrow reply' : 'arrow'} x1={m.x1} y1={m.y} x2={m.x2} y2={m.y} />
            <text x={(m.x1 + m.x2) / 2} y={m.y - 8}>{m.etiqueta}</text>
          </g>
        ))}
        <rect className="note" x={10} y={400} width={380} height={40} rx={6} />
        <text x={200} y={420}>Nota: la contraseña nunca se guarda en claro.</text>
      </svg>
      <p className="cap" aria-live="polite">{activo === null ? PISTA : MENSAJES[activo].descripcion}</p>
    </figure>
  );
}

// CSS: copia las reglas .card, h1, svg, text, .box, .life, .msg, .arrow, .reply, .head, .note, .cap y los estados .on de la pestaña HTML + CSS.
