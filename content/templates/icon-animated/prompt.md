Crea cuatro iconos SVG animados de estado para {{producto}}: cargando (arco que gira), éxito (círculo y marca que se dibujan), error (círculo y aspa que se dibujan y vibran una vez) y copiar (el icono de copiar cambia a una marca verde durante 1,6 s).
Usa stroke-dasharray con pathLength="1" para dibujar los trazos, colores de estado desde los tokens y un botón "Repetir animación" en éxito y error.
El botón de copiar copia {{texto_a_copiar}} al portapapeles y anuncia el cambio con aria-live. Con prefers-reduced-motion el icono se muestra directamente en su estado final.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
