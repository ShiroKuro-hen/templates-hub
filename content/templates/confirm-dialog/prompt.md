Crea un diálogo de confirmación para eliminar {{recurso}} usando <dialog> nativo con showModal() (Esc cancela, foco atrapado y devuelto al botón que lo abrió).
Explica qué se pierde ({{consecuencias}}) y pide escribir "ELIMINAR"; el botón destructivo queda deshabilitado hasta que el texto coincide.
Cancelar es type="button" para que Enter nunca confirme por accidente; confirma con <form method="dialog"> y returnValue, y anuncia el resultado con role="status".
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
