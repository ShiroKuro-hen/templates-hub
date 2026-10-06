Crea una lista de {{contenido}} (por ejemplo, novedades de producto) cuyos elementos aparezcan al entrar en el área visible del panel con scroll.
Usa IntersectionObserver con threshold 0.25: cada elemento pasa de opacidad 0 y 14px de desplazamiento a su posición, con un retraso escalonado de 90ms entre los de una misma tanda.
Añade un botón "Repetir" que vuelva al inicio y reinicie el efecto. Con prefers-reduced-motion todo se muestra de inmediato y el botón se oculta.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
