Crea un calculador de precio mensual para {{producto}} con un deslizador de usuarios activos de 1 a 500.
El precio se calcula por tramos (cada tramo cobra su tarifa), muestra el tramo actual, el precio por usuario y el ahorro anual, y alterna entre facturación mensual y anual con un interruptor accesible.
El deslizador usa aria-valuetext con el número de usuarios; el precio cambia con una animación suave solo si el usuario no pide reducir movimiento, y cada cambio se anuncia con aria-live="polite".
Estilo moderno y compacto, con precio grande y deslizador grueso: tokens CSS con tema claro y oscuro, contraste AA, sin librerías.
