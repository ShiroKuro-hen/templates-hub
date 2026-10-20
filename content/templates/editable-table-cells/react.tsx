import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

type Field = 'nombre' | 'email' | 'cantidad' | 'estado' | 'fecha';
export type Row = Record<Field, string>;
type Col = {
  key: Field;
  label: string;
  type?: string;
  num?: boolean;
  options?: string[];
  check: (value: string) => string;
};
type Edit = { r: number; c: number; text: string; error: string };
type Change = { r: number; c: number; prev: string };

const COLS: Col[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', check: (v) => (v.trim() ? '' : 'Escribe un nombre para la fila.') },
  { key: 'email', label: 'Correo', type: 'email', check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Usa un formato como nombre@empresa.com.') },
  { key: 'cantidad', label: 'Cantidad', type: 'number', num: true, check: (v) => (v !== '' && Number(v) >= 0 ? '' : 'La cantidad debe ser un número igual o mayor que 0.') },
  { key: 'estado', label: 'Estado', options: ['Activo', 'Pendiente', 'Inactivo'], check: () => '' },
  { key: 'fecha', label: 'Fecha', type: 'date', check: (v) => (v ? '' : 'Elige una fecha.') },
];

const DEFAULTS: Row[] = [
  { nombre: 'Ana Pérez', email: 'ana.perez@meridian.pe', cantidad: '1240', estado: 'Activo', fecha: '2026-03-14' },
  { nombre: 'Luis Gómez', email: 'luis.gomez@meridian.pe', cantidad: '310', estado: 'Pendiente', fecha: '2026-04-02' },
  { nombre: 'Marta Ruiz', email: 'marta.ruiz@norte.cloud', cantidad: '2890', estado: 'Activo', fecha: '2026-02-21' },
  { nombre: 'Carlos Díaz', email: 'carlos.diaz@andes.pe', cantidad: '760', estado: 'Inactivo', fecha: '2025-11-30' },
  { nombre: 'Lucía Ferrer', email: 'lucia.ferrer@norte.cloud', cantidad: '415', estado: 'Activo', fecha: '2026-06-09' },
  { nombre: 'Jorge Salas', email: 'jorge.salas@andes.pe', cantidad: '0', estado: 'Pendiente', fecha: '2026-07-18' },
];

const MOVES: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max - 1);
const copy = (list: Row[]) => list.map((row) => ({ ...row }));

function CellEditor({
  col,
  text,
  label,
  invalid,
  describedBy,
  onChange,
}: {
  col: Col;
  text: string;
  label: string;
  invalid: boolean;
  describedBy: string;
  onChange: (text: string) => void;
}) {
  const shared = {
    value: text,
    autoFocus: true,
    'aria-label': label,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(e.target.value),
  };
  if (col.options) {
    return (
      <select {...shared}>
        {col.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }
  return <input {...shared} type={col.type} />;
}

export function EditableTableCells({ initial = DEFAULTS }: { initial?: Row[] }) {
  const [saved] = useState(() => copy(initial));
  const [rows, setRows] = useState(() => copy(initial));
  const [history, setHistory] = useState<Change[]>([]);
  const [editing, setEditing] = useState<Edit | null>(null);
  const [active, setActive] = useState({ r: 0, c: 0 });
  const [message, setMessage] = useState('Enter o doble clic para editar. Flechas para moverte.');
  const cells = useRef(new Map<string, HTMLDivElement>());

  const cellChanged = (r: number, c: number) => rows[r][COLS[c].key] !== saved[r][COLS[c].key];
  const changes = rows.flatMap((row, r) => COLS.filter((col) => row[col.key] !== saved[r][col.key])).length;

  const focusAt = (r: number, c: number) => {
    const next = { r: clamp(r, rows.length), c: clamp(c, COLS.length) };
    setActive(next);
    cells.current.get(`${next.r}-${next.c}`)?.focus();
  };

  const startEdit = (r: number, c: number) =>
    setEditing((current) => current ?? { r, c, text: rows[r][COLS[c].key], error: '' });

  const commit = (ed: Edit): boolean => {
    const col = COLS[ed.c];
    const label = col.label.toLowerCase();
    const error = col.check(ed.text);
    if (error) {
      setEditing({ ...ed, error });
      setMessage(`Error en ${label}, fila ${ed.r + 1}: ${error}`);
      return false;
    }
    const prev = rows[ed.r][col.key];
    if (prev !== ed.text) {
      setRows(rows.map((row, i) => (i === ed.r ? { ...row, [col.key]: ed.text } : row)));
      setHistory([...history, { r: ed.r, c: ed.c, prev }]);
      setMessage(`Guardado: ${label} de la fila ${ed.r + 1}.`);
    } else {
      setMessage('Sin cambios.');
    }
    setEditing(null);
    return true;
  };

  const onEditKey = (e: KeyboardEvent, ed: Edit) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditing(null);
      setMessage('Edición cancelada.');
      focusAt(ed.r, ed.c);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (commit(ed)) focusAt(e.key === 'Enter' ? ed.r + 1 : ed.r, e.key === 'Tab' ? ed.c + (e.shiftKey ? -1 : 1) : ed.c);
    }
  };

  const onCellKey = (e: KeyboardEvent, r: number, c: number) => {
    const step = MOVES[e.key];
    if (step) {
      e.preventDefault();
      focusAt(r + step[0], c + step[1]);
    } else if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      startEdit(r, c);
    }
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setRows(rows.map((row, i) => (i === last.r ? { ...row, [COLS[last.c].key]: last.prev } : row)));
    setHistory(history.slice(0, -1));
    setMessage('Deshecho el último cambio.');
    focusAt(last.r, last.c);
  };

  const discard = () => {
    setRows(copy(saved));
    setHistory([]);
    setMessage('Se descartaron todos los cambios.');
    focusAt(0, 0);
  };

  return (
    <main className="sheet">
      <div className="bar">
        <p className="count">
          {changes} {changes === 1 ? 'cambio' : 'cambios'}
        </p>
        <div className="actions">
          <button type="button" className="btn" disabled={!history.length} onClick={undo}>
            Deshacer último
          </button>
          <button type="button" className="btn" disabled={!changes} onClick={discard}>
            Descartar todo
          </button>
        </div>
      </div>
      <div className="scroll" role="region" tabIndex={0} aria-label="Datos del personal, desplazable horizontalmente">
        <div role="grid" aria-label="Personal del equipo">
          <div role="row">
            {COLS.map((col) => (
              <div key={col.key} role="columnheader" className={col.num ? 'num' : undefined}>
                {col.label}
              </div>
            ))}
          </div>
          {rows.map((row, r) => (
            <div key={r} role="row">
              {COLS.map((col, c) => {
                const ed = editing && editing.r === r && editing.c === c ? editing : null;
                return (
                  <div
                    key={col.key}
                    role="gridcell"
                    ref={(el) => {
                      if (el) cells.current.set(`${r}-${c}`, el);
                    }}
                    tabIndex={active.r === r && active.c === c ? 0 : -1}
                    className={col.num ? 'num' : undefined}
                    data-changed={cellChanged(r, c) || undefined}
                    data-editing={ed ? '' : undefined}
                    onFocus={() => {
                      setActive({ r, c });
                      if (editing && !ed) setEditing(null);
                    }}
                    onDoubleClick={() => {
                      if (!ed) startEdit(r, c);
                    }}
                    onKeyDown={(e) => (ed ? onEditKey(e, ed) : onCellKey(e, r, c))}
                  >
                    {ed ? (
                      <CellEditor
                        col={col}
                        text={ed.text}
                        label={`${col.label}, fila ${r + 1}`}
                        invalid={Boolean(ed.error)}
                        describedBy={`m-${r}-${c}`}
                        onChange={(text) => setEditing({ ...ed, text, error: '' })}
                      />
                    ) : (
                      <span className="v">{row[col.key]}</span>
                    )}
                    {ed?.error && (
                      <small className="msg" id={`m-${r}-${c}`}>
                        {ed.error}
                      </small>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="status" aria-live="polite">
        {message}
      </p>
    </main>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (desde .sheet hasta .status y la media query), sin los tokens.
