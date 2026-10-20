Crea una galería de tres fotos de {{contenido}} para {{producto}}, cada una con un interruptor "Original / Duotono" que alterna entre la foto a color y su versión en duotono.
El duotono se obtiene con escala de grises y dos capas con mix-blend-mode que usan el acento y el fondo del tema; un control de rango "Intensidad" ajusta la fuerza del efecto desde la escala de grises hasta el duotono completo.
Los botones usan aria-pressed para indicar el modo activo y son operables con teclado, con foco visible.
Cada imagen lleva alt, width, height, loading="lazy" y aspect-ratio con object-fit para cambiarla sin deformarla.
Estilo: tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
