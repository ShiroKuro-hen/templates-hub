<script setup lang="ts">
const LINKS = ['Producto', 'Precios', 'Blog', 'Empleo', 'Contacto', 'Privacidad'];
</script>

<template>
  <footer>
    <a class="logo" href="#inicio" aria-label="Nimbo, inicio"><span class="mark" aria-hidden="true">N</span>Nimbo</a>
    <nav aria-label="Enlaces del pie">
      <ul>
        <li v-for="link in LINKS" :key="link"><a href="#">{{ link }}</a></li>
      </ul>
    </nav>
    <ul class="social">
      <li><a href="#correo" aria-label="Escríbenos por correo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2.5" /><path d="M5 8l7 5 7-5" /></svg></a></li>
      <li><a href="#rss" aria-label="Feed RSS del blog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11a8 8 0 0 1 8 8M5 5.5a13.5 13.5 0 0 1 13.5 13.5" /><circle cx="6" cy="18" r="1.3" fill="currentColor" stroke="none" /></svg></a></li>
      <li><a href="#discord" aria-label="Comunidad en Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14v9H11l-4 3v-3H5z" /></svg></a></li>
    </ul>
    <div class="prefs">
      <label>Idioma <select><option>Español</option><option>English</option><option>Português</option></select></label>
      <p class="hint">El tema sigue la configuración de tu dispositivo.</p>
    </div>
    <p class="copy">© 2026 Nimbo Software, S.L. Todos los derechos reservados.</p>
  </footer>
</template>

<style scoped>
footer { max-width:560px; margin:0 auto; padding:40px 16px 32px; text-align:center; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
a { color:var(--muted); text-decoration:none; }
nav a:hover { color:var(--text); text-decoration:underline; text-underline-offset:3px; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.logo { display:inline-flex; align-items:center; gap:8px; color:var(--text); font-size:1.1rem; font-weight:700; letter-spacing:-.02em; border-radius:min(var(--radius),6px); }
.mark { display:grid; place-items:center; width:24px; height:24px; border-radius:min(var(--radius),6px); background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); color:var(--accent-ink); font-size:.8rem; font-weight:700; }
nav ul { display:flex; flex-wrap:wrap; justify-content:center; gap:8px 20px; margin:22px 0 0; padding:0; list-style:none; }
.social { display:flex; justify-content:center; gap:10px; margin:24px 0 0; padding:0; list-style:none; }
.social a { display:grid; place-items:center; width:40px; height:40px; border:1px solid var(--border); border-radius:999px; background:var(--surface); transition:color .14s, border-color .14s; }
.social a:hover { color:var(--accent); border-color:var(--accent); }
.social svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:1.75; stroke-linecap:round; stroke-linejoin:round; }
.prefs { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:10px 18px; margin:28px 0 0; color:var(--muted); font-size:13px; }
.prefs label { display:inline-flex; align-items:center; gap:8px; }
select { font:inherit; padding:4px 8px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:min(var(--radius),6px); }
.hint { margin:0; }
.copy { margin:22px 0 0; color:var(--muted); font-size:12px; }
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
