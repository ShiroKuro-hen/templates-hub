Crea un diagrama de arquitectura por capas en SVG para {{producto}}: cliente, edge/CDN, API, servicios y datos, unidas de arriba abajo por flechas con <marker>.
Cada capa es un bloque enfocable (tabindex="0") con su nombre y sus componentes; al pasar el cursor o enfocarla se resaltan sus dependencias (flechas y capas conectadas) y el resto se atenúa.
Incluye una leyenda con el tipo de cada capa (entrada, lógica, persistencia) con colores de tokens, y un <title> y <desc> en el SVG con viewBox que escale al ancho.
Usa role="img" en el SVG, respeta prefers-reduced-motion y mantén el texto dentro de cada bloque.
Estilo sobrio y profesional: tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
