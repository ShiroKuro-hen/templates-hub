Crea una galería de miniaturas para {{producto}}: cada miniatura es una ilustración SVG en data URI con su título.
Al elegir una miniatura, la tarjeta se transforma en la vista de detalle con document.startViewTransition y view-transition-name; sin esa API, el cambio es un fundido CSS.
El botón "Volver a la galería" y la tecla Esc cierran el detalle y devuelven el foco a la miniatura elegida; al abrir, el foco pasa al título.
Usa botones con nombre accesible, foco visible y prefers-reduced-motion para cambiar al instante.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
