import { useState } from 'react';

type Kind = 'info' | 'ok' | 'warn' | 'err';
export type AlertItem = { id: string; kind: Kind; title: string; text: string };

const ICON: Record<Kind, string> = { info: 'i', ok: '✓', warn: '!', err: '✕' };
const DEFAULTS: AlertItem[] = [
  { id: 'v', kind: 'info', title: 'Nueva versión disponible', text: 'La 2.4 llega el viernes con mejoras de velocidad.' },
  { id: 'p', kind: 'ok', title: 'Pago recibido', text: 'Tu suscripción se renovó hasta el 5 de enero.' },
  { id: 'w', kind: 'warn', title: 'Tu plan vence en 3 días', text: 'Renueva para no perder el acceso a tus informes.' },
  { id: 'e', kind: 'err', title: 'No se pudo enviar el formulario', text: 'Falta el correo electrónico. Complétalo e inténtalo otra vez.' },
];

export function Alerts({ items = DEFAULTS }: { items?: AlertItem[] }) {
  const [hidden, setHidden] = useState<string[]>([]);
  const visible = items.filter((a) => !hidden.includes(a.id));

  return (
    <>
      <ul className="alerts">
        {visible.map((a) => (
          <li key={a.id} className={`alert ${a.kind === 'info' ? '' : a.kind}`} role={a.kind === 'err' ? 'alert' : 'status'}>
            <i aria-hidden="true">{ICON[a.kind]}</i>
            <div><b>{a.title}</b><span>{a.text}</span></div>
            <button type="button" aria-label={`Descartar aviso: ${a.title}`} onClick={() => setHidden([...hidden, a.id])}>×</button>
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <button type="button" className="reset" autoFocus onClick={() => setHidden([])}>
          Mostrar avisos otra vez
        </button>
      )}
    </>
  );
}
// CSS: copia las reglas .alerts / .alert (y ::before) / .alert.ok / .warn / .err / .alert i / .alert div / .alert b / .alert span / .alert button / .reset de la pestaña HTML + CSS.
