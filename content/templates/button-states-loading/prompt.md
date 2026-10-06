Crea un botón "{{accion}}" con todos sus estados: normal, hover, active, foco, deshabilitado y cargando.
En cargando muestra un spinner CSS y el texto "Guardando…", usa aria-busy y aria-disabled para no perder el foco.
Al hacer clic simula una petición de 2 segundos y vuelve al estado normal. Anuncia el resultado con role="status".
Estilo de bordes gruesos y sombra dura; respeta prefers-reduced-motion. Sin librerías.
