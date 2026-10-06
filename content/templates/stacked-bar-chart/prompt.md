Crea un gráfico de barras apiladas en SVG hecho a mano (sin librerías) para {{datos}}, con una barra por periodo y un segmento por {{series}}.
Los datos viven en un array; calcula la escala redondeando el máximo, dibuja líneas guía discontinuas, el total encima de cada barra y la etiqueta debajo. Usa x y width en % para que se adapte al ancho.
Cada segmento es enfocable (tabindex, aria-label) y muestra un tooltip al pasar el cursor o enfocarlo; Esc lo oculta. Leyenda con muestras de color de los tokens.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
