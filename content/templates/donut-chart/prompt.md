Crea un gráfico de donut en SVG puro (sin librerías) para mostrar {{datos}}, a partir de un array de objetos { label, value, color }.
Genera los segmentos con JS usando circle + stroke-dasharray (circunferencia = 100 para que los valores sean porcentajes), con un pequeño hueco entre ellos.
En el centro, el total; al pasar el cursor o enfocar una entrada de la leyenda, resalta su segmento y muestra su porcentaje. Leyenda con botones accesibles y animación de entrada que respete prefers-reduced-motion.
