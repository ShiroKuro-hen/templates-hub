Crea una cuadrícula de estado para los servicios de {{producto}} ({{servicios}}) con un aviso global arriba y una tarjeta por servicio en un grid auto-fit de mínimo 260px.
Cada tarjeta lleva el nombre, una píldora con el estado de hoy (Operativo, Degradado, Con incidencia), 30 barras diarias con title de fecha y estado, y el porcentaje de disponibilidad.
El aviso global usa role="status" y un punto con degradado azul-cian y pulso suave (respeta prefers-reduced-motion); las barras llevan role="img" con un aria-label que cuenta los días por estado.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
