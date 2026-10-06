import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

export function TagInput({ initial = [] as string[] }) {
  const [tags, setTags] = useState(initial);
  const [msg, setMsg] = useState('');
  const input = useRef<HTMLInputElement>(null);

  function remove(tag: string, el: HTMLElement) {
    const li = el.closest('li')!;
    const next = (li.nextElementSibling ?? li.previousElementSibling)?.querySelector('button');
    setTags((t) => t.filter((x) => x !== tag));
    (next ?? input.current)?.focus(); // el vecino sigue montado, se puede enfocar ya
    setMsg(`Etiqueta ${tag} eliminada`);
  }
  const onKey = (tag: string) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      remove(tag, e.currentTarget);
    }
  };
  function add(e: KeyboardEvent<HTMLInputElement>) {
    const v = e.currentTarget.value.trim();
    if (e.key !== 'Enter' || !v) return;
    e.preventDefault();
    const dup = tags.some((t) => t.toLowerCase() === v.toLowerCase());
    if (!dup) setTags([...tags, v]);
    setMsg(dup ? `La etiqueta ${v} ya existe` : `Etiqueta ${v} añadida`);
    e.currentTarget.value = '';
  }

  return (
    <div className="box">
      <ul aria-label="Etiquetas actuales">
        {tags.map((t) => (
          <li key={t}>
            <span>{t}</span>
            <button type="button" aria-label={`Quitar etiqueta ${t}`} onKeyDown={onKey(t)}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => remove(t, e.currentTarget)}>×</button>
          </li>
        ))}
      </ul>
      {!tags.length && <p className="empty">Sin etiquetas. Escribe una y pulsa Enter.</p>}
      <input ref={input} type="text" aria-label="Añadir etiqueta" placeholder="Añadir etiqueta y pulsar Enter" onKeyDown={add} />
      <p className="sr" role="status">{msg}</p>
    </div>
  );
}
// CSS: copia las reglas .box / ul / li / li button / input / .empty / .sr de la pestaña HTML + CSS.
