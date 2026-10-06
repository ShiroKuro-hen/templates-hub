# Templates Hub

Plantillas de UI con **prompt + código** listos para copiar. Sitio estático (Astro) → GitHub Pages.

```
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Agregar una plantilla
Crea `content/templates/<slug>/` con:
- `meta.json` — `title`, `category`, `description`, `tags`
- `prompt.md`
- un archivo por lenguaje: `html.html`, `css.css`, `tailwind.html`, `react.tsx`, `vue.vue`

`html.html` (documento completo) se usa como vista previa. Categorías y lenguajes se declaran en `src/lib/data.ts`.

## Publicar (gratis)
1. Repo **público** en GitHub (Pages gratis requiere repo público).
2. Settings → Pages → Source: **GitHub Actions**.
3. `git push` a `main`: el workflow `.github/workflows/deploy.yml` construye y publica en `https://<usuario>.github.io/<repo>/`.
