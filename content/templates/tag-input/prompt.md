Crea un campo de etiquetas para {{contexto}} que convierta el texto en etiquetas al pulsar Enter o escribir una coma (también al pegar "a, b, c").
Sugiere {{sugerencias}} con un <datalist> nativo, normaliza a minúsculas, evita duplicados con un mensaje que explique qué hacer y quita la última con Retroceso si el campo está vacío.
Cada etiqueta es un elemento de lista con botón "Quitar X" accesible; anuncia altas y bajas con role="status" y crea los nodos con textContent (nunca innerHTML).
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
