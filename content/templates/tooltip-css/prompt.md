Crea tooltips solo con CSS (sin JavaScript) para los botones de {{barra de acciones}}.
Cada tooltip es un <span role="tooltip"> enlazado con aria-describedby y aparece con :hover y con :focus-visible vía :has(), para que funcione con teclado.
Incluye variante arriba y abajo con flecha, un puente invisible para que no se cierre al mover el puntero, y fondo tinta sobre crema.
Transición corta que respete prefers-reduced-motion.
