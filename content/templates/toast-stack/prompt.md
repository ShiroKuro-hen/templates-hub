Crea un sistema de toasts apilables para {{aplicación}} con JavaScript vanilla.
Cuatro tipos (éxito, error, info, aviso) con barra lateral de color; los de error usan role="alert" y el resto role="status" dentro de una región aria-live.
Se auto-cierran a los 5 s, se pausan con el cursor encima, tienen botón de cerrar y máximo 4 apilados.
Estilo de bordes gruesos y sombra dura; respeta prefers-reduced-motion. Sin librerías.
