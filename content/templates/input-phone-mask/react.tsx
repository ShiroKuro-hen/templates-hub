import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';

const PAISES = [
  { code: '51', name: 'Perú', mask: '### ### ###' },
  { code: '52', name: 'México', mask: '## #### ####' },
  { code: '57', name: 'Colombia', mask: '### ### ####' },
  { code: '56', name: 'Chile', mask: '# #### ####' },
  { code: '34', name: 'España', mask: '### ## ## ##' },
];
type Pais = (typeof PAISES)[number];
type Estado = 'idle' | 'error' | 'ok';

const maxOf = (p: Pais) => p.mask.split('#').length - 1;
const soloDigitos = (v: string, p: Pais) => {
  const t = v.trim();
  return (t.startsWith('+' + p.code) ? t.slice(p.code.length + 1) : t).replace(/\D/g, '').slice(0, maxOf(p));
};
function formatear(d: string, mask: string) {
  let out = '', i = 0;
  for (const c of mask) { if (i >= d.length) break; out += c === '#' ? d[i++] : c; }
  return out;
}

export function InputPhoneMask() {
  const [code, setCode] = useState('51');
  const [d, setD] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const input = useRef<HTMLInputElement>(null);
  const p = PAISES.find((x) => x.code === code)!;
  const max = maxOf(p), k = max - d.length, plural = k > 1 ? 's' : '';

  const onTel = (e: ChangeEvent<HTMLInputElement>) => { setD(soloDigitos(e.target.value, p)); setEstado('idle'); };
  const onPais = (e: ChangeEvent<HTMLSelectElement>) => {
    const n = PAISES.find((x) => x.code === e.target.value)!;
    setCode(n.code); setD(d.slice(0, maxOf(n))); setEstado('idle');
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setEstado(k ? 'error' : 'ok');
    if (k) input.current?.focus();
  };

  const texto = estado === 'error' ? `Faltan ${k} dígito${plural}. Un número de ${p.name} tiene ${max}.`
    : estado === 'ok' ? `Número guardado: +${p.code} ${formatear(d, p.mask)}.`
    : !d ? `Un número de ${p.name} tiene ${max} dígitos.`
    : k ? `Faltan ${k} dígito${plural}.` : `Se guardará como +${p.code}${d}.`;
  const cls = estado === 'error' ? 'err' : !k ? 'ok' : '';

  return (
    <main className="card">
      <form onSubmit={submit} noValidate>
        <h1>Teléfono de contacto</h1>
        <p className="sub">Solo lo usaremos para confirmar tu pedido.</p>
        <label htmlFor="tel">Número de teléfono</label>
        <div className={estado === 'error' ? 'grp bad' : 'grp'}>
          <select aria-label="País" autoComplete="tel-country-code" value={code} onChange={onPais}>
            {PAISES.map((x) => <option key={x.code} value={x.code}>{x.name} +{x.code}</option>)}
          </select>
          <input ref={input} id="tel" type="tel" inputMode="numeric" autoComplete="tel-national"
            aria-describedby="h" aria-invalid={estado === 'error'} value={formatear(d, p.mask)}
            placeholder={formatear('9876543210', p.mask)} onChange={onTel} />
        </div>
        <div className="meter" aria-hidden="true"><i style={{ width: `${(d.length / max) * 100}%` }} /></div>
        <p id="h" className={`hint ${cls}`} aria-live="polite">{texto}</p>
        <div className="row"><button className="btn">Guardar número</button></div>
      </form>
    </main>
  );
}

// CSS: copia las reglas .card, .grp, select, input, .meter, .hint y .btn de la pestaña HTML + CSS.
