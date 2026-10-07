Crea un botón primario "{{texto_del_boton}}" que sube {{nombre_del_archivo}} y muestra el progreso dentro del propio botón: texto "Subiendo 42 %" y una barra fina de 3px en la base con degradado.
Estados: reposo, subiendo (aria-busy, cursor progress, botón no reutilizable), completado (verde, "Informe subido") y vuelta a reposo a los 2,5 s. Un enlace "Cancelar subida" aparece solo mientras sube.
Anuncia el avance cada 25 % y el resultado con role="status"; la barra lleva role="progressbar" con aria-valuenow. Sin librerías.
Estilo sobrio y profesional: bordes finos de 1px, radio 8px, sombras suaves, acento azul, tokens CSS con tema claro y oscuro.
