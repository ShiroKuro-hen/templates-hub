type Param = { nombre: string; tipo: string; obligatorio: boolean; texto: string };
type Respuesta = { codigo: number; titulo: string; json: object };

const PARAMS: Param[] = [
  { nombre: 'cliente_id', tipo: 'string', obligatorio: true, texto: 'Identificador del cliente. Empieza por cli_.' },
  { nombre: 'total', tipo: 'integer', obligatorio: true, texto: 'Importe en centavos. Debe ser mayor que 0.' },
  { nombre: 'moneda', tipo: 'string', obligatorio: false, texto: 'Código ISO 4217. Por defecto USD.' },
  { nombre: 'notas', tipo: 'string', obligatorio: false, texto: 'Texto libre de hasta 200 caracteres.' },
];
const RESPUESTAS: Respuesta[] = [
  { codigo: 201, titulo: 'Pedido creado', json: { id: 'ped_9f3k2', cliente_id: 'cli_204', total: 128000, moneda: 'USD', estado: 'pendiente', creado: '2026-10-06T14:32:10Z' } },
  { codigo: 422, titulo: 'Datos no válidos', json: { error: 'datos_no_validos', mensaje: 'El campo total debe ser mayor que 0.', campo: 'total' } },
];

export function ApiEndpointRef({ params = PARAMS, respuestas = RESPUESTAS }: { params?: Param[]; respuestas?: Respuesta[] }) {
  return (
    <article className="ep">
      <h1>Crear un pedido</h1>
      <div className="route"><span className="m">POST</span><code>/v1/pedidos</code></div>
      <p>Registra un pedido para un cliente existente. Requiere una clave de API en la cabecera <code>Authorization</code>.</p>

      <h2 id="ph">Parámetros del cuerpo</h2>
      <div className="tw" role="region" aria-labelledby="ph" tabIndex={0}>
        <table>
          <thead>
            <tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Uso</th><th scope="col">Descripción</th></tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.nombre}>
                <th scope="row"><code>{p.nombre}</code></th>
                <td><code>{p.tipo}</code></td>
                <td className="req">{p.obligatorio ? <b>Obligatorio</b> : 'Opcional'}</td>
                <td>{p.texto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Respuestas</h2>
      {respuestas.map((r, i) => (
        <details key={r.codigo} open={i === 0}>
          <summary><span className={r.codigo >= 400 ? 'st bad' : 'st'}>{r.codigo}</span>{r.titulo}</summary>
          <pre><code>{JSON.stringify(r.json, null, 2)}</code></pre>
        </details>
      ))}
    </article>
  );
}

// CSS: copia las reglas .ep, .route, .m, .tw, table, details, summary, .st y pre de la pestaña HTML + CSS.
