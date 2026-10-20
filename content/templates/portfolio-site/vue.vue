<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

type ProjectType = 'web' | 'app' | 'marca';
type Project = { title: string; type: ProjectType; meta: string; desc: string; alt: string; image: string };
type Field = 'nombre' | 'correo' | 'mensaje';
type Values = Record<Field, string> & { proyecto: string };

const projects: Project[] = [
  { title: 'Banca Abierta', type: 'web', meta: 'Web · 2025', desc: 'Portal de inversiones para particulares', alt: 'Portátil sobre un escritorio con estantería', image: '/stock/escritorio-laptop.webp' },
  { title: 'Atlas Clínico', type: 'web', meta: 'Web · 2023', desc: 'Panel de historiales para clínicas', alt: 'Escritorio visto desde arriba con teclado y tableta', image: '/stock/escritorio-cenital.webp' },
  { title: 'Nubla', type: 'app', meta: 'App · 2024', desc: 'App de meditación con sesiones guiadas', alt: 'Escritorio cenital con materiales de diseño y un teléfono', image: '/stock/escritorio-diseno.webp' },
  { title: 'Ruta Verde', type: 'app', meta: 'App · 2023', desc: 'Planificador de rutas a pie y en bici', alt: 'Calle de ciudad entre edificios', image: '/stock/calle-ciudad.webp' },
  { title: 'Hilo Atelier', type: 'marca', meta: 'Marca · 2024', desc: 'Identidad y envases de accesorios', alt: 'Cartera, reloj y auriculares sobre fondo plano', image: '/stock/objetos-planos.webp' },
  { title: 'Revista Faro', type: 'marca', meta: 'Marca · 2022', desc: 'Sistema tipográfico y portadas', alt: 'Luces de colores desenfocadas', image: '/stock/luces-bokeh.webp' },
];
const filters: { id: 'todos' | ProjectType; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'web', label: 'Web' },
  { id: 'app', label: 'App' },
  { id: 'marca', label: 'Marca' },
];
const nav = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
];
const stats = [
  ['Años de experiencia', '9'],
  ['Proyectos entregados', '60+'],
  ['Clientes recurrentes', '24'],
  ['Premios de diseño', '3'],
];
const skills = ['Figma', 'Sistemas de diseño', 'Accesibilidad WCAG', 'Investigación de usuarios', 'HTML y CSS', 'Tipografía', 'Prototipado'];
const experience = [
  { period: '2023 – hoy', role: 'Diseñadora senior', company: 'Lumbre Software' },
  { period: '2020 – 2023', role: 'Diseñadora de producto', company: 'Estudio Norte' },
  { period: '2017 – 2020', role: 'Diseñadora gráfica', company: 'Taller Azulejo' },
];
const rules: Record<Field, (v: string) => string> = {
  nombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu nombre (mínimo 2 letras).'),
  correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Introduce un correo válido, por ejemplo nombre@correo.com.'),
  mensaje: (v) => (v.trim().length >= 20 ? '' : 'Cuéntame un poco más (mínimo 20 caracteres).'),
};
const fields = Object.keys(rules) as Field[];

const filter = ref<'todos' | ProjectType>('todos');
const current = ref('');
const sent = ref('');
const values = reactive<Values>({ nombre: '', correo: '', proyecto: 'Web', mensaje: '' });
const errors = reactive<Partial<Record<Field, string>>>({});
const visible = computed(() => (filter.value === 'todos' ? projects : projects.filter((p) => p.type === filter.value)));

let spy: IntersectionObserver | undefined;
onMounted(() => {
  spy = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => (current.value = e.target.id));
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy?.observe(s));
});
onBeforeUnmount(() => spy?.disconnect());

watch(sent, (name) => {
  if (name) document.getElementById('done')?.focus();
});

function revalidate(name: keyof Values) {
  if (name in rules && errors[name as Field]) errors[name as Field] = rules[name as Field](values[name as Field]);
}

function onSubmit() {
  for (const f of fields) errors[f] = rules[f](values[f]);
  const first = fields.find((f) => errors[f]);
  if (first) return document.getElementById(first)?.focus();
  sent.value = values.nombre.trim();
}
</script>

<template>
  <div class="page">
    <header class="nav">
      <a class="name" href="#inicio">Laura Méndez</a>
      <nav aria-label="Principal">
        <ul>
          <li v-for="l in nav" :key="l.id"><a :href="`#${l.id}`" :aria-current="current === l.id ? 'true' : undefined">{{ l.label }}</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="hero" id="inicio" aria-labelledby="h1">
        <div>
          <p class="eyebrow">Diseñadora de producto · Madrid</p>
          <h1 id="h1">Interfaces claras, útiles y con carácter.</h1>
          <p class="lead">Ayudo a equipos de producto y a marcas a convertir ideas complejas en experiencias sencillas. Nueve años de oficio, desde la investigación hasta el código.</p>
          <div class="btns"><a class="btn pri" href="#proyectos">Ver proyectos</a><a class="btn" href="#contacto">Escribirme</a></div>
        </div>
        <dl class="stats">
          <div v-for="[label, value] in stats" :key="label"><dt>{{ label }}</dt><dd>{{ value }}</dd></div>
        </dl>
      </section>

      <section class="sec" id="proyectos" aria-labelledby="h-proy">
        <div class="sec-head">
          <h2 id="h-proy">Proyectos seleccionados</h2>
          <p>Trabajos de los últimos cuatro años. Pasa el cursor o usa el teclado para ver los detalles.</p>
        </div>
        <div class="filters" role="group" aria-label="Filtrar por tipo">
          <button v-for="f in filters" :key="f.id" type="button" :aria-pressed="filter === f.id" @click="filter = f.id">{{ f.label }}</button>
        </div>
        <ul class="works">
          <li v-for="p in visible" :key="p.title">
            <a class="work" href="#proyectos">
              <img :src="p.image" :alt="p.alt" width="800" height="533" loading="lazy" decoding="async">
              <span class="cap"><small>{{ p.meta }}</small><strong>{{ p.title }}</strong><span>{{ p.desc }}</span></span>
            </a>
          </li>
        </ul>
      </section>

      <section class="sec" id="sobre-mi" aria-labelledby="h-sobre">
        <div class="about">
          <div>
            <h2 id="h-sobre">Sobre mí</h2>
            <p>Trabajo entre el diseño de producto y la identidad de marca. Me interesan los detalles que nadie nota cuando están bien hechos: el espaciado, el texto de un error, la transición que orienta. Colaboro con startups y estudios desde Madrid y doy talleres de accesibilidad.</p>
            <ul class="chips" aria-label="Habilidades">
              <li v-for="s in skills" :key="s">{{ s }}</li>
            </ul>
          </div>
          <div>
            <h3 class="tl-title">Experiencia</h3>
            <ol class="tl">
              <li v-for="x in experience" :key="x.role"><time>{{ x.period }}</time><strong>{{ x.role }}</strong><span>{{ x.company }}</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section class="sec" id="contacto" aria-labelledby="h-contacto">
        <h2 id="h-contacto">Hablemos de tu proyecto</h2>
        <p class="lead">Cuéntame qué necesitas y te respondo en menos de dos días laborables.</p>
        <div v-if="sent" class="done" id="done" role="status" tabindex="-1">
          <h3>¡Mensaje enviado!</h3>
          <p>Gracias, {{ sent }}. He recibido tu mensaje y te escribiré pronto.</p>
        </div>
        <form v-else class="form" id="form" novalidate @submit.prevent="onSubmit">
          <div class="row">
            <div class="field">
              <label for="nombre">Nombre</label>
              <input id="nombre" v-model="values.nombre" name="nombre" required autocomplete="name" :aria-invalid="Boolean(errors.nombre)" aria-describedby="err-nombre" @input="revalidate('nombre')">
              <p class="error" id="err-nombre">{{ errors.nombre }}</p>
            </div>
            <div class="field">
              <label for="correo">Correo electrónico</label>
              <input id="correo" v-model="values.correo" name="correo" type="email" required autocomplete="email" :aria-invalid="Boolean(errors.correo)" aria-describedby="err-correo" @input="revalidate('correo')">
              <p class="error" id="err-correo">{{ errors.correo }}</p>
            </div>
          </div>
          <div class="field">
            <label for="proyecto">Tipo de proyecto</label>
            <select id="proyecto" v-model="values.proyecto" name="proyecto">
              <option>Web</option><option>App</option><option>Marca</option><option>Otro</option>
            </select>
          </div>
          <div class="field">
            <label for="mensaje">Mensaje</label>
            <textarea id="mensaje" v-model="values.mensaje" name="mensaje" required :aria-invalid="Boolean(errors.mensaje)" aria-describedby="err-mensaje" @input="revalidate('mensaje')"></textarea>
            <p class="error" id="err-mensaje">{{ errors.mensaje }}</p>
          </div>
          <div><button class="btn pri" type="submit">Enviar mensaje</button></div>
        </form>
      </section>
    </main>
    <footer>
      <span>© 2026 Laura Méndez · Diseño con calma</span>
      <ul>
        <li><a href="#contacto">Correo</a></li>
        <li><a href="#sobre-mi">Descargar CV</a></li>
      </ul>
    </footer>
  </div>
</template>

<style>
html{scroll-behavior:smooth}
body{margin:0;padding:20px;background:var(--bg);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.page{max-width:1100px;margin:0 auto}
section[id]{scroll-margin-top:72px}
p,h1,h2,h3{margin:0}
h1,h2,h3{line-height:1.1;letter-spacing:-.02em}
.nav{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px;padding:14px 0;background:var(--bg);border-bottom:1px solid var(--border)}
.name{margin-right:auto;font-size:17px;font-weight:700}
.nav ul{display:flex;flex-wrap:wrap;gap:4px 18px;margin:0;padding:0;list-style:none}
.nav ul a{position:relative;padding:4px 0;color:var(--muted)}
.nav ul a[aria-current]{color:var(--text)}
.nav ul a[aria-current]::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;border-radius:2px;background:var(--accent)}
.hero{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:end;padding:64px 0 48px}
.eyebrow{margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
h1{margin-bottom:16px;font-size:clamp(32px,6vw,58px);letter-spacing:-.035em}
.lead{max-width:52ch;margin:0 0 28px;font-size:16px;color:var(--muted)}
.btns{display:flex;flex-wrap:wrap;gap:10px}
.btn{display:inline-block;padding:9px 18px;font-weight:600;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .15s}
.btn:hover{border-color:var(--accent)}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:0;overflow:hidden;background:var(--border);border:1px solid var(--border);border-radius:var(--radius)}
.stats div{padding:18px;background:var(--surface)}
.stats dt{font-size:12px;color:var(--muted)}
.stats dd{margin:4px 0 0;font-size:28px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.sec{padding:48px 0;border-top:1px solid var(--border)}
.sec-head{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px 24px;margin-bottom:24px}
h2{font-size:clamp(24px,4vw,34px)}
.sec-head p{max-width:40ch;color:var(--muted)}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.filters button{font:inherit;font-weight:600;padding:6px 14px;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer}
.filters button[aria-pressed=true]{color:var(--accent);background:var(--accent-soft);border-color:var(--accent)}
.works{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin:0;padding:0;list-style:none}
.work{position:relative;display:block;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.work img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
.cap{position:absolute;left:12px;right:12px;bottom:12px;display:grid;gap:2px;padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-radius:min(var(--radius),6px);opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s}
.cap small{font-size:12px;color:var(--muted)}
.cap>span{font-size:13px;color:var(--muted)}
.work:hover .cap,.work:focus-visible .cap{opacity:1;transform:none}
.about{display:grid;grid-template-columns:1.2fr 1fr;gap:40px;align-items:start}
.about p{margin:0 0 20px;font-size:15px;color:var(--muted)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.chips li{padding:4px 12px;font-size:13px;font-weight:600;color:var(--accent);background:var(--accent-soft);border-radius:999px}
.tl-title{margin:0 0 16px;font-size:15px}
.tl{display:grid;gap:20px;margin:0;padding:0 0 0 20px;list-style:none;border-left:2px solid var(--border)}
.tl li{position:relative}
.tl li::before{content:"";position:absolute;left:-25px;top:5px;width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--bg)}
.tl time{display:block;font-size:12px;font-variant-numeric:tabular-nums;color:var(--muted)}
.tl strong{display:block}
.form{display:grid;gap:16px;max-width:600px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.field{display:grid;gap:6px}
.field label{font-weight:600}
.field input,.field select,.field textarea{width:100%;box-sizing:border-box;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:9px 12px}
.field textarea{min-height:120px;resize:vertical}
.field [aria-invalid=true]{border-color:var(--err)}
.error{font-size:13px;color:var(--err)}
.done{padding:24px;background:var(--ok-soft);border:1px solid var(--ok);border-radius:var(--radius)}
.done h3{margin-bottom:6px}
footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;padding:20px 0;border-top:1px solid var(--border);font-size:13px;color:var(--muted)}
footer ul{display:flex;gap:18px;margin:0;padding:0;list-style:none}
@media (max-width:760px){.hero,.about,.row{grid-template-columns:1fr}.hero{padding-top:36px}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
</style>
