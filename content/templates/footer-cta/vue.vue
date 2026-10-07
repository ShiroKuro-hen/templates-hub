<script setup lang="ts">
type Col = { id: string; title: string; links: string[] };

const cols: Col[] = [
  { id: 'f1', title: 'Producto', links: ['Automatizaciones', 'Integraciones', 'Seguridad', 'Precios'] },
  { id: 'f2', title: 'Recursos', links: ['Documentación', 'Referencia de la API', 'Blog', 'Comunidad'] },
  { id: 'f3', title: 'Empresa', links: ['Nosotros', 'Empleo', 'Clientes', 'Contacto'] },
  { id: 'f4', title: 'Soporte', links: ['Centro de ayuda', 'Estado del servicio', 'Contactar a soporte'] },
];
const legal = ['Privacidad', 'Términos', 'Cookies'];
const idiomas = ['Español', 'English', 'Português'];
</script>

<template>
  <div class="page">
    <section class="cta" aria-labelledby="cta-t">
      <div>
        <h2 id="cta-t">Automatiza tu primer flujo hoy</h2>
        <p>Crea tu cuenta en menos de un minuto. Sin tarjeta de crédito y con 14 días del plan Equipo incluidos.</p>
      </div>
      <div class="actions">
        <a class="btn pri" href="#">Empezar gratis</a>
        <a class="btn" href="#">Hablar con ventas</a>
      </div>
    </section>
    <footer>
      <div class="grid">
        <div class="about">
          <a class="brand" href="#" aria-label="Nimbo, inicio">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
              <rect width="24" height="24" rx="6" fill="url(#g)" />
              <path d="M7 16.5a3.5 3.5 0 0 1 .6-6.9A4.5 4.5 0 0 1 16.3 10a3.3 3.3 0 0 1 .7 6.5z" fill="#fff" />
            </svg>
            Nimbo
          </a>
          <p>Automatización para equipos que prefieren resolver antes que repetir.</p>
          <a class="status" href="#">Todos los sistemas operativos</a>
        </div>
        <nav v-for="c in cols" :key="c.id" :aria-labelledby="c.id">
          <h3 :id="c.id">{{ c.title }}</h3>
          <ul><li v-for="l in c.links" :key="l"><a href="#">{{ l }}</a></li></ul>
        </nav>
      </div>
      <div class="bottom">
        <span>© 2026 Nimbo, Inc. Todos los derechos reservados.</span>
        <ul><li v-for="l in legal" :key="l"><a href="#">{{ l }}</a></li></ul>
        <label>Idioma <select><option v-for="o in idiomas" :key="o">{{ o }}</option></select></label>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page{max-width:1100px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit;text-decoration:none}
a:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
.cta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;padding:32px;border:1px solid transparent;border-radius:var(--radius);background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box;box-shadow:var(--shadow)}
.cta h2{margin:0 0 4px;font-size:clamp(22px,3.5vw,28px);line-height:1.25;letter-spacing:-.02em}
.cta p{margin:0;max-width:46ch;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;gap:12px}
.btn{padding:9px 16px;font-weight:600;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:filter .14s,border-color .14s}
.btn:hover{border-color:var(--accent);filter:brightness(.97)}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
footer{margin-top:24px;padding:32px 8px 0;color:var(--muted)}
.grid{display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:32px}
.brand{display:inline-flex;align-items:center;gap:8px;font-size:18px;font-weight:700;letter-spacing:-.01em;color:var(--text)}
.brand svg{width:24px;height:24px}
.about p{margin:12px 0 16px;max-width:30ch}
.status{display:inline-flex;align-items:center;gap:8px;padding:2px 10px;border:1px solid var(--border);border-radius:999px;background:var(--surface);font-size:12px;color:var(--text)}
.status::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--ok)}
h3{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--text)}
ul{display:grid;gap:8px;margin:0;padding:0;list-style:none}
nav a{transition:color .14s}
nav a:hover{color:var(--text);text-decoration:underline;text-underline-offset:3px}
.bottom{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;margin-top:32px;padding:16px 0 4px;border-top:1px solid var(--border);font-size:13px}
.bottom ul{display:flex;flex-wrap:wrap;gap:4px 20px}
select{padding:4px 8px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
@media (max-width:860px){.grid{grid-template-columns:repeat(2,1fr)}.about{grid-column:1/-1}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
