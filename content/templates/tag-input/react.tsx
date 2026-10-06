import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

type Props = { initial?: string[]; suggestions?: string[]; onChange?: (tags: string[]) => void };
const SUGGESTIONS = ['frontend', 'backend', 'rendimiento', 'seguridad', 'documentación', 'diseño', 'accesibilidad'];

export function TagInput({ initial = ['diseño', 'accesibilidad'], suggestions = SUGGESTIONS, onChange }: Props) {
  const [tags, setTags] = useState(initial);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const commit = (next: string[]) => { setTags(next); onChange?.(next); };
  const add = (raw: string[]) => {
    let next = tags;
    for (const r of raw) {
      const t = r.trim().toLowerCase();
      if (!t) continue;
      if (next.includes(t)) { setStatus(`«${t}» ya está en la lista. Escribe otra etiqueta.`); continue; }
      next = [...next, t];
      setStatus(`Añadiste «${t}».`);
    }
    if (next !== tags) commit(next);
  };
  const remove = (t: string) => {
    commit(tags.filter((x) => x !== t));
    setStatus(`Quitaste «${t}».`);
    input.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add([value]); setValue(''); }
    else if (e.key === 'Backspace' && !value && tags.length) remove(tags[tags.length - 1]);
  };
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const parts = e.target.value.split(',');
    setValue(parts.pop() ?? '');
    if (parts.length) add(parts);
  };

  return (
    <div className="field">
      <label htmlFor="tag-in">Etiquetas del artículo</label>
      <div className="box" onClick={(e) => e.target === e.currentTarget && input.current?.focus()}>
        <ul className="tags" aria-label="Etiquetas añadidas">
          {tags.map((t) => (
            <li className="tag" key={t}>
              {t}
              <button type="button" aria-label={`Quitar ${t}`} onClick={() => remove(t)}>×</button>
            </li>
          ))}
        </ul>
        <input ref={input} id="tag-in" list="tag-sug" autoComplete="off" placeholder="Escribe y pulsa Enter"
               aria-describedby="tag-help" value={value} onChange={onInput} onKeyDown={onKeyDown} />
      </div>
      <datalist id="tag-sug">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
      <p className="help" id="tag-help">Pulsa Enter o coma para añadir. Retroceso con el campo vacío quita la última.</p>
      <p className="status" role="status">{status}</p>
    </div>
  );
}

// CSS: copia las reglas .field, .box, .tags, .tag, .help y .status de la pestaña HTML + CSS.
