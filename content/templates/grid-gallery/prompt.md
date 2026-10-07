Crea una galería de {{elementos}} con CSS Grid, sin imágenes externas (usa degradados y formas CSS como miniaturas).
Ofrece dos modos con un grupo de radios nativos: "Filas" (grid-auto-rows de altura fija, repeat(auto-fill, minmax(150px, 1fr)) y algunos destacados que ocupan dos columnas con grid-auto-flow: dense) y proporciones fijas 1:1, 4:3 y 16:9 con aspect-ratio. Cambia de modo solo con CSS (:has) y muestra el código activo en una línea.
Cada tarjeta lleva miniatura, título truncado con ellipsis y categoría; la primera lleva una etiqueta "Destacado" con degradado fino. Los destacados vuelven a una columna en pantallas estrechas.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
