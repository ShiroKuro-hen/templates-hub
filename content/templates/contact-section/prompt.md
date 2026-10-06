Crea una sección de contacto para {{empresa}} en dos columnas: a la izquierda título, frase y datos ({{datos_contacto}}) en un <dl>; a la derecha un formulario.
El formulario pide nombre, correo, tema (select) y mensaje (mínimo 20 caracteres). Valida con la API nativa (novalidate + checkValidity) y muestra un error por campo que diga cómo corregirlo, con aria-invalid y aria-describedby.
Al enviar con errores, enfoca el primer campo inválido; si todo está bien, confirma con role="status" ("Mensaje enviado…") y limpia el formulario. Una columna en móvil.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
