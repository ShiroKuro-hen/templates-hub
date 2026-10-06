# Templates Hub — plan

## Idea
Sitio web donde cada **plantilla** trae dos cosas listas para copiar con un clic:
1. el **prompt** (para pedirle a una IA que genere eso), y
2. el **código** resultante, en varios lenguajes (los más usados).

Ejemplo: plantilla "Endpoint REST con validación" → prompt + versión en TypeScript, Python, Go, Java, C#, PHP...

## Alcance v1 (lo mínimo que sirve)
- Lista de plantillas con buscador y filtro por categoría y lenguaje.
- Página de plantilla: prompt + pestañas por lenguaje + botón **Copiar** en cada bloque.
- Resaltado de sintaxis, modo claro/oscuro.
- **Sin backend, sin cuentas, sin base de datos.** Todo es contenido estático.

Fuera de v1 (se agrega solo si hace falta): usuarios, favoritos, votos, comentarios, subir plantillas desde la web, ejecutar el código en el navegador.

## Cómo funciona
**Las plantillas son archivos en el repo.** Agregar una plantilla = agregar una carpeta y hacer commit.

```
templates/
  rest-endpoint/
    meta.md          # frontmatter: título, descripción, categoría, tags
    prompt.md        # el prompt, con {{variables}} opcionales
    ts.ts
    py.py
    go.go
    java.java
    cs.cs
    php.php
```

`meta.md` ejemplo:
```yaml
---
title: Endpoint REST con validación
category: backend
tags: [api, rest, validation]
languages: [ts, py, go, java, cs, php]
---
Descripción corta de qué resuelve.
```

El sitio se **genera en el build** leyendo esa carpeta: no hay nada que consultar en tiempo de ejecución, por eso es rápido, barato y fácil de alojar.

## Stack propuesto
| Pieza | Elección | Por qué |
|---|---|---|
| Framework | **Astro** | Genera sitio estático desde archivos; Content Collections valida el frontmatter. |
| Estilos | Tailwind CSS | Rápido de maquetar. |
| Resaltado | Shiki (viene con Astro) | Sin JS extra en el cliente. |
| Búsqueda | **Pagefind** | Búsqueda en cliente sobre el build, sin servidor. |
| Copiar | ~10 líneas de JS (`navigator.clipboard`) | No hace falta librería. |
| Hosting | Cloudflare Pages o GitHub Pages | Gratis, deploy en cada push. |

## Lenguajes iniciales
TypeScript/JavaScript, Python, Java, C#, Go, PHP, Rust, SQL, Bash. (Se empieza con 5–6 y se amplía.)

## Categorías iniciales
Backend/API, Frontend/componentes, Base de datos/SQL, Scripts/automatización, Testing, DevOps (Docker, CI), Algoritmos/utilidades.

## Plan por fases
1. **Base** — `npm create astro`, layout, página de inicio, página de plantilla, Content Collection con esquema.
2. **Contenido semilla** — 8–10 plantillas con 3–4 lenguajes cada una, para probar el diseño de verdad.
3. **UX de copiar** — pestañas por lenguaje, botón Copiar, recordar el lenguaje elegido (localStorage).
4. **Búsqueda y filtros** — Pagefind + filtro por categoría/lenguaje.
5. **Calidad** — script de validación en CI: cada plantilla declara sus lenguajes y existen los archivos; opcional: compilar/lint cada snippet para que el código publicado funcione.
6. **Deploy** — Cloudflare Pages, dominio.
7. **Contribuir** — CONTRIBUTING.md + plantilla de PR para que otros agreguen plantillas.

## Decisiones abiertas (a definir)
- ¿Prompt único para todos los lenguajes o uno por lenguaje? (propuesta: uno solo con `{{lenguaje}}`).
- ¿Contenido abierto a la comunidad (PRs) o curado solo por ti?
- ¿Idioma del sitio: español, inglés o ambos?
- ¿Nombre y dominio definitivos? ("templates-hub" es provisional).
- ¿Se quiere monetizar o es gratis/abierto? Define si hace falta backend más adelante.

## Riesgos
- **Calidad del código**: snippets sin probar pierden confianza → paso 5 (CI).
- **Mantenimiento**: N plantillas × M lenguajes crece rápido → empezar chico y automatizar la validación.
- **Licencia**: definir licencia del contenido (MIT / CC0) desde el inicio.
