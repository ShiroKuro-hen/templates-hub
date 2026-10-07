Crea campos de formulario para {{formulario}} donde cada <label> lleva al lado un botón de ayuda "?" de 20px (aria-label descriptivo, aria-expanded, aria-controls) que muestra un texto de ayuda breve.
La ayuda se abre al pasar el cursor, se fija con clic, se cierra con Esc (devolviendo el foco al botón) o al hacer clic fuera, y solo hay una abierta a la vez. El input referencia la ayuda con aria-describedby, aunque esté cerrada.
Redacta ayudas de una o dos frases que expliquen qué pasa y qué hacer, por ejemplo para {{campo_con_ayuda}}. Sin librerías.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
