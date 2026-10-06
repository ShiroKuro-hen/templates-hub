Crea un selector de tema para {{aplicacion}} con tres opciones: Claro, Oscuro y Sistema, cada una con icono SVG y texto.
Usa un fieldset con legend y radios nativos (flechas para moverse, foco visible en la opción) y un indicador que se desliza bajo la opción activa.
Al cambiar, aplica data-theme en <html>; en Sistema, sigue prefers-color-scheme y reacciona si cambia. Anuncia el cambio con role="status" y guarda la elección en {{almacenamiento}} si se necesita.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
