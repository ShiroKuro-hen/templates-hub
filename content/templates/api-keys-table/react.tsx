import { useRef, useState } from 'react';

type Status = 'ok' | 'warn' | 'err';
type ApiKey = { id: string; name: string; scope: string; secret: string; used: string; status: Status };

const LABEL: Record<Status, string> = { ok: 'Activa', warn: 'Sin uso reciente', err: 'Revocada' };
const KEYS: ApiKey[] = [
  { id: '1', name: 'Producción web', scope: 'Lectura y escritura', secret: 'sk_live_8f3a91c2d7e04b5a6c1f', used: 'Hace 3 minutos', status: 'ok' },
  { id: '2', name: 'Panel de métricas', scope: 'Solo lectura', secret: 'sk_live_2b7d40e9a1c85f36d0a4', used: 'Ayer', status: 'ok' },
  { id: '3', name: 'Integración de facturación', scope: 'Facturación', secret: 'sk_live_c19e5a7f0b3d8246e1f9', used: 'Hace 41 días', status: 'warn' },
  { id: '4', name: 'Pruebas de CI', scope: 'Lectura y escritura', secret: 'sk_test_5d0a8e3c7b1f49a2e6d4', used: 'Hace 2 horas', status: 'ok' },
];
const mask = (s: string) => `${s.slice(0, s.lastIndexOf('_') + 1)}••••••••${s.slice(-4)}`;

export function ApiKeysTable({ initial = KEYS, onRevoke }: { initial?: ApiKey[]; onRevoke?: (id: string) => Promise<void> }) {
  const [keys, setKeys] = useState(initial);
  const [target, setTarget] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [live, setLive] = useState('');
  const dlg = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  async function copy(k: ApiKey) {
    try { await navigator.clipboard.writeText(k.secret); setCopied(k.id); setLive('Clave copiada.'); } catch { /* sin permiso */ }
    setTimeout(() => setCopied(null), 1600);
  }
  async function closed(e: React.SyntheticEvent<HTMLDialogElement>) {
    if (e.currentTarget.returnValue !== 'ok' || !target) return;
    await onRevoke?.(target.id);
    setKeys((l) => l.map((k) => (k.id === target.id ? { ...k, status: 'err' } : k)));
    setLive(`Clave «${target.name}» revocada.`); title.current?.focus();
  }

  return (
    <main className="card" aria-labelledby="h">
      <header><h1 id="h" ref={title} tabIndex={-1}>Claves API</h1><p>Trata las claves como contraseñas. Revoca las que ya no uses.</p></header>
      <div className="scroll">
        <table>
          <caption className="sr">Claves API del proyecto Norte Cloud</caption>
          <thead><tr><th scope="col">Nombre</th><th scope="col">Clave</th><th scope="col">Último uso</th><th scope="col">Estado</th><th scope="col"><span className="sr">Acciones</span></th></tr></thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className={k.status === 'err' ? 'revoked' : undefined}>
                <td>{k.name}<small>{k.scope}</small></td>
                <td><code>{mask(k.secret)}</code></td>
                <td>{k.used}</td>
                <td><span className={`badge ${k.status}`}>{LABEL[k.status]}</span></td>
                <td className="acts">
                  {k.status !== 'err' && (
                    <>
                      <button className="btn" type="button" aria-label={`Copiar clave de ${k.name}`} onClick={() => copy(k)}>{copied === k.id ? 'Copiado' : 'Copiar'}</button>
                      <button className="btn danger" type="button" aria-label={`Revocar clave de ${k.name}`}
                              onClick={() => { setTarget(k); if (dlg.current) dlg.current.returnValue = ''; dlg.current?.showModal(); }}>Revocar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog ref={dlg} aria-labelledby="dt" onClose={closed}>
        <form method="dialog">
          <h2 id="dt">¿Revocar «{target?.name}»?</h2>
          <p>Las apps que usen esta clave dejarán de funcionar de inmediato. No se puede deshacer.</p>
          <div className="actions"><button className="btn" value="cancel">Cancelar</button><button className="btn fill" value="ok">Revocar clave</button></div>
        </form>
      </dialog>
      <p className="sr" role="status" aria-live="polite">{live}</p>
    </main>
  );
}

// CSS: copia las reglas .card, header, h1, .scroll, table, th/td, code, .acts, .badge, .btn, dialog, .actions y .sr de la pestaña HTML + CSS.
