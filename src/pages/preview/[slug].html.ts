import type { APIRoute, GetStaticPaths } from 'astro';
import { templates } from '../../lib/data';

// Sirve el html.html de cada plantilla como página real (iframe de la vista previa).
// Inyecta solo el tema (claro/oscuro): el código que el usuario copia queda limpio.
const THEME = `<script>(function(){var d=document.documentElement;function s(t){d.setAttribute('data-theme',t==='dark'?'dark':'light')}
var q=new URLSearchParams(location.search).get('theme');s(q||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
addEventListener('message',function(e){if(e.data&&e.data.theme)s(e.data.theme)})})();</script>`;

export const getStaticPaths = (() =>
  templates.filter((t) => t.code.html).map((t) => ({ params: { slug: t.slug }, props: { html: t.code.html } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const html = (props.html as string).replace('</head>', `${THEME}</head>`);
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
