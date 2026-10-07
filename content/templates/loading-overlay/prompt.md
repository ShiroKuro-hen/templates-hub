Crea un panel de {{panel}} (por ejemplo, facturación del mes) con un botón "Actualizar datos" que muestre un overlay de carga sobre todo el panel.
Mientras carga: aria-busy="true" en el panel, contenido inerte, botón con aria-disabled, spinner en anillo con degradado de acento y un mensaje en una región role="status".
Al terminar, actualiza los datos y la hora, y anuncia "Datos actualizados." Respeta prefers-reduced-motion. Sin librerías.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
