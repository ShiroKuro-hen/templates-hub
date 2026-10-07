// Valida el contenido de content/templates antes de compilar. Sin dependencias: `node scripts/validate.mjs`.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'content', 'templates');
const data = readFileSync(join(root, 'src', 'lib', 'data.ts'), 'utf8');

// Categorías y grupos declarados en data.ts (fuente única de verdad).
const catBlock = data.slice(data.indexOf('export const CATEGORIES'), data.indexOf('// shiki')).split('export const GROUPS')[0];
const CATS = new Set([...catBlock.matchAll(/^\s{2}['"]?([a-z0-9-]+)['"]?:\s*\{\s*label:/gm)].map((m) => m[1]));
const groupBlock = data.slice(data.indexOf('export const GROUPS'));
const inGroups = [...groupBlock.matchAll(/cats:\s*\[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));

const errors = [];
const warns = [];
const err = (slug, msg) => errors.push(`${slug}: ${msg}`);

for (const c of CATS) if (!inGroups.includes(c)) err('data.ts', `la categoría "${c}" no pertenece a ningún grupo`);
for (const c of new Set(inGroups)) if (!CATS.has(c)) err('data.ts', `el grupo referencia la categoría inexistente "${c}"`);
if (inGroups.length !== new Set(inGroups).size) err('data.ts', 'una categoría aparece en más de un grupo');

const REQUIRED = ['meta.json', 'prompt.md', 'html.html', 'tailwind.html', 'react.tsx', 'vue.vue'];
// Restos del estilo anterior: el sistema de diseño actual son los tokens "Ion".
const OLD_STYLE = /#17130f|#f6f1e7|#ff5a36|#ffd84d|\b\d+px \d+px 0(?:px)? (?:#|var\(|rgba?\()|border-black/i; // sombra dura = "4px 4px 0 <color>"
const EXTERNAL = /<script[^>]+src=["']?https?:|<link[^>]+href=["']?https?:|@import\s+url\(\s*["']?https?:|url\(\s*["']?https?:/i;

const slugs = readdirSync(dir).filter((d) => statSync(join(dir, d)).isDirectory());
const perCat = {};

for (const slug of slugs) {
  const p = (f) => join(dir, slug, f);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(slug, 'el slug debe ser kebab-case en minúsculas');
  const missing = REQUIRED.filter((f) => !existsSync(p(f)) || statSync(p(f)).size === 0);
  if (missing.length) { err(slug, `faltan o están vacíos: ${missing.join(', ')}`); continue; }

  let meta;
  try { meta = JSON.parse(readFileSync(p('meta.json'), 'utf8')); } catch { err(slug, 'meta.json no es JSON válido'); continue; }
  if (!meta.title?.trim()) err(slug, 'meta.json sin title');
  if (!CATS.has(meta.category)) err(slug, `categoría desconocida "${meta.category}"`);
  if (!meta.description?.trim()) err(slug, 'meta.json sin description');
  else if (meta.description.length > 100) err(slug, `description de ${meta.description.length} caracteres (máx. 100)`);
  if (!Array.isArray(meta.tags) || !meta.tags.length) err(slug, 'meta.json necesita tags (array no vacío)');
  perCat[meta.category] = (perCat[meta.category] ?? 0) + 1;

  if (readFileSync(p('prompt.md'), 'utf8').trim().length < 40) err(slug, 'prompt.md demasiado corto');

  const html = readFileSync(p('html.html'), 'utf8');
  const tw = readFileSync(p('tailwind.html'), 'utf8');
  const react = readFileSync(p('react.tsx'), 'utf8');
  const vue = readFileSync(p('vue.vue'), 'utf8');

  if (!/^\s*<!doctype html>/i.test(html)) err(slug, 'html.html debe empezar con <!doctype html>');
  if (!/data-theme/.test(html)) err(slug, 'html.html sin tokens de tema oscuro (:root[data-theme=dark])');
  if (!/<\/head>/i.test(html)) err(slug, 'html.html sin </head> (el sitio inyecta el tema ahí)');
  if (EXTERNAL.test(html)) err(slug, 'html.html carga recursos externos (la vista previa no debe usar red)');
  if (!/export\s/.test(react)) err(slug, 'react.tsx sin export');
  if (!/<template>/.test(vue) || !/<script setup/.test(vue)) err(slug, 'vue.vue debe tener <script setup> y <template>');
  for (const [name, txt] of [['html.html', html], ['tailwind.html', tw], ['react.tsx', react], ['vue.vue', vue]]) {
    if (OLD_STYLE.test(txt)) err(slug, `${name} contiene estilo antiguo (colores/sombras previos a Ion)`);
  }

  // Sintaxis de los <script> inline (no detecta errores de ejecución: eso lo cubre audit-previews).
  for (const [name, txt] of [['html.html', html], ['tailwind.html', tw]]) {
    for (const m of txt.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type=["'](?!module|text\/javascript))[^>]*>([\s\S]*?)<\/script>/gi)) {
      try { new vm.Script(m[1]); } catch (e) { err(slug, `${name}: error de sintaxis en <script>: ${e.message}`); }
    }
  }
}

const dupTitles = {};
for (const slug of slugs) {
  try { const t = JSON.parse(readFileSync(join(dir, slug, 'meta.json'), 'utf8')).title; (dupTitles[t] ??= []).push(slug); } catch {}
}
for (const [t, s] of Object.entries(dupTitles)) if (s.length > 1) warns.push(`título repetido "${t}": ${s.join(', ')}`);
for (const c of CATS) if (!perCat[c]) warns.push(`la categoría "${c}" no tiene componentes`);

console.log(`Plantillas: ${slugs.length} · categorías: ${CATS.size} · grupos: ${new Set(inGroups).size ? 'ok' : 'vacío'}`);
for (const w of warns) console.log(`⚠ ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} error(es):`);
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log('✓ contenido válido');
