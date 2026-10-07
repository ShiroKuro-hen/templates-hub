Crea una lista de {{elementos}} (por ejemplo, servicios) con un punto de estado de 8px junto a cada nombre: operativo, degradado, incidente, mantenimiento y pausado. Los tres primeros pulsan (el incidente más rápido); los demás son estáticos.
Añade una leyenda con botones (aria-pressed) que muestra cuántos hay en cada estado y filtra la lista; un segundo clic quita el filtro, y un mensaje role="status" anuncia el resultado.
El estado nunca se comunica solo con color: cada punto lleva su nombre en texto. Con prefers-reduced-motion los puntos no pulsan.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
