// Single source of truth: add a category/language here, drop files in content/templates/<slug>/.
export const CATEGORIES: Record<string, { label: string; blurb: string; icon: string }> = {
  'paleta-de-color': { label: 'Paletas de color', blurb: 'Tokens, escalas y modo oscuro listos para pegar.', icon: '◐' },
  tablas: { label: 'Tablas', blurb: 'Datos tabulares ordenables, con estilo y accesibles.', icon: '▦' },
  barras: { label: 'Barras', blurb: 'Gráficos de barras y barras de progreso sin librerías.', icon: '▮' },
  grids: { label: 'Grids', blurb: 'Layouts responsivos con CSS Grid.', icon: '⊞' },
  tarjetas: { label: 'Tarjetas', blurb: 'Cards y métricas para dashboards.', icon: '▢' },
};

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
  .sort((a, b) => a.title.localeCompare(b.title));

// Prefix with the Pages base path (e.g. /templates-hub).
export const url = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + p;
