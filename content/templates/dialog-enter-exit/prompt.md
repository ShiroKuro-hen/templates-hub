Crea un diálogo modal para invitar personas a {{producto}} con el elemento nativo dialog y showModal(), que entra y sale con transición usando @starting-style y transition-behavior: allow-discrete para display y overlay, y un fondo que se desvanece.
Esc y el clic fuera lo cierran, y el foco vuelve al botón que lo abrió; si el navegador no soporta estas transiciones, el diálogo aparece y desaparece sin animación sin romperse.
Incluye un campo de correo con required y los botones Cancelar (value="cancel") y Enviar invitación, que anuncia el resultado con role="status".
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
