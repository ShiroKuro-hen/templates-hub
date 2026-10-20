// Comprueba applyTheme (src/lib/apply-theme.ts) con los temas de themes.json. Sin dependencias: `node scripts/test-apply-theme.mjs`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyTheme } from '../src/lib/apply-theme.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const themes = JSON.parse(readFileSync(join(root, 'src', 'lib', 'themes.json'), 'utf8'));
const byId = (id) => themes.find((t) => t.id === id);
const read = (name) => readFileSync(join(root, 'content', 'templates', 'alert-variants', name), 'utf8');
const html = read('html.html');
const vue = read('vue.vue');
const blocks = (code) => code.match(/:root(\[data-theme=dark\])?\{[^}]*\}/g);

const replaced = applyTheme(html, { id: 't', label: 't', light: { '--bg': '#ffffff' }, dark: { '--bg': '#000000' } });
assert.ok(replaced.includes(':root{--bg:#ffffff;'));
assert.ok(replaced.includes(':root[data-theme=dark]{--bg:#000000;'));

const appended = applyTheme(html, { id: 't', label: 't', light: { '--accent-2': '#123456' }, dark: {} });
assert.ok(blocks(appended)[0].endsWith(';--accent-2:#123456}'));

const terminal = byId('terminal');
assert.ok(applyTheme(html, terminal).includes(`}body{font-family:${terminal.font}}`));

assert.equal(applyTheme(html, byId('ion')), html);
assert.equal(applyTheme(vue, byId('brutal')), vue);

const brutal = applyTheme(html, byId('brutal'));
const [lightBlock, darkBlock] = blocks(brutal);
assert.ok(lightBlock.includes('--radius:0px'));
assert.ok(darkBlock.includes('--radius:0px'));
assert.ok(brutal.includes('--ok:'));

console.log('applyTheme OK');
