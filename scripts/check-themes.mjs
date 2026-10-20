// Comprueba src/lib/themes.json: estructura y contraste WCAG frente a los tokens Ion. Sin dependencias: `node scripts/check-themes.mjs`.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const themes = JSON.parse(readFileSync(join(root, 'src', 'lib', 'themes.json'), 'utf8'));
const ionCss = readFileSync(join(root, 'content', 'templates', 'alert-variants', 'html.html'), 'utf8');

const MODES = ['light', 'dark'];
const BACKDROP = { light: [255, 255, 255], dark: [0, 0, 0] };
const PAIRS = [['--text', '--bg'], ['--text', '--surface'], ['--muted', '--surface'], ['--accent-ink', '--accent'], ['--accent', '--surface'],
  ...['ok', 'warn', 'err', 'info'].map((s) => ['--text', `--${s}-soft`])];
const MIN_RATIO = 4.5;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const declarations = (block) => Object.fromEntries([...block.matchAll(/(--[a-z-]+):\s*([^;]+)/g)].map(([, k, v]) => [k, v.trim()]));
const lightBase = declarations(ionCss.match(/:root\{([^}]*)\}/)[1]);
const ION = { light: lightBase, dark: { ...lightBase, ...declarations(ionCss.match(/:root\[data-theme=dark\]\{([^}]*)\}/)[1]) } };
const TOKENS = [...Object.keys(lightBase), '--accent-2'];

function parseColor(value) {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)).concat(1);
  }
  const args = value.match(/^rgba?\((.*)\)$/i)?.[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  if (args?.length === 3 || args?.length === 4) return [...args.slice(0, 3), args[3] ?? 1];
  return null;
}

function toRgb(value, backdrop) {
  const color = parseColor(value);
  if (!color) return null;
  const [r, g, b, a] = color;
  return [r, g, b].map((ch, i) => a * ch + (1 - a) * backdrop[i]);
}

const linear = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (rgb) => {
  const [r, g, b] = rgb.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const tokenValue = (theme, mode, name) => theme[mode]?.[name] ?? ION[mode][name];

function pairFailure(theme, mode, fg, bg) {
  const label = `${theme.id}/${mode}: ${fg} on ${bg}`;
  const page = toRgb(tokenValue(theme, mode, '--bg'), BACKDROP[mode]);
  const colors = [fg, bg].map((name) => toRgb(tokenValue(theme, mode, name), page));
  if (colors.includes(null)) return `${label} (valor no es hex ni rgb)`;
  const ratio = contrast(...colors);
  return ratio >= MIN_RATIO ? null : `${label} = ${ratio.toFixed(2)} (mín ${MIN_RATIO})`;
}

function structureErrors(theme) {
  const { id, label } = theme;
  const errors = [];
  if (!KEBAB.test(id ?? '')) errors.push(`${id}: el id debe ser kebab-case en minúsculas`);
  if (!label?.trim()) errors.push(`${id}: falta label`);
  for (const mode of MODES) {
    for (const key of Object.keys(theme[mode] ?? {})) {
      if (!TOKENS.includes(key)) errors.push(`${id}/${mode}: el token ${key} no existe en Ion`);
    }
  }
  return errors;
}

function duplicateErrors() {
  const ids = themes.map((t) => t.id);
  return [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].map((id) => `${id}: id duplicado`);
}

const errors = [...duplicateErrors(), ...themes.flatMap(structureErrors)];
let checks = 0;
for (const theme of themes) {
  for (const mode of MODES) {
    for (const [fg, bg] of PAIRS) {
      checks++;
      const failure = pairFailure(theme, mode, fg, bg);
      if (failure) errors.push(failure);
    }
  }
}

if (errors.length) {
  console.error(`\n${errors.length} error(es):`);
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`${themes.length} temas, ${checks} comprobaciones OK`);
