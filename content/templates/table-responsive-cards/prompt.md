Crea una tabla de {{entidad}} (por ejemplo, facturas) con cinco columnas que en pantallas de menos de 640px se convierta en una lista de tarjetas, solo con CSS.
En móvil oculta la cabecera de forma accesible y muestra cada celda con su etiqueta usando data-label y td::before; la primera celda (th scope="row") es el título de la tarjeta. Mantén la semántica con role="table", rowgroup, row, columnheader, rowheader y cell.
Incluye badges de estado con punto de color, importes alineados a la derecha con cifras tabulares y una línea fina de degradado cian a azul en el borde superior del contenedor.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
