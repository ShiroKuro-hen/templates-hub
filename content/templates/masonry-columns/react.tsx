type Color = 'warn' | 'info' | 'ok' | 'err'; // tono de la etiqueta; sin color = acento

export type Idea = { id: number; titulo: string; texto: string; etiqueta: string; color?: Color };

const DEMO: Idea[] = [
  { id: 1, titulo: 'Lanzamiento', texto: 'Publicar la versión 2.0 el 14 de noviembre.', etiqueta: 'Producto', color: 'warn' },
  { id: 2, titulo: 'Entrevistas', texto: 'Hablar con cinco clientes sobre cómo usan los informes y resumir las respuestas en una página.', etiqueta: 'Investigación' },
  { id: 3, titulo: 'Atajos', texto: 'Añadir atajos de teclado.', etiqueta: 'Mejora', color: 'info' },
  { id: 4, titulo: 'Blog', texto: 'Escribir el artículo sobre la nueva exportación a PDF, con capturas y un ejemplo paso a paso.', etiqueta: 'Contenido', color: 'ok' },
  { id: 5, titulo: 'Precios', texto: 'Revisar el plan Pro.', etiqueta: 'Negocio' },
  { id: 6, titulo: 'Errores', texto: 'Corregir el fallo al subir imágenes de más de 5 MB.', etiqueta: 'Soporte', color: 'err' },
];

export function Masonry({ ideas = DEMO }: { ideas?: Idea[] }) {
  return (
    <ul className="masonry">
      {ideas.map((i) => (
        <li key={i.id} className={i.color}>
          <h2>{i.titulo}</h2>
          <p>{i.texto}</p>
          <span className="tag">{i.etiqueta}</span>
        </li>
      ))}
    </ul>
  );
}
// CSS: copia las reglas .masonry (columns) / .masonry li / .tag / .warn .info .ok .err y los tokens :root de la pestaña HTML + CSS.
