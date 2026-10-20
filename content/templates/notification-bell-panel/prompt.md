Crea un centro de notificaciones para {{producto}}: un botón de campana con contador de avisos sin leer que abre un panel flotante.
El panel tiene las pestañas Todas y Sin leer (navegables con flechas) y lista {{tipos_de_aviso}} con icono, texto, hora relativa y un punto para los no leídos.
Al hacer clic en un aviso se marca como leído; el botón Marcar todas como leídas deja el contador en cero y muestra un estado vacío amable.
Accesibilidad: aria-expanded y aria-controls en la campana, Esc y clic fuera cierran el panel devolviendo el foco, y el contador se anuncia con aria-live polite.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
