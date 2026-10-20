Crea un conjunto de pestañas para {{producto}} con role="tablist", role="tab" y role="tabpanel" para cambiar entre secciones.
El nuevo panel entra deslizándose desde el lado que indica la pestaña (izquierda o derecha según su posición) mientras el anterior se desvanece; usa document.startViewTransition y, si no existe, Web Animations API.
Las flechas izquierda y derecha, Inicio y Fin mueven el foco y activan la pestaña; aria-selected marca la activa y tabindex sigue el foco.
Con prefers-reduced-motion el cambio es instantáneo.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
