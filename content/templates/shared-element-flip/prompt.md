Crea una cuadrícula de tarjetas de {{producto}} que se expanden en un panel de detalle con la técnica FLIP en JavaScript puro: se mide el rectángulo de la tarjeta, se invierte con transform y se reproduce con element.animate().
Al abrir, el panel parte de la posición de la tarjeta; se cierra con Esc, con clic fuera o con el botón ×, y devuelve el foco a la tarjeta.
El panel muestra {{detalle}} con título, responsable, estado con etiqueta de texto y barra de avance.
Con prefers-reduced-motion la duración de la animación pasa a cero. Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
