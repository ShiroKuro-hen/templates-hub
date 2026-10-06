Crea un ranking de barras horizontales en SVG hecho a mano (sin librerías) para {{metrica}}, a partir de un array { label, value } que se ordena de mayor a menor.
Cada fila muestra la posición y la etiqueta a la izquierda, el valor formateado con Intl.NumberFormat a la derecha y debajo una pista suave con la barra proporcional al máximo (width en %).
La primera barra usa el degradado de acento y las demás el azul de --accent. Añade role="img" y un aria-label que lea el ranking completo de {{periodo}}.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
