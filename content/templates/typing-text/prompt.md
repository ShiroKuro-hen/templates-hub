Crea un titular de portada "{{titular}} + frase cambiante" (por ejemplo, "Automatiza ...") que escriba y borre en bucle {{frases}} con un cursor parpadeante de degradado.
Usa JS vanilla con setTimeout (55ms al escribir, 28ms al borrar, 1500ms de pausa con la frase completa) y reserva altura para que el diseño no salte. Oculta el texto animado a lectores de pantalla y ofrece una versión estática con clase sr-only.
Añade botones "Pausar/Reanudar" y "Repetir". Con prefers-reduced-motion muestra la primera frase fija, sin cursor ni botones.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
