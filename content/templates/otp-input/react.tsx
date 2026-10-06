import { useRef, useState, type CSSProperties, type ClipboardEvent, type KeyboardEvent } from 'react';

const LEN = 6;

export function OtpInput({ onComplete }: { onComplete?: (code: string) => void }) {
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join('');
  const focus = (i: number) => refs.current[Math.max(0, Math.min(i, LEN - 1))]?.focus();

  const fill = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, LEN - i);
    const next = [...digits];
    [...d].forEach((c, j) => (next[i + j] = c));
    setDigits(next);
    focus(i + d.length);
  };
  const onChange = (i: number, value: string) => {
    const d = value.replace(/\D/g, '');
    if (d.length > 1) return fill(i, d); // autocompletado del SO
    setDigits(digits.map((x, j) => (j === i ? d : x)));
    if (d) focus(i + 1);
  };
  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault();
      setDigits(digits.map((x, j) => (j === i - 1 ? '' : x)));
      focus(i - 1);
    }
    if (e.key === 'ArrowLeft') { e.preventDefault(); focus(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); focus(i + 1); }
  };
  const onPaste = (i: number, e: ClipboardEvent) => { e.preventDefault(); fill(i, e.clipboardData.getData('text')); };

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); onComplete?.(code); }}>
      <fieldset>
        <legend>Introduce el código de verificación</legend>
        <p className="hint" id="hint">Lo enviamos por SMS al +51 ••• ••• 482.</p>
        <div className="otp" aria-describedby="hint">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} placeholder=" "
                   inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
                   aria-label={`Dígito ${i + 1} de ${LEN}`} onFocus={(e) => e.target.select()}
                   onChange={(e) => onChange(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} onPaste={(e) => onPaste(i, e)} />
          ))}
        </div>
        <div className="bar" aria-hidden="true"><i style={{ '--p': code.length / LEN } as CSSProperties} /></div>
      </fieldset>
      <div className="actions">
        <button type="button" className="ghost">Reenviar código</button>
        <button type="submit" disabled={code.length < LEN}>Verificar código</button>
      </div>
    </form>
  );
}

// CSS: copia las reglas form, fieldset, legend, .hint, .otp, .bar, .actions y button de la pestaña HTML + CSS.
