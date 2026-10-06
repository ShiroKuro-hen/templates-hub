Crea una imagen con carga progresiva (blur-up) para {{descripcion_imagen}}. Sin imágenes externas: dibuja una versión de baja resolución y otra detallada como SVG.
Muestra primero el placeholder con filter: blur() y, al terminar la carga simulada con JS, desenfoca y revela la versión nítida con una transición corta.
Incluye un <progress> nativo con degradado, aria-busy en la figura, un estado con role="status" ("Cargando imagen" / "Imagen cargada") y el botón "Volver a cargar", deshabilitado mientras carga. Respeta prefers-reduced-motion. Sin librerías.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
