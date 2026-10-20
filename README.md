# Templates Hub

Biblioteca de componentes de interfaz: cada uno con **vista previa en vivo**, **código** (HTML + CSS, Tailwind, React, Vue) y el **prompt** para pedirlo a una IA. Sitio estático (Astro) → GitHub Pages, gratis.

```
npm install
npm run dev      # http://localhost:4321
npm run build
```

[![CI y GitHub Pages](https://github.com/ShiroKuro-hen/templates-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/ShiroKuro-hen/templates-hub/actions/workflows/deploy.yml)

## Calidad (CI)
Cada push a `main` y cada PR ejecuta, antes de publicar:
1. `npm run validate` — cada plantilla tiene sus 6 archivos, `meta.json` válido, categoría existente, tokens de tema oscuro, sin recursos externos ni estilo antiguo, sintaxis correcta de los `<script>`, del `react.tsx` y del `<script setup>` de Vue, y un `tailwind.html` sin colores de la paleta de Tailwind (solo clases semánticas) ni `classList` con cadenas vacías.
2. `npm run build` — el sitio compila.
3. `npm run audit` — abre las vistas previas en un Chrome sin cabeza (tema claro y oscuro, 360 px) y falla ante errores de JavaScript, recursos que no cargan, tema sin aplicar o desbordes graves. Local: `npm run build && npm run preview` y, en otra terminal, `npm run audit -- http://localhost:4321/`.

Solo si todo pasa y el evento es un push a `main`, se publica en GitHub Pages.

### Verificar el Tailwind contra el HTML (local)
La vista previa es el `html.html`; el `tailwind.html` no se renderiza en el sitio, así que se comprueba aparte:

```
npm run verify:tailwind -- slug1,slug2 --probe --out capturas   # o "all" para los 277
```
Compila Tailwind v4 desde el repo, dibuja cada fragmento junto a su `html.html` en claro y oscuro, y falla si difiere más de un 5 %, si desborda a 360 px o (con `--probe`) si lanza un error al pulsar sus controles. Con `--out` guarda las capturas para revisarlas a ojo. No va en el CI porque tarda unos minutos con todo el catálogo; ejecútalo para los componentes que cambies.

## Cómo funciona
- Sidebar con todo el catálogo agrupado (Fundamentos, Componentes, Feedback, Navegación, Datos, Layout y páginas).
- Paleta de comandos: `Ctrl/⌘ K` o `/` (busca componentes, categorías y acciones).
- Tema claro/oscuro: cambia el sitio y también la vista previa de cada componente.
- Vista previa en lienzo con ancho móvil/tablet/completo y marco redimensionable.

## Agregar un componente
Crea `content/templates/<slug>/` con:
- `meta.json` — `title`, `category`, `description`, `tags`
- `prompt.md` — usa `{{variables}}`
- `html.html` (documento completo: es la vista previa), `tailwind.html`, `react.tsx`, `vue.vue`, y `css.css` si aplica

Los estilos usan los tokens "Ion" (`--bg`, `--surface`, `--accent`, `--radius`…) con `:root[data-theme=dark]`; el sitio inyecta el tema en la vista previa, no hay que escribir ese script. Así el selector de estilos y el panel «Personalizar» cambian todos los componentes: usa `var(--token)` (degradado de marca: `var(--accent-2,#22d3ee)` → `var(--accent,#2f5bff)`; radios pequeños: `min(var(--radius),6px)`), nunca colores fijos.

Convenciones del `tailwind.html`: es un fragmento con **solo el contenido** (el `body{padding:20px}` del HTML es relleno de la demo, no lo dupliques con un `p-5` raíz), con clases semánticas (`bg-surface`, `text-fg`, `border-line`, `text-accent`…; la configuración está en `/tailwind/`) y sin `dark:` de color. Categorías, grupos y lenguajes se declaran en `src/lib/data.ts`. Una carpeta sin `meta.json` válido se ignora.

## Publicar (gratis)
1. Repo **público** en GitHub (Pages gratis requiere repo público).
2. Settings → Pages → Source: **GitHub Actions**.
3. `git push` a `main`: `.github/workflows/deploy.yml` construye y publica en `https://<usuario>.github.io/<repo>/`.
