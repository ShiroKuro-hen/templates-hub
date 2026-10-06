Crea un botón primario "{{accion}}" (por ejemplo, Guardar cambios) con onda que nace en el punto de la pulsación (centrada si se activa con teclado) y tres estados: reposo, guardando con spinner y guardado con check que se dibuja.
Usa data-state para los estados, la Web Animations API para la onda y stroke-dashoffset para el check; tras 1,8s vuelve al reposo. Anuncia el resultado con un role="status" y marca aria-busy mientras carga.
Con prefers-reduced-motion no hay onda, spinner giratorio ni dibujo del check: el check aparece completo.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
