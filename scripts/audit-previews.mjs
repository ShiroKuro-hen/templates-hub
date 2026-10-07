// Abre cada vista previa (/preview/<slug>.html) en un Chrome/Edge sin cabeza, en claro y oscuro, y falla si hay
// errores de JavaScript, recursos que no cargan, tema sin aplicar o desbordes horizontales graves a 360px.
// Uso: node scripts/audit-previews.mjs [baseUrl]   (requiere el sitio sirviéndose, p. ej. `npm run preview`)
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4321/').replace(/\/?$/, '/');
const PORT = 9333 + Math.floor(Math.random() * 500);
const MAX_OVERFLOW = 40; // px: los tooltips ocultos pueden sumar unos pocos px; más que eso es un bug de layout
const CANDIDATES = [
  process.env.CHROME_BIN,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const browser = CANDIDATES.find((c) => existsSync(c));
if (!browser) { console.error('No encontré Chrome/Edge. Define CHROME_BIN.'); process.exit(2); }

const slugs = readdirSync(join(root, 'content', 'templates')).filter((d) => statSync(join(root, 'content', 'templates', d)).isDirectory());
const profile = mkdtempSync(join(tmpdir(), 'audit-'));
const proc = spawn(browser, ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws, id = 0, events = [];
const pending = new Map();
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.value;
const key = (k, code, vk, mods = 0) => send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, modifiers: mods })
  .then(() => send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, modifiers: mods }));

const problems = [];
const check = async (label, url, extra) => {
  events = [];
  await send('Page.navigate', { url });
  await sleep(400);
  const found = [...new Set(events)];
  if (extra) found.push(...(await extra()));
  if (found.length) problems.push(`${label}: ${found.join(' | ')}`);
};

try {
  let tabs;
  for (let n = 0; n < 40 && !tabs; n++) { try { tabs = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch { await sleep(500); } }
  if (!tabs) throw new Error('el navegador no arrancó');
  ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); }
    else if (d.method === 'Runtime.exceptionThrown') events.push('EXC ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).split('\n')[0].slice(0, 160));
    else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') events.push('CONSOLE ' + d.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 160));
    else if (d.method === 'Network.loadingFailed' && !d.params.canceled) events.push('NET ' + d.params.errorText);
  };
  await send('Runtime.enable'); await send('Network.enable'); await send('Page.enable');

  // 1) Páginas del sitio: sin errores, y la paleta de comandos funciona.
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await check('inicio', BASE);
  await check('categoría', `${BASE}c/${'tablas'}/`);
  await check(`plantilla`, `${BASE}t/${slugs[0]}/`, async () => {
    await key('k', 'KeyK', 75, 2);
    await sleep(300);
    return (await ev("document.getElementById('palette')?.open")) ? [] : ['la paleta de comandos (Ctrl+K) no abre'];
  });

  // 2) Vistas previas: claro y oscuro, a 360px.
  await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 700, deviceScaleFactor: 1, mobile: false });
  for (const theme of ['light', 'dark']) {
    for (const s of slugs) {
      await check(`${theme} ${s}`, `${BASE}preview/${s}.html?theme=${theme}`, async () => {
        const out = [];
        if ((await ev('document.documentElement.dataset.theme')) !== theme) out.push('tema no aplicado');
        const over = await ev('document.documentElement.scrollWidth - document.documentElement.clientWidth');
        if (over > MAX_OVERFLOW) out.push(`desborde horizontal de ${over}px a 360px`);
        return out;
      });
    }
  }
  console.log(`Auditadas ${slugs.length} vistas previas x2 temas + 3 páginas del sitio`);
  if (problems.length) { console.error(`\n${problems.length} problema(s):`); for (const p of problems) console.error(`✗ ${p}`); process.exitCode = 1; }
  else console.log('✓ sin errores de JavaScript ni desbordes');
} catch (e) { console.error('Error en la auditoría:', e); process.exitCode = 2; }
finally { try { ws?.close(); } catch {} proc.kill(); await sleep(300); try { rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(process.exitCode ?? 0); }
