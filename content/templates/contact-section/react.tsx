import { useState, type FormEvent } from 'react';

type Field = 'name' | 'email' | 'topic' | 'message';
const MSG: Record<Field, string> = {
  name: 'Escribe tu nombre para saber a quién responder.',
  email: 'Escribe un correo válido, por ejemplo ana@empresa.com.',
  topic: 'Elige un tema para dirigir tu mensaje al equipo correcto.',
  message: 'Cuéntanos un poco más: el mensaje necesita al menos 20 caracteres.',
};
type FieldEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function ContactSection({ onSend }: { onSend?: (data: Record<Field, string>) => void }) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState('');

  const check = (el: FieldEl) => {
    const name = el.name as Field;
    setErrors((e) => ({ ...e, [name]: el.checkValidity() ? '' : MSG[name] }));
    return !el.checkValidity();
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const bad = (['name', 'email', 'topic', 'message'] as Field[]).map((f) => form.elements.namedItem(f) as FieldEl).filter(check);
    if (bad.length) { setStatus(''); return bad[0].focus(); }
    const data = Object.fromEntries(new FormData(form)) as Record<Field, string>;
    setStatus(`Mensaje enviado. Te respondemos en un día hábil en ${data.email}.`);
    onSend?.(data);
    form.reset();
  };
  const field = (f: Field) => ({
    id: `cf-${f}`, name: f, required: true, 'aria-invalid': !!errors[f], 'aria-describedby': `cf-${f}-err`,
    onInput: (e: FormEvent<FieldEl>) => errors[f] && check(e.currentTarget),
  });
  const err = (f: Field) => <p className="err" id={`cf-${f}-err`}>{errors[f]}</p>;

  return (
    <section className="contact" aria-labelledby="ct-title">
      <div>
        <h2 id="ct-title">Hablemos de tu proyecto</h2>
        <p className="lead">Cuéntanos qué necesitas y te ponemos en contacto con la persona adecuada.</p>
        <dl className="info">
          <div><dt>Correo</dt><dd><a href="mailto:contacto@ejemplo.com">contacto@ejemplo.com</a></dd></div>
          <div><dt>Teléfono</dt><dd><a href="tel:+34910000000">+34 910 000 000</a></dd></div>
          <div><dt>Oficina</dt><dd>Calle de Alcalá 21, 28014 Madrid</dd></div>
          <div><dt>Horario</dt><dd>Lunes a viernes, de 9:00 a 18:00 (CET)</dd></div>
        </dl>
      </div>
      <form noValidate onSubmit={submit}>
        <div><label htmlFor="cf-name">Nombre</label><input {...field('name')} autoComplete="name" />{err('name')}</div>
        <div><label htmlFor="cf-email">Correo</label><input {...field('email')} type="email" autoComplete="email" />{err('email')}</div>
        <div>
          <label htmlFor="cf-topic">Tema</label>
          <select {...field('topic')} defaultValue="">
            <option value="">Elige un tema</option>
            {['Ventas', 'Soporte técnico', 'Prensa', 'Otro'].map((t) => <option key={t}>{t}</option>)}
          </select>
          {err('topic')}
        </div>
        <div><label htmlFor="cf-message">Mensaje</label><textarea {...field('message')} minLength={20} />{err('message')}</div>
        <button type="submit">Enviar mensaje</button>
        <p className="status" role="status">{status}</p>
      </form>
    </section>
  );
}

// CSS: copia las reglas .contact, .lead, .info, form, label, input/select/textarea, .err, button y .status de la pestaña HTML + CSS.
