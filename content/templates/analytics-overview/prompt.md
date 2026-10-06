Crea un panel de analítica para {{producto}} con cuatro KPIs ({{metricas}}), cada uno con su variación en una píldora verde o roja.
Debajo, un gráfico de líneas en SVG puro (polyline + área suave, líneas guía de 1px) que escale al ancho disponible.
Añade un selector de rango 7/30/90 días hecho con radios nativos (control segmentado, flechas del teclado) que actualice KPIs y gráfico.
El SVG lleva role="img" y un aria-label con la tendencia; los KPIs van en un <dl> con aria-live="polite".
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
