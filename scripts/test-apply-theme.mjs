// Comprueba applyTheme (src/lib/apply-theme.ts) con los temas de themes.json. Sin dependencias: `node scripts/test-apply-theme.mjs`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyTheme } from '../src/lib/apply-theme.ts';
import { customize, toParams, fromParams } from '../src/lib/customize.ts';
import { stylePrompt } from '../src/lib/style-prompt.ts';

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

const ion = byId('ion');
const yellow = customize(ion, { accent: '#ffe600' }).light;
const blue = customize(ion, { accent: '#0000ee' }).light;
assert.equal(yellow['--accent-ink'], '#000000');
assert.equal(blue['--accent-ink'], '#ffffff');
assert.equal(yellow['--accent-soft'], 'color-mix(in srgb,#ffe600 14%,var(--bg))');
assert.equal(yellow['--accent-2'], 'color-mix(in srgb,#ffe600 55%,#ffffff)');

assert.equal(customize(ion, { radius: -5 }).light['--radius'], '0px');
assert.equal(customize(ion, { radius: 99 }).dark['--radius'], '32px');
assert.equal(customize(ion, { radius: 12.7 }).light['--radius'], '13px');

const ignored = customize(ion, { accent: 'red', shadow: 'bogus', font: 'comic' });
assert.deepEqual(ignored, ion);

const before = structuredClone(ion);
customize(ion, { accent: '#ffe600', radius: 4, shadow: 'hard', font: 'serif' });
assert.deepEqual(ion, before);
assert.deepEqual(customize(ion, {}), ion);
assert.deepEqual(customize(byId('mono'), {}), byId('mono'));

const overrides = { accent: '#ffe600', radius: 12, shadow: 'soft', font: 'mono' };
assert.deepEqual(fromParams(toParams('mono', overrides)), { styleId: 'mono', overrides });
assert.deepEqual(fromParams(new URLSearchParams('a=zzzzzz&r=abc&sh=bogus')).overrides, {});
assert.equal(fromParams(new URLSearchParams('a=ffe600')).styleId, null);

const rounded = applyTheme(html, customize(ion, { radius: 12 }));
const [roundedLight, roundedDark] = blocks(rounded);
assert.ok(roundedLight.includes('--radius:12px'));
assert.ok(roundedDark.includes('--radius:12px'));

assert.equal(stylePrompt(ion), '');
const brutalPrompt = stylePrompt(byId('brutal'));
assert.ok(brutalPrompt.includes('Estilo visual: Brutal.'));
assert.ok(brutalPrompt.includes('radio de esquina: 0px'));
assert.ok(brutalPrompt.endsWith('en lugar de colores fijos.'));
const custom = stylePrompt(customize(ion, { accent: '#ff0066', radius: 12 }));
assert.ok(custom.includes('#ff0066') && custom.includes('12px'));
assert.ok(stylePrompt(byId('terminal')).includes(`fuente: ${byId('terminal').font}`));

console.log('applyTheme OK');
