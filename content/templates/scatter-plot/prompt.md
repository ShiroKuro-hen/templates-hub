Crea un gráfico de dispersión en SVG que relacione {{variable_x}} con {{variable_y}}, con los puntos en un array de JavaScript ([nombre, x, y, grupo]).
Dibuja ejes con marcas, líneas guía de 1px, títulos de eje y una línea de tendencia (regresión lineal) con degradado fino. La leyenda filtra por grupo con botones aria-pressed.
Cada punto es un círculo enfocable con aria-label completo; Tab entra al gráfico y las flechas mueven el foco entre puntos (tabindex itinerante). Al pasar el ratón o enfocar, un tooltip muestra nombre, grupo y valores; Escape lo cierra. Redibuja al cambiar el ancho.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
