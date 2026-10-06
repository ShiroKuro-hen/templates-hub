import { useState, type FormEvent, type ReactNode } from 'react';

type Provider = { id: string; label: string; icon: ReactNode };
const svg = { viewBox: '0 0 24 24', 'aria-hidden': true } as const;
const PROVIDERS: Provider[] = [
  { id: 'Google', label: 'Google', icon: <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12a8 8 0 1 1-2.4-5.7M20 12h-8" /></svg> },
  { id: 'Microsoft', label: 'Microsoft', icon: <svg {...svg} fill="currentColor"><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" opacity=".7" /><rect x="3" y="13" width="8" height="8" opacity=".7" /><rect x="13" y="13" width="8" height="8" opacity=".45" /></svg> },
  { id: 'GitHub', label: 'GitHub', icon: <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="8" r="2.5" /><path d="M6 8.5v7M18 10.5c0 4-6 3-11 6" /></svg> },
  { id: 'tu proveedor SSO', label: 'SSO empresarial', icon: <svg {...svg} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="12" r="4" /><path d="M12 12h9M18 12v3M21 12v2" /></svg> },
];

export function LoginSocial({ onProvider }: { onProvider?: (id: string) => Promise<void> }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ text: string; err: boolean } | null>(null);

  async function pick(id: string) {
    setBusy(id);
    await (onProvider?.(id) ?? new Promise((r) => setTimeout(r, 1600)));
    setBusy(null);
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).checkValidity();
    setMsg(ok ? { text: `Te enviamos un código a ${email}.`, err: false }
              : { text: 'Escribe un correo válido, por ejemplo nombre@empresa.com.', err: true });
  }

  return (
    <main className="card" aria-labelledby="t">
      <div className="logo" aria-hidden="true" />
      <h1 id="t">Accede a Norte Cloud</h1>
      <p className="sub">Usa la cuenta de tu empresa. No publicamos nada en tu nombre.</p>
      <div className="providers" role="group" aria-label="Acceder con un proveedor">
        {PROVIDERS.map((p) => (
          <button key={p.id} className="btn" type="button" disabled={!!busy}
                  aria-busy={busy === p.id || undefined} onClick={() => pick(p.id)}>
            {p.icon}{p.label}
          </button>
        ))}
      </div>
      <p className="sep">o con tu correo</p>
      <form noValidate onSubmit={submit}>
        <label htmlFor="email">Correo de trabajo</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="nombre@empresa.com" required
               value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={msg?.err || undefined} aria-describedby="msg" />
        <p id="msg" className={msg?.err ? 'msg err' : 'msg'} aria-live="polite">{msg?.text}</p>
        <button className="btn primary" type="submit">Continuar con correo</button>
      </form>
      <p className="legal">Al continuar aceptas los <a href="#">Términos del servicio</a> y la <a href="#">Política de privacidad</a>.</p>
      <p className="sr" role="status" aria-live="polite">{busy ? `Redirigiendo a ${busy}…` : ''}</p>
    </main>
  );
}

// CSS: copia las reglas .card, .logo, .providers, .btn, .sep, input, .msg, .legal y .sr de la pestaña HTML + CSS.
