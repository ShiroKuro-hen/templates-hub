Crea una lista de prioridades para {{producto}} con cinco filas, cada una con botones Subir y Bajar que reordenan sin arrastrar y soltar.
Alt + flecha arriba o abajo sobre una fila la mueve igual, y el reordenamiento usa FLIP: mide las posiciones, invierte con transform y reproduce con element.animate().
El botón Ordenar A–Z alterna entre el orden alfabético y el de prioridad con aria-pressed; un aviso con aria-live="polite" anuncia la nueva posición y el foco se queda en el botón de la fila movida.
Con prefers-reduced-motion la duración de la animación pasa a cero. Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
