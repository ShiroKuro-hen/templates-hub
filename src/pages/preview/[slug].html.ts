import type { APIRoute, GetStaticPaths } from 'astro';
import { templates, url } from '../../lib/data';

// Sirve el html.html de cada plantilla como página real (iframe de la vista previa).
// Inyecta solo el tema (claro/oscuro) y antepone la base de la web a /stock/: el código que el usuario copia queda limpio.
const THEME = `<script>(function(){var d=document.documentElement;function s(t){d.setAttribute('data-theme',t==='dark'?'dark':'light')}
var q=new URLSearchParams(location.search).get('theme');s(q||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
var st;function css(x){if(!st){st=document.createElement('style');st.id='hub-style';document.head.appendChild(st)}st.textContent=x}
addEventListener('message',function(e){if(e.data&&e.data.theme)s(e.data.theme);if(e.data&&typeof e.data.css==='string')css(e.data.css)})})();</script>`;

export const getStaticPaths = (() =>
  templates.filter((t) => t.code.html).map((t) => ({ params: { slug: t.slug }, props: { html: t.code.html } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const html = (props.html as string)
    .replace(/(["'(\s,])\/stock\//g, `$1${url('/stock/')}`)
    .replace('</head>', `${THEME}</head>`);
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
