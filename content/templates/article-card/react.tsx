type Article = {
  titulo: string; href: string; extracto: string; etiqueta: string;
  autor: string; fecha: string; minutos: number;
};
const DEMO: Article = {
  titulo: 'Cómo redujimos la latencia de la API un 40 %', href: '#', etiqueta: 'Ingeniería',
  extracto: 'Medimos cada salto de red, movimos la caché al borde y eliminamos consultas duplicadas. Esto es lo que aprendimos.',
  autor: 'Lucía Martín', fecha: '2026-09-28', minutos: 6,
};
const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const initials = (s: string) => s.split(' ').map((w) => w[0]).slice(0, 2).join('');

export function ArticleCard({ a = DEMO }: { a?: Article }) {
  return (
    <article className="article">
      <svg className="cover" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
        <path d="M0 40h320M0 80h320M0 120h320M80 0v160M160 0v160M240 0v160" fill="none" stroke="currentColor" strokeOpacity=".25" />
        <path d="M0 130 C60 120 90 60 150 70 S250 30 320 20" fill="none" stroke="url(#ln)" strokeWidth="3" />
        <circle cx="150" cy="70" r="5" fill="currentColor" />
      </svg>
      <div className="body">
        <span className="tag">{a.etiqueta}</span>
        <h3><a href={a.href}>{a.titulo}</a></h3>
        <p className="excerpt">{a.extracto}</p>
        <div className="meta">
          <span className="avatar" aria-hidden="true">{initials(a.autor)}</span>
          <span className="author">{a.autor}</span>
          <time dateTime={a.fecha}>{fmt.format(new Date(a.fecha))}</time>
          <span className="read">{a.minutos} min de lectura</span>
        </div>
      </div>
    </article>
  );
}

// CSS: copia las reglas .article, .cover, .body, .tag, h3, .excerpt, .meta, .avatar, .author y .read de la pestaña HTML + CSS.
