Crea un gráfico de líneas en SVG hecho a mano (sin librerías) para {{serie_de_datos}}, con los datos en un array [{ x, y }] y el SVG generado con JS.
Incluye ejes con líneas guía finas (var(--border), texto var(--muted)), línea de 2.5px en var(--accent), área tenue bajo la curva y un punto por dato.
Al pasar el cursor (o enfocar un punto con Tab) muestra un tooltip con el valor, una guía vertical y el punto resaltado. El SVG es responsivo con viewBox y la línea se dibuja con una animación que respete prefers-reduced-motion.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
