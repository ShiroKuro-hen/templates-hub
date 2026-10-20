<script setup lang="ts">
import { ref } from 'vue';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLUMNS = [
  { title: 'Producto', id: 'c1', links: ['Plataforma', 'Automatizaciones', 'Integraciones', 'Precios'] },
  { title: 'Recursos', id: 'c2', links: ['Blog', 'Guías', 'Plantillas', 'Documentación'] },
  { title: 'Empresa', id: 'c3', links: ['Nosotros', 'Clientes', 'Empleo', 'Contacto'] },
  { title: 'Ayuda', id: 'c4', links: ['Centro de ayuda', 'Estado del servicio', 'Seguridad', 'API'] },
];

const email = ref('');
const error = ref('');
const sent = ref('');

function validate(value: string): string {
  if (!value) return 'Escribe tu correo para suscribirte.';
  return EMAIL.test(value) ? '' : 'Revisa el correo: falta el @ o el dominio.';
}

function submit() {
  const value = email.value.trim();
  error.value = validate(value);
  if (!error.value) sent.value = value;
}

function backToTop() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}
</script>

<template>
  <footer>
    <section class="news" aria-labelledby="fn-t">
      <div>
        <h2 id="fn-t">Novedades del producto, sin ruido</h2>
        <p class="lead">Un correo al mes con lanzamientos y guías. Te das de baja con un clic.</p>
      </div>
      <div>
        <p v-if="sent" class="done" role="status">Listo. Confirma tu suscripción en {{ sent }}.</p>
        <form v-else novalidate @submit.prevent="submit">
          <label for="fn-email">Correo electrónico</label>
          <div class="row">
            <input id="fn-email" v-model="email" type="email" name="email" autocomplete="email" placeholder="nombre@empresa.com" :aria-invalid="Boolean(error)" aria-describedby="fn-msg" @input="error = ''">
            <button type="submit" class="primary">Suscribirme</button>
          </div>
          <p id="fn-msg" class="msg" aria-live="polite">{{ error }}</p>
        </form>
      </div>
    </section>
    <div class="cols">
      <nav v-for="column in COLUMNS" :key="column.id" :aria-labelledby="column.id">
        <h3 :id="column.id">{{ column.title }}</h3>
        <ul>
          <li v-for="link in column.links" :key="link"><a href="#">{{ link }}</a></li>
        </ul>
      </nav>
    </div>
    <div class="legal">
      <p>© 2026 Nimbo Software, S.L.</p>
      <ul>
        <li><a href="#">Privacidad</a></li>
        <li><a href="#">Términos</a></li>
        <li><a href="#">Cookies</a></li>
      </ul>
      <button type="button" class="up" @click="backToTop">Volver arriba</button>
    </div>
  </footer>
</template>

<style scoped>
footer { max-width:1000px; margin:0 auto; overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
a { color:var(--muted); text-decoration:none; }
a:hover { color:var(--text); text-decoration:underline; text-underline-offset:3px; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.news { display:grid; gap:18px; padding:28px 24px; background:var(--accent-soft); border-bottom:1px solid var(--border); }
.news h2 { margin:0; font-size:20px; line-height:1.25; letter-spacing:-.01em; }
.lead { margin:6px 0 0; color:var(--muted); }
label { display:block; margin-bottom:6px; font-weight:600; }
.row { display:flex; flex-wrap:wrap; gap:8px; }
input { flex:1 1 200px; min-width:0; padding:9px 12px; font:inherit; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); }
input[aria-invalid=true] { border-color:var(--err); }
.primary { padding:9px 16px; font:inherit; font-weight:600; color:var(--accent-ink); background:var(--accent); border:1px solid var(--accent); border-radius:var(--radius); cursor:pointer; }
.primary:hover { filter:brightness(1.08); }
.msg { min-height:0; margin:8px 0 0; font-size:13px; color:var(--err); }
.done { margin:0; padding:12px 14px; color:var(--text); background:var(--ok-soft); border:1px solid var(--ok); border-radius:var(--radius); }
.cols { display:grid; grid-template-columns:repeat(2,1fr); gap:24px 16px; padding:28px 24px; }
h3 { margin:0 0 12px; font-size:12px; font-weight:700; line-height:1.5; letter-spacing:.08em; text-transform:uppercase; color:var(--text); }
.cols ul { display:grid; gap:8px; margin:0; padding:0; list-style:none; }
.legal { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px 20px; padding:16px 24px; border-top:1px solid var(--border); color:var(--muted); font-size:13px; }
.legal p { margin:0; }
.legal ul { display:flex; flex-wrap:wrap; gap:6px 16px; margin:0; padding:0; list-style:none; }
.up { padding:6px 12px; font:inherit; font-size:13px; font-weight:600; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; }
.up:hover { border-color:var(--accent); }
@media (min-width:900px) {
  .news { grid-template-columns:1fr 1.1fr; align-items:center; padding:32px; }
  .cols { grid-template-columns:repeat(4,1fr); gap:24px; padding:28px 32px; }
}
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
