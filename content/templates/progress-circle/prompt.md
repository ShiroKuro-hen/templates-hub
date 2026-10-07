Crea un indicador de progreso circular en SVG para {{metrica}} (por ejemplo, avance de una migración) con el valor en porcentaje en el centro.
Dibuja el anillo con circle y stroke-dasharray (pathLength="100"), anima el relleno al cargar y al cambiar el valor, y colorea en rojo cuando supera {{umbral}}.
Añade role="progressbar" con aria-valuenow, aria-valuemin y aria-valuemax, y un control range para simular el avance. Sin librerías.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
