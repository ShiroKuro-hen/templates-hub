import { useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
const OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: 'light', label: 'Claro', icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> },
  { value: 'dark', label: 'Oscuro', icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /> },
  { value: 'system', label: 'Sistema', icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></> },
];

export function ThemeToggle({ initial = 'system' }: { initial?: Theme }) {
  const [theme, setTheme] = useState<Theme>(initial);
  const [status, setStatus] = useState('Sigue la configuración del sistema.');

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      setStatus(theme === 'system'
        ? `Sigue la configuración del sistema: ahora en modo ${dark ? 'oscuro' : 'claro'}.`
        : `Modo ${dark ? 'oscuro' : 'claro'} activado.`);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  return (
    <form className="card">
      <fieldset>
        <legend>Tema de la interfaz</legend>
        <p className="hint">Elige cómo se ve la aplicación en este dispositivo.</p>
        <div className="seg">
          <span className="thumb" aria-hidden="true" />
          {OPTIONS.map((o) => (
            <label key={o.value}>
              <input type="radio" name="theme" value={o.value} checked={theme === o.value} onChange={() => setTheme(o.value)} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{o.icon}</svg>
              {o.label}
            </label>
          ))}
        </div>
        <p className="status" role="status">{status}</p>
      </fieldset>
    </form>
  );
}

// CSS: copia las reglas .card, fieldset, legend, .hint, .seg, .thumb y .status de la pestaña HTML + CSS.
