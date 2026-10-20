Crea una cuadrícula de {{numero_tarjetas}} tarjetas de {{contenido}} para {{producto}}, cada una con portada 16:9, categoría, título, extracto y autor con sus iniciales.
Los botones de filtro por categoría (y "Todas") usan aria-pressed para indicar cuál está activo y ocultan las tarjetas que no coinciden.
Al pasar el cursor, la tarjeta se eleva y la imagen se acerca suavemente con overflow oculto; sin movimiento si el usuario lo desactiva con prefers-reduced-motion.
Las imágenes llevan alt, width, height, loading="lazy" y aspect-ratio con object-fit para cambiarlas sin deformarlas.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
