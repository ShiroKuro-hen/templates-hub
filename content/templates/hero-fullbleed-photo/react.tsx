import { useRef, useState, type FormEvent } from 'react';

const DESTINOS = ['Islas griegas', 'Alpes', 'Costa'];
const FECHAS = ['Fin de semana', 'Esta semana', 'Este mes'];
const VIAJEROS = ['1 viajero', '2 viajeros', '3 viajeros', '4 viajeros', '5 viajeros', '6 viajeros'];

export function HeroFullbleedPhoto() {
  const [destino, setDestino] = useState('');
  const [fechas, setFechas] = useState(FECHAS[0]);
  const [viajeros, setViajeros] = useState(VIAJEROS[1]);
  const [error, setError] = useState(false);
  const [resumen, setResumen] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const buscar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = destino.trim();
    setError(!q);
    if (!q) input.current?.focus();
    setResumen(q ? `Búsqueda: ${q} · ${fechas} · ${viajeros}.` : '');
  };

  const elegir = (d: string) => {
    setDestino(d);
    setError(false);
  };

  return (
    <section className="hero" aria-labelledby="h">
      <img className="photo" src="/stock/isla-blanca.webp" alt="Pueblo blanco griego junto al mar" width={800} height={533} fetchPriority="high" />
      <div className="scrim" aria-hidden="true" />
      <div className="content">
        <p className="eyebrow">Escapadas de temporada</p>
        <h1 id="h">Tu próxima escapada, a un clic</h1>
        <p className="sub">Compara hoteles, vuelos y casas rurales en un solo lugar y reserva con el precio final visible.</p>
        <form className="search" noValidate onSubmit={buscar}>
          <div className="field">
            <label htmlFor="dest">Destino</label>
            <input ref={input} id="dest" name="destino" type="text" autoComplete="off" placeholder="¿A dónde vas?"
              aria-describedby="dest-err" aria-invalid={error} value={destino}
              onChange={(e) => { setDestino(e.target.value); setError(false); }} />
            <span className="err" id="dest-err" hidden={!error}>Escribe un destino para buscar.</span>
          </div>
          <div className="field">
            <label htmlFor="when">Fechas</label>
            <select id="when" name="fechas" value={fechas} onChange={(e) => setFechas(e.target.value)}>
              {FECHAS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="guests">Viajeros</label>
            <select id="guests" name="viajeros" value={viajeros} onChange={(e) => setViajeros(e.target.value)}>
              {VIAJEROS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <button type="submit" className="go">Buscar</button>
        </form>
        <div className="chips" role="group" aria-label="Destinos sugeridos">
          {DESTINOS.map((d) => <button key={d} type="button" onClick={() => elegir(d)}>{d}</button>)}
        </div>
        <p className="summary" aria-live="polite">{resumen}</p>
      </div>
    </section>
  );
}

// CSS: copia las reglas .hero, .photo, .scrim, .content, .eyebrow, h1, .sub, .search, .field, .err, .go, .chips y .summary (y sus @media) de la pestaña HTML + CSS.
