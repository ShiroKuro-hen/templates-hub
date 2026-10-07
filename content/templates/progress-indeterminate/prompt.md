Crea un panel de procesos con tres barras de progreso para {{proceso}} (por ejemplo, sincronizar contactos): una indeterminada, una determinada con porcentaje y una con error.
Usa role="progressbar" con aria-valuenow solo en la determinada, un mensaje de estado con aria-live y un botón para reiniciar la simulación.
La barra en curso usa el degradado de acento; completado usa var(--ok) y error usa var(--err) con un texto que explique cómo resolverlo. Respeta prefers-reduced-motion.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
