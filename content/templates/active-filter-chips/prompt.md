Crea una barra de filtros activos para una lista de {{entidad}} (por ejemplo, tickets de soporte) con los filtros {{filtros}}.
Cada filtro aplicado es un chip con botón de quitar (aria-label "Quitar filtro Estado: Abierto"); añade un <select> "Añadir filtro" con optgroups y un botón "Limpiar todo" que solo aparece si hay chips.
Filtra la lista en vivo, anuncia el total con aria-live, devuelve el foco al chip vecino al quitar uno y muestra un estado vacío que dice cómo salir.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
