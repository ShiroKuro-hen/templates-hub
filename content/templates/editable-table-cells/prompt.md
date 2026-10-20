Crea una cuadrícula editable tipo hoja de cálculo para {{producto}} con filas de {{entidad}} y columnas nombre, correo, cantidad, estado y fecha.
Las celdas se mueven con flechas (con roving tabindex) y se editan con Enter, F2 o doble clic; Esc cancela y Enter o Tab guardan.
Cada columna valida su dato: el correo debe tener formato válido y la cantidad ser un número igual o mayor que 0; el error aparece bajo la celda con aria-invalid.
Las celdas cambiadas se resaltan, un contador indica «N cambios» con los botones Deshacer último y Descartar todo, y un aviso aria-live anuncia cada guardado o error.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
