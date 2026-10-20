// Compara cada tailwind.html con su html.html (la vista previa) en claro y oscuro, y prueba que no desborde ni falle.
// Uso: npm run verify:tailwind [-- slug1,slug2 | all] [--probe] [--out carpeta]
//   --probe  pulsa los controles de cada fragmento y falla ante errores de JavaScript.
//   --out    guarda capturas html/tailwind de cada componente para revisarlas a ojo.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const templates = join(root, 'content', 'templates');
const MAX_DIFF = 0.05;
const MAX_OVERFLOW = 1;
const PAGE_PADDING = 20;
const [size, narrow] = [{ width: 900, height: 600 }, { width: 360, height: 640 }];

const args = process.argv.slice(2);
const flagValue = (flag) => args[args.indexOf(flag) + 1];
const probe = args.includes('--probe');
const outDir = args.includes('--out') ? flagValue('--out') : null;
const wanted = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out') ?? 'all';

const CANDIDATES = [
  process.env.CHROME_BIN,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const executablePath = CANDIDATES.find((c) => existsSync(c));
if (!executablePath) { console.error('No encontré Chrome/Edge. Define CHROME_BIN.'); process.exit(2); }

const slugs = readdirSync(templates).filter((d) => existsSync(join(templates, d, 'tailwind.html')));
const selected = wanted === 'all' ? slugs : wanted.split(',');
const unknown = selected.filter((s) => !slugs.includes(s));
if (unknown.length) { console.error(`Sin tailwind.html: ${unknown.join(', ')}`); process.exit(2); }

const cache = join(root, 'node_modules', '.cache');
mkdirSync(cache, { recursive: true });
const work = mkdtempSync(join(cache, 'verify-tailwind-'));
const fragments = join(work, 'fragments');
mkdirSync(fragments);
for (const slug of slugs) copyFileSync(join(templates, slug, 'tailwind.html'), join(fragments, `${slug}.html`));

const setup = readFileSync(join(root, 'src', 'lib', 'tailwind-setup.css'), 'utf8');
const input = join(work, 'in.css');
const output = join(work, 'out.css');
writeFileSync(input, `${setup.replace('@import "tailwindcss";', '@import "tailwindcss" source(none);')}\n@source "./fragments";\n`);
execFileSync(process.execPath, [join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs'), '-i', input, '-o', output], { stdio: ['ignore', 'ignore', 'inherit'] });
const css = readFileSync(output, 'utf8');
const tokens = setup.match(/:root\{[^}]*\}\s*:root\[data-theme=dark\]\{[^}]*\}/)[0];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--no-sandbox'] });
const tab = await browser.newPage();
let pageErrors = [];
tab.on('pageerror', (e) => pageErrors.push(e.message.split('\n')[0].slice(0, 110)));

async function render(page, viewport) {
  await tab.setViewport(viewport);
  await tab.goto('about:blank');
  await tab.setContent(page);
  await sleep(250);
}
const htmlPage = (slug, mode) => readFileSync(join(templates, slug, 'html.html'), 'utf8').replace('<html', `<html data-theme="${mode}"`);
const tailwindPage = (slug, mode) =>
  `<!doctype html><html data-theme="${mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${tokens}${css}body{margin:0;padding:${PAGE_PADDING}px;background:var(--bg);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}</style></head><body>${readFileSync(join(fragments, `${slug}.html`), 'utf8')}</body></html>`;
const shot = async () => PNG.sync.read(await tab.screenshot({ clip: { x: 0, y: 0, ...size } }));
const overflow = () => tab.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function clickControls() {
  const controls = await tab.$$('button, [role=tab], summary, [role=switch], input[type=checkbox], input[type=radio], select, [tabindex="0"]');
  for (const el of controls.slice(0, 14)) {
    try {
      if (!(await el.evaluate((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; }))) continue;
      await el.click({ delay: 10 });
    } catch {}
    await sleep(60);
  }
  await tab.keyboard.press('Escape');
}

async function measure(slug) {
  pageErrors = [];
  const result = { slug, diff: 0, overflowHtml: 0, overflowTailwind: 0, errors: [] };
  for (const mode of ['light', 'dark']) {
    await render(htmlPage(slug, mode), size);
    const reference = await shot();
    await render(tailwindPage(slug, mode), size);
    const candidate = await shot();
    if (probe && mode === 'light') await clickControls();
    result.diff = Math.max(result.diff, pixelmatch(reference.data, candidate.data, null, size.width, size.height, { threshold: 0.15 }) / (size.width * size.height));
    if (outDir) {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, `${slug}-${mode}-html.png`), PNG.sync.write(reference));
      writeFileSync(join(outDir, `${slug}-${mode}-tailwind.png`), PNG.sync.write(candidate));
    }
  }
  await render(htmlPage(slug, 'light'), narrow);
  result.overflowHtml = await overflow();
  await render(tailwindPage(slug, 'light'), narrow);
  result.overflowTailwind = await overflow();
  result.errors = [...new Set(pageErrors)];
  return result;
}

const results = [];
for (const slug of selected) results.push(await measure(slug));
await browser.close();
rmSync(work, { recursive: true, force: true });

// Las paletas muestran colores de Tailwind a propósito: se informan, pero no fallan.
const isPalette = (r) => r.slug.startsWith('palette-');
const problems = (r) => [
  r.diff > MAX_DIFF && `difiere ${(r.diff * 100).toFixed(1)} % del HTML`,
  r.overflowTailwind > MAX_OVERFLOW && `desborda ${r.overflowTailwind}px a 360px (el HTML: ${r.overflowHtml}px)`,
  r.errors.length && `errores: ${r.errors.join(' | ')}`,
].filter(Boolean);
const failing = results.filter((r) => !isPalette(r) && problems(r).length);
const mean = results.reduce((s, r) => s + r.diff, 0) / results.length;
for (const r of failing) console.error(`✗ ${r.slug}: ${problems(r).join('; ')}`);
console.log(`${results.length} componentes, diferencia media ${(mean * 100).toFixed(2)} %${probe ? ', con sonda de controles' : ''}`);
if (failing.length) { console.error(`\n${failing.length} componente(s) con problemas`); process.exit(1); }
console.log('✓ tailwind.html coincide con html.html');
