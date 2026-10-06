Crea una lista de sesiones activas para {{producto}}: una fila por dispositivo con icono SVG, nombre, navegador y sistema, ubicación y última actividad ({{dispositivos}}).
La sesión actual lleva la insignia "Este dispositivo" y un punto con degradado cian-azul; no se puede cerrar. Las demás tienen "Cerrar sesión", y arriba hay "Cerrar las demás sesiones" que pide confirmación con un <dialog> nativo.
Al cerrar, anuncia el resultado en una región aria-live, mueve el foco al título, actualiza el contador y muestra un estado vacío que explique qué pasó.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
