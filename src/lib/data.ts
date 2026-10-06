// Single source of truth: add a category/language here, drop files in content/templates/<slug>/.
export const CATEGORIES: Record<string, { label: string; blurb: string; icon: string }> = {
  'paleta-de-color': { label: 'Paletas de color', blurb: 'Tokens, escalas y modo oscuro listos para pegar.', icon: '◐' },
  tablas: { label: 'Tablas', blurb: 'Datos tabulares ordenables, con estilo y accesibles.', icon: '▦' },
  barras: { label: 'Barras', blurb: 'Gráficos de barras y barras de progreso sin librerías.', icon: '▮' },
  grids: { label: 'Grids', blurb: 'Layouts responsivos con CSS Grid.', icon: '⊞' },
  tarjetas: { label: 'Tarjetas', blurb: 'Cards y métricas para dashboards.', icon: '▢' },
  botones: { label: 'Botones', blurb: 'Variantes, tamaños, estados y grupos de botones.', icon: '◉' },
  etiquetas: { label: 'Etiquetas', blurb: 'Badges, chips, tags y estados.', icon: '◈' },
  notificaciones: { label: 'Notificaciones', blurb: 'Toasts, alertas y mensajes en línea.', icon: '◔' },
  modales: { label: 'Modales y capas', blurb: 'Diálogos, drawers, tooltips y popovers.', icon: '◫' },
  iconos: { label: 'Iconos', blurb: 'Sets SVG en línea, botones de icono y sprites.', icon: '✦' },
  formularios: { label: 'Formularios', blurb: 'Inputs, selects, toggles y validación.', icon: '▤' },
  navegacion: { label: 'Navegación', blurb: 'Navbar, tabs, breadcrumbs, paginación y sidebar.', icon: '☰' },
  cargando: { label: 'Cargando', blurb: 'Spinners, skeletons y estados vacíos.', icon: '◌' },
  tipografia: { label: 'Tipografía', blurb: 'Escalas, titulares, texto largo y bloques de código.', icon: 'Aa' },
  elementos: { label: 'Elementos UI', blurb: 'Acordeones, avatares, ratings, steppers y timelines.', icon: '❖' },
  secciones: { label: 'Secciones de landing', blurb: 'Hero, features, testimonios, FAQ y footer.', icon: '▭' },
  graficos: { label: 'Gráficos', blurb: 'Donut, líneas, sparklines y heatmaps en SVG.', icon: '◔' },
  paginas: { label: 'Páginas completas', blurb: 'Login, dashboard, ajustes y precios listos para adaptar.', icon: '▣' },
  ecommerce: { label: 'Comercio', blurb: 'Carrito, checkout, galerías de producto y reseñas.', icon: '⛁' },
  dashboards: { label: 'Dashboards', blurb: 'Analítica, actividad, uso y estado del sistema.', icon: '◧' },
  autenticacion: { label: 'Cuenta y acceso', blurb: 'Login, 2FA, sesiones, claves API e invitaciones.', icon: '⚿' },
  onboarding: { label: 'Onboarding', blurb: 'Checklists, tours, asistentes y anuncios de producto.', icon: '➤' },
  mensajeria: { label: 'Mensajería', blurb: 'Chat, comentarios, menciones y reacciones.', icon: '✉' },
  medios: { label: 'Medios', blurb: 'Reproductores, galerías, comparadores y subida de imágenes.', icon: '▶' },
  filtros: { label: 'Búsqueda y filtros', blurb: 'Filtros facetados, sugerencias, orden y vistas guardadas.', icon: '⌕' },
  documentos: { label: 'Documentación', blurb: 'Layouts de docs, índice, avisos y referencia de API.', icon: '❡' },
  animaciones: { label: 'Animaciones', blurb: 'Hover, scroll, contadores y transiciones con CSS.', icon: '≋' },
};

// Agrupación estilo design-system de gran empresa (orden de la home).
export const GROUPS: { label: string; blurb: string; cats: string[] }[] = [
  { label: 'Fundamentos', blurb: 'Color, tipografía, iconografía y movimiento.', cats: ['paleta-de-color', 'tipografia', 'iconos', 'animaciones'] },
  { label: 'Componentes', blurb: 'Los bloques de toda interfaz.', cats: ['botones', 'etiquetas', 'formularios', 'tarjetas', 'elementos'] },
  { label: 'Feedback', blurb: 'Comunicar estados al usuario.', cats: ['notificaciones', 'modales', 'cargando'] },
  { label: 'Navegación y búsqueda', blurb: 'Moverse, buscar y filtrar.', cats: ['navegacion', 'filtros'] },
  { label: 'Datos', blurb: 'Mostrar y visualizar información.', cats: ['tablas', 'barras', 'graficos', 'dashboards'] },
  { label: 'Producto y negocio', blurb: 'Flujos completos de una aplicación.', cats: ['autenticacion', 'onboarding', 'ecommerce'] },
  { label: 'Contenido y comunicación', blurb: 'Chat, medios y documentación.', cats: ['mensajeria', 'medios', 'documentos'] },
  { label: 'Layout y páginas', blurb: 'Estructura y secciones completas.', cats: ['grids', 'secciones', 'paginas'] },
];

// shiki = lenguaje de resaltado, ext = extensión del archivo en content/templates/<slug>/
export const LANGS: Record<string, { label: string; ext: string; shiki: string }> = {
  html: { label: 'HTML + CSS', ext: 'html', shiki: 'html' },
  css: { label: 'CSS', ext: 'css', shiki: 'css' },
  tailwind: { label: 'Tailwind', ext: 'html', shiki: 'html' },
  react: { label: 'React', ext: 'tsx', shiki: 'tsx' },
  vue: { label: 'Vue', ext: 'vue', shiki: 'vue' },
};

export type Template = {
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  prompt: string;
  code: Record<string, string>;
};

const files = import.meta.glob('/content/templates/*/*', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const bySlug: Record<string, Partial<Template> & { code: Record<string, string> }> = {};
for (const [path, raw] of Object.entries(files)) {
  const [slug, file] = path.split('/').slice(-2);
  const t = (bySlug[slug] ??= { code: {} });
  if (file === 'meta.json') Object.assign(t, JSON.parse(raw));
  else if (file === 'prompt.md') t.prompt = raw.trim();
  else t.code[file.split('.')[0]] = raw.trimEnd();
}

export const templates: Template[] = Object.entries(bySlug)
  .map(([slug, t]) => ({ slug, tags: [], prompt: '', description: '', ...t }) as Template)
  .filter((t) => t.title && CATEGORIES[t.category]) // carpeta sin meta válido = aún no publicada
  .sort((a, b) => a.title.localeCompare(b.title));

// Orden de lectura del sidebar: grupo → categoría → título.
export const ordered: Template[] = GROUPS.flatMap((g) => g.cats.flatMap((c) => templates.filter((t) => t.category === c)));
export const groupOf = (cat: string) => GROUPS.find((g) => g.cats.includes(cat))!;

// Prefix with the Pages base path (e.g. /templates-hub).
export const url = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + p;
