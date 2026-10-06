import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react';

const MAX_MB = 2;
type Msg = { text: string; kind: '' | 'err' | 'ok' };

export function AvatarUploader({ onSave }: { onSave?: (file: File, zoom: number) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [zoom, setZoom] = useState(100);
  const [msg, setMsg] = useState<Msg>({ text: 'Formatos PNG, JPG o WebP, hasta 2 MB.', kind: '' });

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) return setMsg({ text: `"${f.name}" no es una imagen. Elige un archivo PNG, JPG o WebP.`, kind: 'err' });
    if (f.size > MAX_MB * 1024 ** 2) {
      const mb = (f.size / 1024 ** 2).toFixed(1).replace('.', ',');
      return setMsg({ text: `La imagen pesa ${mb} MB. Elige una de hasta ${MAX_MB} MB.`, kind: 'err' });
    }
    setFile(f); setUrl(URL.createObjectURL(f)); setZoom(100);
    setMsg({ text: `${f.name} lista. Ajusta el zoom y guarda.`, kind: '' });
  }
  const clear = () => { setFile(null); setUrl(''); setMsg({ text: 'Sin imagen. Elige una para continuar.', kind: '' }); };
  const save = () => { if (file) onSave?.(file, zoom); setMsg({ text: 'Avatar guardado. Ya aparece en tu perfil.', kind: 'ok' }); };

  return (
    <section className="card" aria-labelledby="h">
      <h2 id="h">Foto de perfil</h2>
      <p className="muted">Elige una imagen cuadrada para que se vea mejor.</p>
      <div className="row">
        <div className="ring">
          <div className="avatar" style={{ '--z': zoom / 100 } as CSSProperties}>
            {url ? <img src={url} alt="Vista previa del avatar" /> : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z" /></svg>
            )}
          </div>
        </div>
        <div className="ctl">
          <div className="btns">
            <input className="sr" id="file" type="file" accept="image/*" onChange={pick} />
            <label className="btn" htmlFor="file">Elegir imagen</label>
            <button type="button" className="btn" disabled={!url} onClick={clear}>Quitar</button>
          </div>
          <div className="zoom">
            <label htmlFor="zoom">Zoom <output htmlFor="zoom">{zoom} %</output></label>
            <input id="zoom" type="range" min={100} max={300} step={5} value={zoom} disabled={!url} onChange={(e) => setZoom(+e.target.value)} />
          </div>
        </div>
      </div>
      <div className="foot">
        <p className={`msg ${msg.kind}`} role="status">{msg.text}</p>
        <button type="button" className="btn primary" disabled={!url} onClick={save}>Guardar avatar</button>
      </div>
    </section>
  );
}

// CSS: copia las reglas .card, .ring, .avatar, .ctl, .btn, .sr, .zoom, .foot y .msg de la pestaña HTML + CSS.
