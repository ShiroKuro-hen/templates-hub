import { useRef, useState, type DragEvent } from 'react';

const MAX = 10 * 1024 * 1024;
const fmt = (b: number) => (b < 1048576 ? Math.ceil(b / 1024) + ' KB' : (b / 1048576).toFixed(1) + ' MB');

export function FileDropzone({ onChange }: { onChange?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const update = (next: File[]) => { setFiles(next); onChange?.(next); };
  const add = (list: FileList | null) => {
    const all = [...(list ?? [])];
    const big = all.filter((f) => f.size > MAX);
    setError(big.length ? `${big.map((f) => f.name).join(', ')} supera 10 MB. Comprime el archivo o elige otro.` : '');
    update([...files, ...all.filter((f) => f.size <= MAX)]);
  };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); };

  return (
    <section className="uploader" aria-labelledby="t">
      <h2 id="t">Adjunta tus facturas</h2>
      <label className={over ? 'drop over' : 'drop'} onDrop={onDrop}
             onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}>
        <input ref={input} type="file" multiple accept=".pdf,.png,.jpg,.jpeg" aria-describedby="hint"
               onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
        <span className="ico" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" /></svg>
        </span>
        <span><strong>Arrastra archivos aquí</strong> o <span className="link">elígelos desde tu equipo</span></span>
        <small id="hint">PDF, PNG o JPG. Máximo 10 MB por archivo.</small>
      </label>
      <p className="msg" role="alert">{error}</p>
      <ul aria-label="Archivos seleccionados" aria-live="polite">
        {files.length === 0 && <li className="empty">Aún no hay archivos. Añade el primero arriba.</li>}
        {files.map((f, i) => (
          <li key={f.name + i}>
            <span className="name">{f.name}</span>
            <span className="size">{fmt(f.size)}</span>
            <button type="button" aria-label={`Quitar ${f.name}`}
                    onClick={() => { update(files.filter((_, j) => j !== i)); input.current?.focus(); }}>Quitar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// CSS: copia las reglas .uploader, .drop, .ico, .link, .msg, ul, li y .empty de la pestaña HTML + CSS.
