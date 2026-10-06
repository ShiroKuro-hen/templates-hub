Crea una escena de portada para {{producto}} con cuatro capas SVG (sol, montañas lejanas, medias y cercanas) que se muevan a velocidades distintas al hacer scroll dentro de un recuadro.
Hazlo en CSS puro: registra @property --t (0 a 1), anímala con animation-timeline: scroll(self) y deriva cada translateY de --t y una variable --s por capa. Si el navegador no admite scroll(), un script mínimo asigna --t en el evento scroll.
Añade un botón "Volver al inicio". Con prefers-reduced-motion las capas quedan quietas en su posición base.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
