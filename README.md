# Templates Hub

Biblioteca de componentes de interfaz: cada uno con **vista previa en vivo**, **código** (HTML + CSS, Tailwind, React, Vue) y el **prompt** para pedirlo a una IA. Sitio estático (Astro) → GitHub Pages, gratis.

```
npm install
npm run dev      # http://localhost:4321
npm run build
```

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

Los estilos usan los tokens "Ion" (`--bg`, `--surface`, `--accent`…) con `:root[data-theme=dark]`; el sitio inyecta el tema en la vista previa, no hay que escribir ese script. Categorías, grupos y lenguajes se declaran en `src/lib/data.ts`. Una carpeta sin `meta.json` válido se ignora.

## Publicar (gratis)
1. Repo **público** en GitHub (Pages gratis requiere repo público).
2. Settings → Pages → Source: **GitHub Actions**.
3. `git push` a `main`: `.github/workflows/deploy.yml` construye y publica en `https://<usuario>.github.io/<repo>/`.
