Crea una pila de cuatro fotos de {{contenido}} para {{producto}} que se abra en abanico al pasar el cursor, al enfocarla o al tocarla.
La pila es un grupo con foco: Enter o Espacio abren y cierran el abanico, y las flechas cambian la foto de arriba; un botón "Barajar" hace lo mismo con el ratón.
Con prefers-reduced-motion no hay rotación ni transiciones, y el nombre de la foto superior se anuncia con aria-live.
Cada imagen lleva alt, width, height, loading="lazy" y aspect-ratio con object-fit para cambiarla sin deformarla.
Estilo: tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
