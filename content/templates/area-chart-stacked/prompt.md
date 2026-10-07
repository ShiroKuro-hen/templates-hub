Crea un gráfico de áreas apiladas en SVG que muestre {{series}} a lo largo de {{periodo}}, con los datos en un array de JavaScript.
Incluye ejes con líneas guía de 1px, leyenda con botones aria-pressed para activar o apagar series (el eje se reescala), y un tooltip con el valor de cada serie y el total del mes.
El SVG es enfocable: las flechas izquierda y derecha mueven la guía vertical, Inicio y Fin saltan a los extremos y Escape la oculta; también funciona con el ratón. Anuncia el mes activo en una región aria-live. Colores de serie con var(--accent), var(--info) y var(--ok); la guía lleva un degradado fino.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
