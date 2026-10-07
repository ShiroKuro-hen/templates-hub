Crea una barra de progreso segmentada para {{proceso}} (por ejemplo, un despliegue) con las etapas {{etapas}}.
Cada etapa es un segmento con su propia barra, etiqueta y estado (completada, en curso con porcentaje, pendiente). Muestra un resumen accesible ("2 de 5 etapas completadas") y un botón para avanzar la etapa en curso.
En móvil, apila los segmentos en una columna. Usa role="progressbar" con aria-valuenow en cada segmento y degradado fino solo en la etapa activa.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
