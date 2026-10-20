// Descarga las fotos de stock de public/stock desde Lorem Picsum (fotos de Unsplash, licencia Unsplash) y escribe CREDITS.md.
// Uso: node scripts/fetch-stock.mjs   (solo hace falta para regenerar; las imágenes ya están en el repo)
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'stock');
mkdirSync(out, { recursive: true });

// [nombre, id de Picsum, ancho, alto]
const PHOTOS = [
  ['costa-azul', 10], ['valle-bruma', 11], ['sendero-verde', 17], ['canon-verde', 28], ['montana-nieve', 29],
  ['isla-blanca', 49], ['cima-nubes', 54], ['atardecer-colinas', 62], ['embarcadero', 77],
  ['puente-noche', 43], ['calle-ciudad', 57], ['puente-crepusculo', 84], ['puerta-antigua', 78],
  ['escritorio-teclado', 1], ['escritorio-cafe', 2], ['escritorio-diseno', 20], ['objetos-planos', 36],
  ['escritorio-laptop', 48], ['escritorio-cenital', 60], ['escritorio-notas', 180], ['escritorio-madera', 201],
  ['taza-vintage', 30], ['libro-abierto', 24], ['tocadiscos', 39], ['cafeteria-mesa', 42], ['cafe-rojo', 63],
  ['uvas', 75], ['bicicleta-granero', 76], ['tetera-flores', 225], ['cactus', 248], ['camara-vintage', 250],
  ['ingredientes', 292], ['miel', 312], ['luces-bokeh', 56],
  ['atardecer-vertical', 62, 480, 640], ['atardecer-panoramica', 62, 1200, 500],
];

const list = (await (await fetch('https://picsum.photos/v2/list?limit=100&page=1')).json())
  .concat(await (await fetch('https://picsum.photos/v2/list?limit=100&page=2')).json())
  .concat(await (await fetch('https://picsum.photos/v2/list?limit=100&page=3')).json());
const meta = new Map(list.map((p) => [String(p.id), p]));

const credits = [];
for (const [name, id, width = 800, height = 533] of PHOTOS) {
  const res = await fetch(`https://picsum.photos/id/${id}/${width}/${height}.webp`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  writeFileSync(join(out, `${name}.webp`), Buffer.from(await res.arrayBuffer()));
  const p = meta.get(String(id));
  credits.push(`- \`${name}.webp\` — ${p?.author ?? 'desconocido'} (Unsplash) · ${p?.url ?? ''}`);
}
writeFileSync(join(out, 'CREDITS.md'), `# Créditos de las fotos de stock\n\nFotos de [Unsplash](https://unsplash.com) servidas por [Lorem Picsum](https://picsum.photos), bajo la [licencia de Unsplash](https://unsplash.com/license) (uso libre, sin atribución obligatoria).\n\n${credits.join('\n')}\n`);
console.log(`${PHOTOS.length} fotos en ${out}`);
