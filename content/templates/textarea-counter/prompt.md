Crea un textarea para {{campo}} con límite de {{limite}} caracteres (maxlength) y un contador "n / límite" con una barra de progreso.
Al superar el 85% el contador pasa a aviso (amarillo) y al llegar al límite a error, con texto además del color ("Te quedan 12", "Límite alcanzado").
Un aria-live solo anuncia en umbrales para no saturar al lector de pantalla. Label asociado, estilo de bordes gruesos, sin librerías.
