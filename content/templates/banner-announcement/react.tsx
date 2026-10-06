import { useState, type ReactNode } from 'react';

type Props = {
  tag?: string;
  children: ReactNode;
  href?: string;
  linkText?: string;
  onClose?: () => void;
};

export function AnnouncementBanner({
  tag = 'Nuevo',
  children,
  href = '#novedades',
  linkText = 'Ver novedades',
  onClose,
}: Props) {
  const [off, setOff] = useState(false);
  const close = () => { setOff(true); onClose?.(); };

  return (
    <section className={`banner${off ? ' off' : ''}`} aria-label="Anuncio">
      <div>
        <div className="inner">
          <p>
            <span className="tag">{tag}</span>
            {children} <a href={href}>{linkText}</a>
          </p>
          <button type="button" className="x" aria-label="Cerrar anuncio" onClick={close}>×</button>
        </div>
      </div>
    </section>
  );
}

// Uso: <AnnouncementBanner>Ya puedes exportar tus informes a PDF.</AnnouncementBanner>
// CSS: copia las reglas .banner / .banner > div / .banner.off / .inner / .inner p / .inner a / .tag / .x de la pestaña HTML + CSS.
