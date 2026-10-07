import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

type Field = { id: string; label: string; value: string; type?: string; min?: number };
const INICIAL: Field[] = [
  { id: 'nombre', label: 'Nombre', value: 'Ana Pérez', min: 2 },
  { id: 'correo', label: 'Correo', value: 'ana.perez@meridian.pe', type: 'email' },
  { id: 'cargo', label: 'Cargo', value: 'Responsable de Producto' },
  { id: 'empresa', label: 'Empresa', value: 'Meridian Logística', min: 2 },
];

function check(f: Field, v: string): string {
  if (!v) return 'Este campo no puede quedar vacío. Escribe un valor.';
  if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return 'Escribe un correo válido, como ana@empresa.com.';
  if (f.min && v.length < f.min) return `Usa al menos ${f.min} caracteres.`;
  return '';
}

function Row({ f, onSave }: { f: Field; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(f.value);
  const [err, setErr] = useState('');
  const btn = useRef<HTMLButtonElement>(null);
  const restore = useRef(false);

  useEffect(() => {
    if (!editing && restore.current) { restore.current = false; btn.current?.focus(); }
  }, [editing]);

  const close = () => { restore.current = true; setEditing(false); };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = draft.trim(), msg = check(f, v);
    setErr(msg);
    if (msg) return;
    onSave(v); close();
  };
  const keys = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };

  return (
    <div className="row">
      <dt id={`l-${f.id}`}>{f.label}</dt>
      <dd>
        {editing ? (
          <form className="edit" noValidate onSubmit={submit} onKeyDown={keys}>
            <input autoFocus onFocus={(e) => e.target.select()} type={f.type ?? 'text'} value={draft}
              aria-labelledby={`l-${f.id}`} aria-invalid={!!err} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn pri">Guardar</button>
            <button type="button" className="btn" onClick={close}>Cancelar</button>
            <p className="err">{err}</p>
          </form>
        ) : (
          <div className="view">
            <span className="val">{f.value}</span>
            <button ref={btn} type="button" className="btn" aria-label={`Editar ${f.label.toLowerCase()}`}
              onClick={() => { setDraft(f.value); setErr(''); setEditing(true); }}>Editar</button>
          </div>
        )}
      </dd>
    </div>
  );
}

export function FormInlineEdit() {
  const [fields, setFields] = useState(INICIAL);
  const [live, setLive] = useState('');
  const save = (id: string, label: string, value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, value } : f)));
    setLive(`Cambios guardados: ${label.toLowerCase()} actualizado.`);
  };
  return (
    <section className="card" aria-labelledby="t">
      <header><h1 id="t">Perfil de la cuenta</h1><p className="sub">Selecciona Editar para cambiar un dato. Enter guarda y Esc cancela.</p></header>
      <dl>{fields.map((f) => <Row key={f.id} f={f} onSave={(v) => save(f.id, f.label, v)} />)}</dl>
      <p id="live" role="status">{live}</p>
    </section>
  );
}

// CSS: copia las reglas .card, .row, .view, .edit, input, .btn, .err y #live de la pestaña HTML + CSS.
