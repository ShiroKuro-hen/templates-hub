import { useState } from 'react';

type Persona = { id: string; nombre: string; cargo: string; iniciales: string; equipo?: Persona[] };

const ORGANIGRAMA: Persona = {
  id: 'lr', nombre: 'Lucía Ruiz', cargo: 'Directora general', iniciales: 'LR', equipo: [
    { id: 'mv', nombre: 'Marcos Vega', cargo: 'Dirección de producto', iniciales: 'MV', equipo: [
      { id: 'sn', nombre: 'Sofía Navarro', cargo: 'Gestora de diseño', iniciales: 'SN' },
      { id: 'ip', nombre: 'Iván Pérez', cargo: 'Gestor de ingeniería', iniciales: 'IP' },
    ] },
    { id: 'et', nombre: 'Elena Torres', cargo: 'Dirección comercial', iniciales: 'ET', equipo: [
      { id: 'cm', nombre: 'Carla Méndez', cargo: 'Responsable de ventas', iniciales: 'CM' },
      { id: 'jo', nombre: 'Javier Ortiz', cargo: 'Responsable de cuentas', iniciales: 'JO' },
    ] },
  ],
};

function Rama({ persona }: { persona: Persona }) {
  const [abierto, setAbierto] = useState(true);
  const equipo = persona.equipo ?? [];
  const idEquipo = `eq-${persona.id}`;

  return (
    <li>
      <div className="node">
        <span className="av" aria-hidden="true">{persona.iniciales}</span>
        <div className="who"><b>{persona.nombre}</b><span>{persona.cargo}</span></div>
        {equipo.length > 0 && (
          <button className="tg" type="button" aria-expanded={abierto} aria-controls={idEquipo} aria-label={`Equipo de ${persona.nombre}`}
                  onClick={() => setAbierto(!abierto)}>
            <span className="chev" aria-hidden="true" />
          </button>
        )}
      </div>
      {equipo.length > 0 && (
        <ul className="kids" id={idEquipo} hidden={!abierto}>
          {equipo.map((p) => <Rama key={p.id} persona={p} />)}
        </ul>
      )}
    </li>
  );
}

export function Organigrama({ raiz = ORGANIGRAMA }: { raiz?: Persona }) {
  return (
    <section className="card" aria-labelledby="org-t">
      <h1 id="org-t">Organigrama</h1>
      <ul className="org">
        <Rama persona={raiz} />
      </ul>
    </section>
  );
}

// CSS: copia las reglas [hidden], ul, .card, h1, .kids, .kids>li (con ::before y ::after), .node, .av, .who, .tg, .chev y los estilos de la pestaña HTML + CSS.
