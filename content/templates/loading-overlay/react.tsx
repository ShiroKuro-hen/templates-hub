import { useEffect, useState } from 'react';

const fmt = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LoadingOverlay() {
  const [busy, setBusy] = useState(false);
  const [storage, setStorage] = useState(180);
  const [stamp, setStamp] = useState('09:00:00');
  const [live, setLive] = useState('');

  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => {
      setStorage(Math.round(150 + Math.random() * 100));
      setStamp(new Date().toLocaleTimeString('es-PE'));
      setBusy(false);
      setLive('Datos actualizados.');
    }, 1800);
    return () => clearTimeout(t);
  }, [busy]);

  const refresh = () => {
    if (busy) return;
    setLive('Actualizando datos…');
    setBusy(true);
  };

  return (
    <section className="panel" aria-labelledby="t" aria-busy={busy}>
      <header>
        <h2 id="t">Facturación de octubre</h2>
        <button className="btn" type="button" aria-disabled={busy} onClick={refresh}>Actualizar datos</button>
      </header>
      <div inert={busy}>
        <dl>
          <div className="line"><dt>Plan Business<span>12 usuarios</span></dt><dd>{fmt(1440)}</dd></div>
          <div className="line"><dt>Almacenamiento adicional<span>500 GB</span></dt><dd>{fmt(storage)}</dd></div>
          <div className="line"><dt>Soporte prioritario</dt><dd>{fmt(320)}</dd></div>
          <div className="line total"><dt>Total del mes</dt><dd>{fmt(1760 + storage)}</dd></div>
        </dl>
        <p className="stamp">Actualizado hoy a las {stamp}.</p>
      </div>
      <div className="overlay" aria-hidden="true"><span className="spin" /><span>Actualizando datos…</span></div>
      <p className="sr" role="status">{live}</p>
    </section>
  );
}

// CSS: copia las reglas .panel, header, .btn, dl, .line, .stamp, .overlay, .spin y .sr de la pestaña HTML + CSS.
