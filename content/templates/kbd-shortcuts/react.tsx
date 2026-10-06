import { Fragment } from 'react';

// keys: combinación con "+" ("Ctrl+K") o secuencia con espacio ("G H").
type Shortcut = { action: string; keys: string };
type Group = { title: string; items: Shortcut[] };

const DATA: Group[] = [
  { title: 'General', items: [
    { action: 'Abrir la paleta de comandos', keys: 'Ctrl+K' },
    { action: 'Mostrar esta lista', keys: '?' },
    { action: 'Cerrar panel o diálogo', keys: 'Esc' },
  ] },
  { title: 'Navegación', items: [
    { action: 'Ir al inicio', keys: 'G H' },
    { action: 'Elemento siguiente', keys: 'J' },
    { action: 'Elemento anterior', keys: 'K' },
  ] },
  { title: 'Edición', items: [
    { action: 'Guardar cambios', keys: 'Ctrl+S' },
    { action: 'Deshacer', keys: 'Ctrl+Z' },
    { action: 'Rehacer', keys: 'Ctrl+Shift+Z' },
  ] },
];

function Keys({ keys }: { keys: string }) {
  return (
    <>
      {keys.split(' ').map((combo, i) => (
        <Fragment key={combo}>
          {i > 0 && ' luego '}
          <kbd>{combo.split('+').map((k, j) => <Fragment key={k}>{j > 0 && '+'}<kbd>{k}</kbd></Fragment>)}</kbd>
        </Fragment>
      ))}
    </>
  );
}

export function KbdShortcuts({ groups = DATA }: { groups?: Group[] }) {
  return (
    <section className="card" aria-labelledby="kbd-title">
      <header>
        <h2 id="kbd-title">Atajos de teclado</h2>
        <p>Trabaja más rápido sin soltar el teclado.</p>
      </header>
      <div className="groups">
        {groups.map((g) => (
          <section key={g.title} aria-label={g.title}>
            <h3>{g.title}</h3>
            <dl>
              {g.items.map((s) => (
                <div key={s.action}><dt>{s.action}</dt><dd><Keys keys={s.keys} /></dd></div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <footer>En macOS, usa <Keys keys="⌘" /> en lugar de <Keys keys="Ctrl" />.</footer>
    </section>
  );
}

// CSS: copia las reglas .card, h2, .groups, h3, dl, dd y kbd de la pestaña HTML + CSS.
