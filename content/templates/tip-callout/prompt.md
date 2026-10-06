Crea tres consejos contextuales para {{producto}} de tipo información, consejo y atención, cada uno con icono SVG, título, texto breve y un enlace de acción opcional.
Cada tipo usa su par de tokens (--info, --ok, --warn con su versión suave) y tiene un botón para descartarlo con aria-label que nombre el consejo; al descartar, el foco pasa al siguiente.
Cuando se descarten todos, muestra un mensaje con el botón "Restaurar consejos". Usa role="note" y no dependas solo del color: el icono y el título distinguen el tipo.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
