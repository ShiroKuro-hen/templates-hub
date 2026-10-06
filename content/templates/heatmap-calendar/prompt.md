Crea un calendario de actividad estilo "contribuciones" de GitHub para {{actividad}}: 12 semanas, 7 filas (lunes a domingo) y datos de ejemplo en un array [{ date, count }].
Genera las celdas con JS en una cuadrícula CSS (grid-auto-flow: column), con 5 niveles de una escala secuencial de un solo tono (mezclas de var(--accent) con var(--surface)), etiquetas de mes arriba y de día a la izquierda, y leyenda "Menos / Más".
Al pasar el cursor o enfocar una celda muestra un tooltip con el recuento y la fecha; navegación con flechas del teclado y aria-label en cada celda. Sin librerías.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
