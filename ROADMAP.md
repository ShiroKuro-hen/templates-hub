# Templates Hub — hoja de ruta

Objetivo: **más estilos** y **más personalización**, sin romper lo que ya es la ventaja del proyecto: componentes en HTML/Tailwind/React/Vue, sin dependencias, con prompt para IA.

## Dónde estamos (oct 2026)
- 237 componentes en 26 categorías, 5 formatos de código (HTML+CSS, CSS, Tailwind, React, Vue). Astro 7, GitHub Pages, CI con `validate` + `audit` en Chrome sin cabeza.
- **Un solo estilo** ("Ion") con claro/oscuro. Los tokens (`--bg --surface --text --muted --border --accent --accent-soft --ok --warn --err --info --radius --shadow`) viven **copiados dentro de cada `html.html`**.
- El visor de vista previa ya inyecta código en el iframe (`src/pages/preview/[slug].html.ts`: tema por `postMessage`). Es el gancho para todo lo que sigue.

**Consecuencia clave:** como todo se pinta con las mismas variables CSS, se pueden ofrecer muchos estilos y personalización **sobrescribiendo variables**, sin tocar los 237 componentes.

## Estado
- **Fase 1 — hecha:** 9 estilos, selector en el visor, verificador de contraste (`npm run themes`).
- **Fase 2:** "Copiar código" hornea el estilo elegido en HTML+CSS; degradado `--accent-2` y radios `min(var(--radius),Npx)` en los previews; panel "Personalizar" (acento, radio, sombra, fuente) con enlace compartible. Falta: densidad (ningún componente usa un token de espaciado todavía) y prompt con variables.
- **Tailwind (opción A, hecha):** los 233 `tailwind.html` usan clases semánticas (`bg-surface`, `text-fg`, `border-line`, `text-accent`…) y no llevan `dark:` de color; el CSS de configuración está en `src/lib/tailwind-setup.css` (página `/tailwind/`). `validate` prohíbe volver a las clases de paleta. Excepción: la categoría `paleta-de-color`, donde los colores son el contenido.
- **React y Vue:** no llevan paletas de color: usan nombres de clase propios y el CSS del snippet HTML+CSS, igual que Vue. Los tokens llegan por ese CSS, así que no necesitan conversión.

## Qué hace la competencia (y qué nos sirve)

| Referencia | Modelo | Qué tomar |
|---|---|---|
| [daisyUI](https://daisyui.com/docs/themes/) | 35 temas integrados, `data-theme` en cualquier elemento (anidables), tema = solo variables CSS, **generador de temas** que copia el CSS | El modelo exacto: temas como sets de variables + generador. Es el más parecido a lo que ya tenemos. |
| [shadcn/ui](https://ui.shadcn.com/docs/theming) | Tokens semánticos con par `-foreground`, **un solo `--radius`** que deriva toda la escala, colores base (Neutral, Stone, Zinc, Mauve, Olive, Mist, Taupe), página de "create" para previsualizar y generar un preset | Un `--radius` maestro, pares fondo/texto, presets compartibles. |
| [Radix Themes](https://www.radix-ui.com/themes/docs/theme/overview) | 5 perillas: `accentColor`, `grayColor`, `panelBackground`, `scaling`, `radius` (+ playground) | **Las 5 perillas son el modelo de personalización:** pocas, combinables, con efecto global. |
| Aceternity UI / Magic UI ([comparativa](https://www.pkgpulse.com/guides/aceternity-ui-vs-magic-ui-vs-shadcn-animated-react-2026)) | Copy-paste, efectos visuales: tarjetas 3D, haces de luz, rejillas, gradientes neón, micro-interacciones | Categoría de **efectos para landing** (nuestras "Animaciones" son básicas). Todo es posible solo con CSS. |
| HeroUI ([comparativa](https://designrevision.com/compare/heroui-vs-shadcn.md)) | Dependencia instalada, look propio listo | Ejemplo de lo que **no** hacer: encierra al usuario en un paquete. Nuestro copy-paste es mejor. |
| Flowbite, Preline, HyperUI, Tailwind Plus ([datos de daisyUI](https://daisyui.com/alternative/tailwindplus/)) | Catálogos grandes con muchas variantes por componente; Tailwind Plus además vende plantillas de sitio completas | **Variantes por componente** (3–4 por tipo) y **kits de sitio completo** (SaaS, blog, admin). |
| Design tokens W3C/DTCG + Style Dictionary ([ref.](https://docs.tokens.studio/manage-settings/token-format)) | Tokens en JSON `$value/$type`, capas global → semántica → componente, exporta a CSS/Tailwind/etc. | Fuente única de temas en JSON y exportar a CSS, Tailwind v4 (`@theme`) y JSON. |

> Los conteos de temas/componentes de otras librerías salen de las páginas comparativas de daisyUI (parte interesada) — úsalos como orden de magnitud, no como cifras exactas. Aceternity, Magic UI, Park UI y tweakcn: no pude verificar sus datos específicos en esta pasada; revisar sus sitios antes de copiar ideas concretas.

## Fases

### Fase 1 — Selector de estilos (el mayor salto por el menor esfuerzo)
Tokens de tema como datos y un selector en el visor.
- `src/lib/themes.ts` (o JSON): cada tema = `{ id, label, light:{…}, dark:{…} }` con las mismas variables de hoy.
- El visor inyecta un `<style id="theme">` en el iframe (mismo mecanismo que `THEME`) y lo cambia por `postMessage`. **Cero cambios en los 237 componentes.**
- Selector de estilo en la barra del lienzo y persistencia en `localStorage` (el estilo elegido se mantiene al navegar).
- Lanzar con **8–10 estilos** distintos entre sí, no 30 parecidos:
  Ion (actual) · Minimal mono · Soft/Pastel · Brutalista (bordes gruesos, sombra dura) · Glass · Terminal/retro · Editorial (serif) · Alto contraste (accesible) · Corporativo · Neón oscuro.
- Cada estilo cambia más que el color: `--radius`, `--shadow`, grosor de borde, familia tipográfica (`--font`), densidad.
- **Criterio de hecho:** `npm run audit` pasa en todos los temas × claro/oscuro; contraste AA verificado por script.

### Fase 2 — Personalizador (las perillas)
Inspirado en Radix/shadcn: pocas perillas, efecto global.
- **Color de acento** (selector + escalas generadas con `color-mix()`/`oklch`, sin librería), **radio** (0 / 4 / 8 / 16 / pill), **densidad** (compacta/normal/cómoda → `--space`), **fuente** (3–4 pilas ya instaladas/sistema), **sombra** (ninguna/suave/dura).
- Panel lateral "Personalizar" con vista previa en vivo en todos los componentes (la misma inyección de la Fase 1).
- **Copiar con mi tema:** el botón de copiar reemplaza el bloque `:root{…}` por el del estilo elegido. Funciona en HTML+CSS y en el CSS de configuración de Tailwind (React y Vue no traen bloque `:root`). Aquí está la diferencia real frente a un catálogo estático.
- Compartir configuración por URL (`?t=brutal&a=%23ff5a36&r=12`), sin backend.
- Prompt de IA con las variables ya rellenas (`{{estilo}}`, `{{acento}}`, `{{radio}}`).

### Fase 3 — Exportar el sistema
- Página **"Mi tema"**: descarga `theme.css`, bloque `@theme` de Tailwind v4, `tokens.json` (DTCG) y un `prompt` que describe el sistema a una IA.
- Una página de "kit" por estilo: botones + formularios + tarjetas + tabla + alertas en un solo vistazo (como el playground de Radix).
- Opcional: generar los tokens desde un único JSON con Style Dictionary para no mantener el CSS a mano. **Solo si** los temas pasan de ~15; antes es sobreingeniería.

### Fase 4 — Más contenido y más variantes
- **Variantes por componente** (3–4 por tipo, estilo Flowbite/Tailwind Plus): botones, tarjetas, navbar, hero, precios, footers. Es lo que más piden los catálogos.
- **Nueva categoría "Efectos"** (inspirada en Aceternity/Magic UI), todo CSS: borde con gradiente animado, spotlight al pasar el cursor, rejilla/ruido de fondo, tarjeta inclinada 3D, marquee, texto con brillo, haz de luz.
- **Kits de sitio completo:** landing SaaS, portafolio, blog, admin, e-commerce — cada uno con su estilo y copiable en bloque.
- Huecos de categoría a considerar: calendario/fecha, kanban, árbol de archivos, comando/menú contextual, upload de archivos avanzado, tablas con celdas editables, emails HTML.
- Mantener el estándar actual: 6 archivos por componente, sin recursos externos, claro y oscuro, a11y básica.

### Fase 5 — Calidad y producto (en paralelo)
- **Accesibilidad automática en CI:** añadir axe-core al `audit` (hoy revisa JS, recursos, tema y desbordes; no contraste ni ARIA).
- **Búsqueda:** el plan original pedía Pagefind; hoy hay paleta de comandos. Cubre el catálogo actual; Pagefind solo si se busca dentro del código y los prompts.
- **Descarga/CLI:** `npx templates-hub add button` (modelo shadcn registry: un JSON por componente). Solo si hay demanda real; hoy copiar y pegar basta.
- **Contribuciones:** `CONTRIBUTING.md` + plantilla de PR + `npm run new <slug>` que genere los 6 archivos (hoy se hace a mano).
- **Idioma:** sitio y prompts en español; decidir si se agrega inglés (más alcance, mantenimiento ×2).
- Licencia del contenido (MIT/CC0) explícita en el repo — sigue como decisión abierta del plan original.

## Orden recomendado
1. Fase 1 (selector de estilos) — visible de inmediato, bajo riesgo, desbloquea todo lo demás.
2. Fase 2 (perillas + copiar con mi tema) — es el diferenciador.
3. Fase 4 en paralelo, un lote por semana (variantes + "Efectos").
4. Fase 3 y 5 cuando haya estilos suficientes / tráfico.

## Riesgos
- **Componentes con colores fijos:** si alguno no usa las variables, el estilo no le aplica. Mitigación: `validate.mjs` ya revisa tokens; agregar regla "sin colores literales fuera del bloque `:root`".
- **Explosión de combinaciones** (estilos × acento × radio × densidad): el `audit` debe correr sobre una muestra (cada estilo × 2 temas), no sobre el producto cartesiano.
- **Tailwind no se renderiza en el sitio** (la vista previa es el `html.html`): su fidelidad visual no la vigila el `audit`. La migración se verificó fuera del repo, compilando Tailwind v4 y comparando capturas antes/después (237 componentes × claro/oscuro, 0,69 % de diferencia media). Si el snippet Tailwind se edita a mano, hay que repetir esa comprobación.
- **Estilos que rompen layouts** (fuentes más anchas, radios extremos): probar a 360 px, como ya hace el audit.
