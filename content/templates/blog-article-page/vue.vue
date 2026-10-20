<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const CMD = 'nimbo cierre aplicar --reglas conciliacion.yml --mes 2026-09 --vista-previa';
const LINK = 'https://blog.ejemplo.com/cierre-mensual-en-tres-horas';
const SECTIONS = [
  { id: 'contexto', label: 'El problema' },
  { id: 'plan', label: 'El plan' },
  { id: 'codigo', label: 'Las reglas en código' },
  { id: 'resultados', label: 'Resultados' },
];
const RELATED = [
  { photo: 'escritorio-madera', alt: 'Portátil cerrado con gafas y ratón sobre una mesa de madera', title: 'Un escritorio limpio para cerrar sin prisas', meta: 'Productividad · 4 min' },
  { photo: 'escritorio-teclado', alt: 'Persona escribiendo en un portátil sobre una mesa de madera', title: 'Escribir las reglas de conciliación paso a paso', meta: 'Guías · 6 min' },
  { photo: 'escritorio-cafe', alt: 'Portátil con una taza de café sobre una mesa de madera', title: 'Pausas con café: el ritmo del cierre mensual', meta: 'Equipo · 5 min' },
];

const frame = ref<HTMLDivElement | null>(null);
const progress = ref(0);
const current = ref(SECTIONS[0].id);
const wide = ref(true);
const codeNote = ref('');
const linkNote = ref('');
const comment = ref('');
const commentNote = ref('');
const mq = matchMedia('(min-width:760px)');
const syncWide = () => { wide.value = mq.matches; };
let io: IntersectionObserver | undefined;

async function copy(text: string): Promise<string> {
  try {
    await navigator.clipboard.writeText(text);
    return 'Copiado';
  } catch {
    return 'No se pudo copiar. Selecciona el texto y cópialo a mano.';
  }
}

function onScroll(e: Event) {
  const el = e.currentTarget as HTMLElement, max = el.scrollHeight - el.clientHeight;
  progress.value = max > 0 ? el.scrollTop / max : 0;
}

function onSubmit() {
  if (!comment.value.trim()) {
    commentNote.value = 'Escribe un comentario antes de enviarlo.';
    return;
  }
  comment.value = '';
  commentNote.value = 'Gracias. Tu comentario quedó en revisión.';
}

onMounted(() => {
  syncWide();
  mq.addEventListener('change', syncWide);
  const root = frame.value;
  if (!root) return;
  const visible = new Set<Element>();
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    const first = [...root.querySelectorAll<HTMLHeadingElement>('article h2')].find((h) => visible.has(h));
    if (first) current.value = first.id;
  }, { root, rootMargin: '0px 0px -70% 0px' });
  root.querySelectorAll('article h2').forEach((h) => io?.observe(h));
});

onBeforeUnmount(() => {
  mq.removeEventListener('change', syncWide);
  io?.disconnect();
});
</script>

<template>
  <div ref="frame" class="frame" tabindex="0" role="region" aria-label="Artículo: cierre mensual en tres horas" @scroll="onScroll">
    <div class="bar" role="progressbar" aria-label="Progreso de lectura" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100">
      <i :style="{ '--p': progress }" />
    </div>
    <div class="page">
      <nav aria-label="Ruta">
        <ol class="crumbs"><li><a href="#">Blog</a></li><li><a href="#">Ingeniería</a></li><li aria-current="page">Cierre mensual</li></ol>
      </nav>
      <header>
        <h1>Cómo redujimos el cierre mensual de tres días a tres horas</h1>
        <p class="lead">Automatizamos las conciliaciones, separamos los pasos que bloqueaban al equipo y medimos cada cambio antes de publicarlo.</p>
        <div class="byline">
          <span class="av" aria-hidden="true">CT</span>
          <div><b>Camila Torres</b><time datetime="2026-10-02">2 oct 2026</time> · <span>9 min de lectura</span></div>
        </div>
      </header>
      <div class="layout">
        <details class="toc" :open="wide">
          <summary>En este artículo</summary>
          <ol>
            <li v-for="s in SECTIONS" :key="s.id">
              <a :href="`#${s.id}`" :aria-current="current === s.id ? 'location' : undefined">{{ s.label }}</a>
            </li>
          </ol>
        </details>
        <article class="body">
          <h2 id="contexto">El problema</h2>
          <p>Cada fin de mes, el equipo de finanzas cruzaba a mano más de cuarenta mil movimientos entre el banco, el ERP y las hojas de cálculo. Un error de un solo dígito obligaba a repetir el proceso entero.</p>
          <p>Durante seis meses medimos dónde se perdía el tiempo: tres de cada cuatro horas eran de copiar, pegar y esperar.</p>
          <blockquote>
            <p>Pasamos de revisar todo a revisar solo lo que no cuadra. Esa fue la decisión que lo cambió todo.</p>
            <footer>Valeria Rojas, directora de finanzas</footer>
          </blockquote>
          <h2 id="plan">El plan</h2>
          <p>Definimos tres reglas de conciliación con tolerancias explícitas. Lo que cumple la regla se cierra solo; lo demás pasa a una cola con el motivo escrito.</p>
          <h3>Probar antes de activar</h3>
          <p>Cada regla se ejecuta primero en modo de vista previa sobre datos reales. Así comparamos el resultado con el cierre manual del mes anterior, sin tocar un solo asiento.</p>
          <figure>
            <img src="/stock/escritorio-notas.webp" alt="Portátil abierto junto a una libreta con notas sobre una mesa de madera" width="800" height="533" loading="lazy" />
            <figcaption>Libreta con las reglas de conciliación, escritas antes de automatizarlas.</figcaption>
          </figure>
          <h2 id="codigo">Las reglas en código</h2>
          <p>La herramienta de línea de comandos lee el archivo de reglas y ejecuta el cierre en un entorno aislado. Este es el comando que usamos cada mes:</p>
          <div class="code">
            <div class="code-head">
              <span>Terminal</span>
              <span class="tools">
                <span class="note" role="status">{{ codeNote }}</span>
                <button type="button" class="btn" @click="async () => (codeNote = await copy(CMD))">Copiar</button>
              </span>
            </div>
            <pre><code>{{ CMD }}</code></pre>
          </div>
          <aside class="callout"><b>Consejo</b><p>Empieza con una sola regla y compara dos meses antes de añadir la siguiente. Las tolerancias deben ser de tu negocio, no las que vienen por defecto.</p></aside>
          <h2 id="resultados">Resultados</h2>
          <p>En septiembre cerramos en tres horas y diecisiete minutos. El 96 % de los movimientos se concilió sin intervención, y la cola manual pasó de 4.100 casos a 160.</p>
          <figure class="chart">
            <svg viewBox="0 0 640 300" role="img" aria-label="Gráfico de barras: horas de cierre por mes, de 72 en marzo a 3 en septiembre">
              <path d="M30 260H610" />
              <rect x="50" y="44" width="52" height="216" rx="6" />
              <rect x="134" y="86" width="52" height="174" rx="6" />
              <rect x="218" y="137" width="52" height="123" rx="6" />
              <rect x="302" y="194" width="52" height="66" rx="6" />
              <rect x="386" y="224" width="52" height="36" rx="6" />
              <rect x="470" y="242" width="52" height="18" rx="6" />
              <rect x="554" y="251" width="52" height="9" rx="6" />
            </svg>
            <figcaption>Horas dedicadas al cierre mensual, de marzo a septiembre de 2026.</figcaption>
          </figure>
          <p>Todavía queda trabajo: los pagos en moneda extranjera siguen necesitando revisión humana, y lo abordaremos el próximo trimestre.</p>
        </article>
      </div>
      <section class="author" aria-label="Sobre la autora">
        <span class="av" aria-hidden="true">CT</span>
        <div><b>Camila Torres</b><p>Ingeniera de plataforma en Nimbo. Escribe sobre automatización financiera y sobre cómo ayudar a los equipos a confiar en sus datos.</p></div>
      </section>
      <div class="share" role="group" aria-label="Compartir artículo">
        <span>Compartir</span>
        <button type="button" class="btn" @click="async () => (linkNote = await copy(LINK))">Copiar enlace</button>
        <a class="btn" href="mailto:?subject=C%C3%B3mo%20redujimos%20el%20cierre%20mensual">Enviar por correo</a>
        <span class="note" role="status">{{ linkNote }}</span>
      </div>
      <section aria-labelledby="rl">
        <h2 id="rl">Sigue leyendo</h2>
        <ul class="rel">
          <li v-for="r in RELATED" :key="r.title" class="card">
            <img class="cover" :src="'/stock/' + r.photo + '.webp'" :alt="r.alt" width="800" height="533" loading="lazy" />
            <div class="txt"><h3><a href="#">{{ r.title }}</a></h3><small>{{ r.meta }}</small></div>
          </li>
        </ul>
      </section>
      <section aria-labelledby="cm" class="comments">
        <h2 id="cm">Comentarios</h2>
        <form class="cform" @submit.prevent="onSubmit">
          <label for="ct">Deja tu comentario</label>
          <textarea id="ct" v-model="comment" rows="3" placeholder="¿Qué harías distinto en tu equipo?" />
          <div class="row"><span class="hint">Los comentarios se revisan antes de publicarse.</span><button type="submit" class="primary">Comentar</button></div>
          <p class="note" role="status">{{ commentNote }}</p>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.frame,.author,.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.frame{--brand:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff));height:600px;overflow-y:auto;scroll-behavior:smooth}
.bar{position:sticky;top:0;z-index:2;height:4px;background:var(--border)}
.bar i{display:block;height:100%;transform:scaleX(var(--p,0));transform-origin:0 50%;background:var(--brand)}
.page{max-width:880px;margin:0 auto;padding:24px 28px 32px}
.crumbs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 20px;padding:0;list-style:none;font-size:13px;color:var(--muted)}
.crumbs li+li::before{content:"/";margin-right:6px}
h1{margin:0 0 12px;font-size:clamp(26px,4.4vw,38px);line-height:1.15;letter-spacing:-.02em}
.lead{margin:0 0 20px;max-width:62ch;font-size:16px;color:var(--muted)}
.byline{display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);font-size:13px;color:var(--muted)}
.byline b{display:block;font-size:14px;color:var(--text)}
.av{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:700}
.layout{display:grid;grid-template-columns:200px minmax(0,1fr);gap:32px;align-items:start}
.toc{position:sticky;top:16px}
.toc>summary{display:none;list-style:none;cursor:pointer}
.toc ol{margin:0;padding:0;list-style:none;border-left:1px solid var(--border)}
.toc a{position:relative;display:block;padding:4px 12px;font-size:13px;color:var(--muted);transition:color .14s}
.toc a[aria-current]{color:var(--accent);font-weight:600}
.toc a[aria-current]::before{content:"";position:absolute;left:-1px;top:4px;bottom:4px;width:3px;border-radius:999px;background:var(--brand)}
.body{min-width:0;font-size:15px;line-height:1.7}
.body h2,.related h2,.comments h2{margin:36px 0 12px;font-size:20px;line-height:1.3;scroll-margin-top:16px}
.body h3{margin:24px 0 8px;font-size:16px;line-height:1.4}
.body p{margin:0 0 14px;max-width:68ch}
.body blockquote{margin:24px 0;padding:2px 0 2px 18px;border-left:3px solid var(--accent);font-size:17px;line-height:1.5}
.body blockquote p{margin:0}
.body blockquote footer{margin-top:8px;font-size:13px;color:var(--muted)}
.body figure{margin:24px 0}
figure img{display:block;width:100%;height:auto;aspect-ratio:800/533;object-fit:cover;border:1px solid var(--border);border-radius:var(--radius)}
figcaption{margin-top:8px;font-size:13px;color:var(--muted)}
.chart svg{display:block;width:100%;height:auto}
.chart rect{fill:var(--accent)}
.chart path{stroke:var(--border);stroke-width:2}
.code{margin:18px 0;overflow:hidden;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.code-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 6px 6px 14px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--border)}
.tools{display:flex;align-items:center;gap:8px}
.note{font-size:12px;color:var(--muted)}
.btn{display:inline-flex;align-items:center;padding:6px 12px;font:inherit;font-size:13px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:min(var(--radius),6px);cursor:pointer;transition:border-color .14s}
.btn:hover{border-color:var(--accent)}
.code pre{margin:0;padding:12px 14px;overflow-x:auto}
.code code{font:13px/1.6 ui-monospace,"Cascadia Code",Menlo,monospace}
.callout{margin:20px 0;padding:14px 16px;background:var(--info-soft);border:1px solid var(--border);border-left:3px solid var(--info);border-radius:var(--radius)}
.callout b{display:block;margin-bottom:4px}
.callout p{margin:0}
.author{display:flex;align-items:center;gap:14px;margin-top:32px;padding:18px}
.author .av{width:48px;height:48px;font-size:15px}
.author b{display:block}
.author p{margin:2px 0 0;font-size:13px;color:var(--muted)}
.share{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:24px;font-size:13px;color:var(--muted)}
.rel{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:0;padding:0;list-style:none}
.card{position:relative;overflow:hidden;transition:border-color .14s}
.card:hover{border-color:var(--accent)}
.card:has(a:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.cover{display:block;width:100%;height:96px;object-fit:cover}
.txt{padding:12px 14px 14px}
.txt h3{margin:0;font-size:15px;line-height:1.35}
.txt h3 a::after{content:"";position:absolute;inset:0}
.txt small{display:block;margin-top:6px;font-size:12px;color:var(--muted)}
.cform{display:grid;gap:8px}
.cform label{font-weight:600}
.cform p{margin:0}
textarea{font:inherit;padding:10px 12px;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);resize:vertical}
.row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}
.hint{font-size:13px;color:var(--muted)}
.primary{font:inherit;font-weight:600;padding:8px 16px;color:var(--accent-ink);background:var(--accent);border:0;border-radius:var(--radius);cursor:pointer}
@media (max-width:759px){
  .frame{height:560px}
  .page{padding:20px 16px 28px}
  .layout{grid-template-columns:minmax(0,1fr);gap:0}
  .toc{position:static;margin-bottom:20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
  .toc>summary{display:block;padding:10px 14px;font-weight:600}
  .toc ol{padding:0 0 8px;border-left:0}
  .toc a{padding:6px 14px}
  .rel{grid-template-columns:minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){.frame{scroll-behavior:auto}}
</style>
