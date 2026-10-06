<script setup lang="ts">
type Color = 'y' | 'b' | 'g' | 'o';
type Idea = { id: number; titulo: string; texto: string; etiqueta: string; color?: Color };

defineProps<{ ideas?: Idea[] }>();

const demo: Idea[] = [
  { id: 1, titulo: 'Lanzamiento', texto: 'Publicar la versión 2.0 el 14 de noviembre.', etiqueta: 'Producto', color: 'y' },
  { id: 2, titulo: 'Entrevistas', texto: 'Hablar con cinco clientes sobre cómo usan los informes y resumir las respuestas en una página.', etiqueta: 'Investigación' },
  { id: 3, titulo: 'Atajos', texto: 'Añadir atajos de teclado.', etiqueta: 'Mejora', color: 'b' },
  { id: 4, titulo: 'Blog', texto: 'Escribir el artículo sobre la nueva exportación a PDF, con capturas y un ejemplo paso a paso.', etiqueta: 'Contenido', color: 'g' },
  { id: 5, titulo: 'Precios', texto: 'Revisar el plan Pro.', etiqueta: 'Negocio' },
  { id: 6, titulo: 'Errores', texto: 'Corregir el fallo al subir imágenes de más de 5 MB.', etiqueta: 'Soporte', color: 'o' },
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
.masonry { list-style: none; margin: 0; padding: 0 4px 0 0; columns: 2 150px; column-gap: 16px; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.masonry li { break-inside: avoid; margin: 0 0 16px; padding: 12px 14px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
.masonry h2 { margin: 0 0 4px; font-size: .95rem; letter-spacing: -.02em; }
.masonry p { margin: 0; }
.tag { display: block; margin-top: 8px; color: #4d453c; font: 600 .72rem ui-monospace, monospace; }
.masonry li.y { background: #ffd84d; } .masonry li.b { background: #cfd8ff; }
.masonry li.g { background: #c9efd8; } .masonry li.o { background: #ffc4b5; }
</style>
