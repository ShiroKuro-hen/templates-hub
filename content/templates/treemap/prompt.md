Crea un mapa de árbol (treemap) en SVG para mostrar la proporción de {{elementos}} dentro de {{total}}, con los datos en un array de JavaScript ([nombre, valor, categoría]).
Calcula el diseño con una partición binaria recursiva que corte por el lado más largo, dibuja cada bloque como un <svg> anidado con relleno suave por categoría, franja de color superior y etiquetas que solo aparecen si caben. Añade una leyenda de categorías.
Cada bloque es enfocable (role="button", aria-pressed); al hacer clic, Enter o Espacio se muestra un panel de detalle con valor, porcentaje y una barra con degradado fino. Redibuja al cambiar el ancho.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
