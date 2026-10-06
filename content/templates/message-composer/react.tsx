import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';

type Sent = { html: string; meta: string };
const MAX = 5 * 1024 * 1024;
const TOOLS: [string, string, ReactNode][] = [['b', 'Negrita', <b>B</b>], ['i', 'Cursiva', <i>I</i>], ['c', 'Código', '</>'], ['l', 'Lista', '•']];
const mb = (n: number) => (n / 1048576).toFixed(1).replace('.', ',') + ' MB';
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
const md = (s: string) =>
  esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/_([^_]+)_/g, '<i>$1</i>')
    .split('\n').map((l) => (l.startsWith('- ') ? `<li>${l.slice(2)}</li>` : `<p>${l}</p>`)).join('')
    .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

export function MessageComposer() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<Sent[]>([]);
  const t = useRef<HTMLTextAreaElement>(null);
  const tabs = useRef<HTMLButtonElement[]>([]);
  const [cur, setCur] = useState(0);
  const disabled = !text.trim() && !files.length;

  const edit = (v: string, from: number, to: number) => {
    setText(v); requestAnimationFrame(() => { t.current?.focus(); t.current?.setSelectionRange(from, to); });
  };
  const wrap = (l: string, r = l) => {
    const el = t.current!, s = el.selectionStart, e = el.selectionEnd, v = text.slice(s, e) || 'texto';
    edit(text.slice(0, s) + l + v + r + text.slice(e), s + l.length, s + l.length + v.length);
  };
  const bullets = () => {
    const el = t.current!, s = text.lastIndexOf('\n', el.selectionStart - 1) + 1, e = el.selectionEnd;
    const b = text.slice(s, e).split('\n').map((x) => '- ' + x).join('\n');
    edit(text.slice(0, s) + b + text.slice(e), s + b.length, s + b.length);
  };
  const FMT: Record<string, () => void> = { b: () => wrap('**'), i: () => wrap('_'), c: () => wrap('`'), l: bullets };

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const all = [...(e.target.files ?? [])], big = all.filter((x) => x.size > MAX);
    setFiles([...files, ...all.filter((x) => x.size <= MAX)]); e.target.value = '';
    setError(big.length ? `${big[0].name} supera los 5 MB. Comprime el archivo o elige uno más pequeño.` : '');
  };
  const onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (mod && k === 'enter') { e.preventDefault(); submit(); }
    else if (mod && (k === 'b' || k === 'i')) { e.preventDefault(); FMT[k](); }
  };
  const submit = (e?: FormEvent) => {
    e?.preventDefault(); if (disabled) return;
    const hora = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    const adj = files.length ? `${files.length} ${files.length === 1 ? 'adjunto' : 'adjuntos'}: ${files.map((x) => x.name).join(', ')}. ` : '';
    setSent([{ html: md(text), meta: `${adj}Enviado ${hora}` }, ...sent]); setText(''); setFiles([]); setError('');
  };
  const move = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + 4) % 4; setCur(n); tabs.current[n].focus();
  };

  return (
    <>
      <form className="comp" onSubmit={submit}>
        <div role="toolbar" aria-label="Formato del texto">
          {TOOLS.map(([k, label, icon], i) => (
            <button key={k} type="button" ref={(el) => { tabs.current[i] = el!; }} tabIndex={cur === i ? 0 : -1}
              aria-label={label} title={label} onFocus={() => setCur(i)} onKeyDown={(e) => move(e, i)} onClick={() => FMT[k]()}>{icon}</button>
          ))}
        </div>
        <label className="sr" htmlFor="t">Mensaje</label>
        <textarea id="t" ref={t} value={text} placeholder="Escribe tu mensaje" onChange={(e) => setText(e.target.value)} onKeyDown={onKey} />
        <ul className="files" aria-label="Archivos adjuntos">
          {files.map((x, i) => (
            <li key={x.name + i}>{x.name} ({mb(x.size)})
              <button type="button" aria-label={`Quitar ${x.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</button></li>
          ))}
        </ul>
        {error && <p className="err" role="alert">{error}</p>}
        <div className="foot">
          <label className="attach"><input type="file" className="sr" multiple onChange={onFiles} />Adjuntar</label>
          <small>Hasta 5 MB por archivo. Ctrl + Enter envía.</small>
          <button type="submit" className="send" disabled={disabled}>Enviar</button>
        </div>
      </form>
      <ol className="sent" aria-label="Mensajes enviados">
        {sent.map((m, i) => <li key={i}><div dangerouslySetInnerHTML={{ __html: m.html }} /><small>{m.meta}</small></li>)}
      </ol>
    </>
  );
}

// CSS: copia las reglas .comp, [role=toolbar], button, .attach, textarea, .files, .foot y .sent de la pestaña HTML + CSS.
