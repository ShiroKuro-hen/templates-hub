Crea una navegación de {{vistas}} (por ejemplo, Resumen, Proyectos y Ajustes) donde el contenido cambie con un deslizamiento suave según la dirección (avanzar o retroceder).
Usa document.startViewTransition con view-transition-name en el contenedor y keyframes que lean una variable --d (1 o -1). Si el navegador no la admite, anima la entrada con la Web Animations API. Mantén aria-current en la pestaña activa y aria-live en el contenido.
Con prefers-reduced-motion el cambio es instantáneo y se desactivan los pseudo-elementos ::view-transition.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
