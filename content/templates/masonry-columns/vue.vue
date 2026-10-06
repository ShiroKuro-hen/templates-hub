<script setup lang="ts">
type Color = 'warn' | 'info' | 'ok' | 'err';
type Idea = { id: number; titulo: string; texto: string; etiqueta: string; color?: Color };

defineProps<{ ideas?: Idea[] }>();

const demo: Idea[] = [
  { id: 1, titulo: 'Lanzamiento', texto: 'Publicar la versión 2.0 el 14 de noviembre.', etiqueta: 'Producto', color: 'warn' },
  { id: 2, titulo: 'Entrevistas', texto: 'Hablar con cinco clientes sobre cómo usan los informes y resumir las respuestas en una página.', etiqueta: 'Investigación' },
  { id: 3, titulo: 'Atajos', texto: 'Añadir atajos de teclado.', etiqueta: 'Mejora', color: 'info' },
  { id: 4, titulo: 'Blog', texto: 'Escribir el artículo sobre la nueva exportación a PDF, con capturas y un ejemplo paso a paso.', etiqueta: 'Contenido', color: 'ok' },
  { id: 5, titulo: 'Precios', texto: 'Revisar el plan Pro.', etiqueta: 'Negocio' },
  { id: 6, titulo: 'Errores', texto: 'Corregir el fallo al subir imágenes de más de 5 MB.', etiqueta: 'Soporte', color: 'err' },
];
</script>

<template>
  <ul class="masonry">
    <li v-for="i in ideas ?? demo" :key="i.id" :class="i.color">
      <h2>{{ i.titulo }}</h2>
      <p>{{ i.texto }}</p>
      <span class="tag">{{ i.etiqueta }}</span>
    </li>
  </ul>
</template>

<style scoped>
.masonry { list-style: none; margin: 0; padding: 0; columns: 2 150px; column-gap: 16px; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.masonry li { break-inside: avoid; margin: 0 0 16px; padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
.masonry h2 { margin: 0 0 4px; font-size: .9375rem; font-weight: 600; }
.masonry p { margin: 0; color: var(--muted); }
.tag { display: inline-block; margin-top: 10px; padding: 2px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: .75rem; font-weight: 600; }
.masonry li.warn .tag { background: var(--warn-soft); color: var(--warn); }
.masonry li.info .tag { background: var(--info-soft); color: var(--info); }
.masonry li.ok .tag { background: var(--ok-soft); color: var(--ok); }
.masonry li.err .tag { background: var(--err-soft); color: var(--err); }
/* Tokens: ver pestaña HTML + CSS */
</style>
