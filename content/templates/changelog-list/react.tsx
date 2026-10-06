import { useState } from 'react';

type Tipo = 'add' | 'chg' | 'fix';
type Release = { v: string; fecha: string; texto: string; cambios: [Tipo, string][] };

const ETIQUETA: Record<Tipo, string> = { add: 'Añadido', chg: 'Cambiado', fix: 'Corregido' };
const RELEASES: Release[] = [
  { v: '2.4.0', fecha: '2026-09-18', texto: '18 de septiembre de 2026', cambios: [
    ['add', 'Exportación de informes a CSV y Excel.'], ['add', 'Etiquetas personalizadas en los proyectos.'],
    ['chg', 'El panel carga un 40 % más rápido.'], ['fix', 'Los filtros ya no se pierden al recargar la página.'],
  ] },
  { v: '2.3.2', fecha: '2026-09-02', texto: '2 de septiembre de 2026', cambios: [
    ['fix', 'Error al restablecer la contraseña con caracteres especiales.'], ['fix', 'Las fechas usan la zona horaria de cada persona.'],
  ] },
  { v: '2.3.0', fecha: '2026-08-12', texto: '12 de agosto de 2026', cambios: [
    ['add', 'Modo oscuro en toda la aplicación.'], ['chg', 'Nuevo diseño de la página de facturación.'],
    ['chg', 'Los enlaces de invitación caducan a los 7 días.'],
  ] },
];

export function ChangelogList({ releases = RELEASES }: { releases?: Release[] }) {
  const [f, setF] = useState<'all' | Tipo>('all');
  const visibles = releases
    .map((r) => ({ ...r, cambios: r.cambios.filter(([t]) => f === 'all' || t === f) }))
    .filter((r) => r.cambios.length);

  return (
    <div className="cl">
      <h1>Novedades del producto</h1>
      <fieldset>
        <legend>Filtrar por tipo de cambio</legend>
        {(['all', 'add', 'chg', 'fix'] as const).map((k) => (
          <label className="f" key={k}>
            <input type="radio" name="f" value={k} checked={f === k} onChange={() => setF(k)} />
            {k === 'all' ? 'Todo' : ETIQUETA[k]}
          </label>
        ))}
      </fieldset>
      <ol>
        {visibles.map((r) => (
          <li className={r.v === releases[0].v ? 'rel last' : 'rel'} key={r.v}>
            <h2>{r.v}</h2><time dateTime={r.fecha}>{r.texto}</time>
            <ul>
              {r.cambios.map(([t, txt]) => (
                <li data-t={t} key={txt}><span className="tag">{ETIQUETA[t]}</span>{txt}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

// CSS: copia las reglas .cl, fieldset, .f, .rel, .tag y [data-t] de la pestaña HTML + CSS.
