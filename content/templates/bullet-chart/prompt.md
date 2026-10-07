Crea un panel de gráficos de bala (bullet chart) en SVG para medir {{indicadores}} frente a su objetivo, con los datos en un array de JavaScript.
Cada fila muestra el nombre, el valor actual, el objetivo y una insignia de estado (superado, cerca, por debajo). La barra lleva tres rangos de fondo (bajo, medio, alto), una barra delgada para el valor y una marca vertical para el objetivo; usa unidades en % para que el SVG escale sin distorsión.
Añade una leyenda, un interruptor nativo "Mostrar rangos" y role="img" con aria-label que describa valor, objetivo y estado. Degradado fino solo en las barras que alcanzan su objetivo.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
