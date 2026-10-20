<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Status = 'activo' | 'invitado' | 'suspendido';
type User = { id: number; name: string; email: string; role: string; status: Status; last: string; since: string };

const DEFAULTS: User[] = [
  { id: 1, name: 'Laura Méndez', email: 'laura.mendez@nimbo.es', role: 'Administrador', status: 'activo', last: 'Hace 12 min', since: 'Marzo de 2024' },
  { id: 2, name: 'Mateo Ruiz', email: 'mateo.ruiz@nimbo.es', role: 'Editor', status: 'activo', last: 'Hace 2 h', since: 'Junio de 2024' },
  { id: 3, name: 'Lucía Fernández', email: 'lucia.fernandez@nimbo.es', role: 'Analista', status: 'activo', last: 'Ayer', since: 'Septiembre de 2024' },
  { id: 4, name: 'Javier Ortiz', email: 'javier.ortiz@nimbo.es', role: 'Lector', status: 'suspendido', last: '28 ago 2026', since: 'Enero de 2025' },
  { id: 5, name: 'Carmen Vidal', email: 'carmen.vidal@nimbo.es', role: 'Editor', status: 'activo', last: 'Hace 35 min', since: 'Febrero de 2025' },
  { id: 6, name: 'Diego Herrera', email: 'diego.herrera@nimbo.es', role: 'Analista', status: 'invitado', last: 'Sin acceso todavía', since: 'Octubre de 2026' },
  { id: 7, name: 'Elena Castro', email: 'elena.castro@nimbo.es', role: 'Lector', status: 'activo', last: '17 oct 2026', since: 'Abril de 2025' },
  { id: 8, name: 'Pablo Navarro', email: 'pablo.navarro@nimbo.es', role: 'Administrador', status: 'activo', last: 'Ayer', since: 'Enero de 2024' },
  { id: 9, name: 'Sofía Iglesias', email: 'sofia.iglesias@nimbo.es', role: 'Editor', status: 'invitado', last: 'Sin acceso todavía', since: 'Octubre de 2026' },
  { id: 10, name: 'Andrés Molina', email: 'andres.molina@nimbo.es', role: 'Lector', status: 'suspendido', last: '2 sep 2026', since: 'Julio de 2025' },
  { id: 11, name: 'Marta Domínguez', email: 'marta.dominguez@nimbo.es', role: 'Analista', status: 'activo', last: 'Hace 4 h', since: 'Mayo de 2025' },
  { id: 12, name: 'Raúl Gallego', email: 'raul.gallego@nimbo.es', role: 'Editor', status: 'activo', last: '15 oct 2026', since: 'Noviembre de 2025' },
];
const PER = 5;
const LABEL: Record<Status, string> = { activo: 'Activo', invitado: 'Invitado', suspendido: 'Suspendido' };
const ROLES = ['Administrador', 'Editor', 'Analista', 'Lector'];
const ICON = {
  inicio: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  usuarios: 'M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 7M21 20c0-2.5-1.5-4.6-3.5-5.5',
  informes: 'M5 20V10M12 20V4M19 20v-7',
  ajustes: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  menu: 'M4 6h16M4 12h16M4 18h16',
  buscar: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  mas: 'M5 12h.01M12 12h.01M19 12h.01',
  cerrar: 'M6 6l12 12M18 6L6 18',
  prev: 'M15 6l-6 6 6 6',
  next: 'M9 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
};

const props = withDefaults(defineProps<{ items?: User[] }>(), { items: () => DEFAULTS });
const initials = (name: string) => name.split(' ').slice(0, 2).map((p) => p[0]).join('');
const noun = (n: number) => (n === 1 ? 'usuario' : 'usuarios');

const users = ref<User[]>([...props.items]);
const q = ref('');
const role = ref('');
const status = ref<Status | 'all'>('all');
const page = ref(1);
const sel = ref<number[]>([]);
const pending = ref<'suspend' | 'delete' | null>(null);
const menu = ref<number | null>(null);
const detail = ref<User | null>(null);
const tab = ref<'perfil' | 'act'>('perfil');
const msg = ref('');
const rail = ref(matchMedia('(max-width:520px)').matches);
const app = ref<HTMLElement | null>(null);
const dialog = ref<HTMLDialogElement | null>(null);
let trigger: HTMLElement | null = null;

const list = computed(() => users.value.filter((u) =>
  (!role.value || u.role === role.value) && (status.value === 'all' || u.status === status.value) && `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.value.trim().toLowerCase())));
const pages = computed(() => Math.max(1, Math.ceil(list.value.length / PER)));
const current = computed(() => Math.min(page.value, pages.value));
const rows = computed(() => list.value.slice((current.value - 1) * PER, current.value * PER));
const picked = computed(() => rows.value.filter((u) => sel.value.includes(u.id)).length);
const chips = computed(() => [
  { v: 'all', label: 'Todos', n: users.value.length },
  { v: 'activo', label: 'Activos', n: users.value.filter((u) => u.status === 'activo').length },
  { v: 'invitado', label: 'Invitados', n: users.value.filter((u) => u.status === 'invitado').length },
  { v: 'suspendido', label: 'Suspendidos', n: users.value.filter((u) => u.status === 'suspendido').length },
]);
const ask = computed(() => (pending.value === 'delete'
  ? `¿Eliminar ${sel.value.length} ${noun(sel.value.length)}? No se puede deshacer.`
  : `¿Suspender a ${sel.value.length} ${noun(sel.value.length)}?`));
const range = computed(() => (list.value.length
  ? `Mostrando ${(current.value - 1) * PER + 1}–${(current.value - 1) * PER + rows.value.length} de ${list.value.length}`
  : 'Sin resultados'));

watch([q, role, status], () => { page.value = 1; });

watch(detail, (u) => {
  const d = dialog.value;
  if (!d) return;
  if (u && !d.open) d.showModal();
  if (!u && d.open) d.close();
  if (app.value) app.value.inert = Boolean(u);
});

function setSelected(id: number, on: boolean) {
  pending.value = null;
  sel.value = on ? [...sel.value, id] : sel.value.filter((x) => x !== id);
}

function setPageSelected(on: boolean) {
  pending.value = null;
  const ids = rows.value.map((u) => u.id);
  sel.value = on ? [...new Set([...sel.value, ...ids])] : sel.value.filter((x) => !ids.includes(x));
}

function toggleStatus(u: User) {
  const next: Status = u.status === 'suspendido' ? 'activo' : 'suspendido';
  users.value = users.value.map((x) => (x.id === u.id ? { ...x, status: next } : x));
  menu.value = null;
  msg.value = `Estado de ${u.name}: ${LABEL[next]}.`;
}

function applyBulk() {
  if (!pending.value) return;
  const n = sel.value.length;
  const ids = sel.value;
  users.value = pending.value === 'delete'
    ? users.value.filter((u) => !ids.includes(u.id))
    : users.value.map((u) => (ids.includes(u.id) ? { ...u, status: 'suspendido' as Status } : u));
  msg.value = `${n} ${noun(n)} ${pending.value === 'delete' ? 'eliminado' : 'suspendido'}${n === 1 ? '' : 's'}.`;
  sel.value = [];
  pending.value = null;
}

function openDetail(u: User, from: HTMLElement) {
  trigger = from;
  tab.value = 'perfil';
  menu.value = null;
  detail.value = u;
}

function openFromMenu(u: User, e: Event) {
  const row = (e.currentTarget as HTMLElement).closest('tr');
  openDetail(u, row?.querySelector<HTMLElement>('.more') ?? (e.currentTarget as HTMLElement));
}

function closeDetail() {
  detail.value = null;
  trigger?.focus();
}

function resetFilters() {
  q.value = '';
  role.value = '';
  status.value = 'all';
}

function closeMenuOnOutside(e: MouseEvent) {
  if (!(e.target as Element).closest('.c-act')) menu.value = null;
}

function closeMenuOnEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') menu.value = null;
}

onMounted(() => {
  document.addEventListener('click', closeMenuOnOutside);
  document.addEventListener('keydown', closeMenuOnEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenuOnOutside);
  document.removeEventListener('keydown', closeMenuOnEscape);
});
</script>

<template>
  <div ref="app" :class="['app', { rail }]">
    <nav class="side" aria-label="Principal">
      <div class="brand"><span class="logo" aria-hidden="true"></span><span class="brand-t">Nimbo</span></div>
      <ul>
        <li><a href="#"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.inicio" /></svg><span class="lbl">Inicio</span></a></li>
        <li><a href="#" aria-current="page"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.usuarios" /></svg><span class="lbl">Usuarios</span></a></li>
        <li><a href="#"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.informes" /></svg><span class="lbl">Informes</span></a></li>
        <li><a href="#"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.ajustes" /></svg><span class="lbl">Ajustes</span></a></li>
      </ul>
    </nav>
    <div class="main">
      <header class="top">
        <button class="iconbtn" type="button" :aria-expanded="!rail" aria-controls="side" :aria-label="rail ? 'Expandir menú' : 'Contraer menú'" @click="rail = !rail">
          <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.menu" /></svg>
        </button>
        <div class="search" role="search">
          <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.buscar" /></svg>
          <input v-model="q" type="search" placeholder="Buscar por nombre, correo o rol" aria-label="Buscar usuarios por nombre, correo o rol">
        </div>
        <div class="end">
          <button class="iconbtn" type="button" aria-label="Notificaciones, 2 sin leer"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.bell" /></svg></button>
          <button class="avatar" type="button" aria-label="Cuenta de Laura Méndez">LM</button>
        </div>
      </header>

      <main class="content">
        <div class="head">
          <div>
            <h1 tabindex="-1">Usuarios</h1>
            <p>{{ users.length }} personas tienen acceso a este espacio de trabajo.</p>
          </div>
          <button class="btn" type="button" @click="msg = 'Escribe el correo del nuevo usuario para enviar la invitación.'">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.plus" /></svg>Invitar usuario
          </button>
        </div>

        <div class="filters">
          <label class="rolesel">Rol
            <select v-model="role" class="field">
              <option value="">Todos los roles</option>
              <option v-for="r in ROLES" :key="r">{{ r }}</option>
            </select>
          </label>
          <div class="chips" role="group" aria-label="Filtrar por estado">
            <button v-for="c in chips" :key="c.v" class="chip" type="button" :aria-pressed="status === c.v" @click="status = c.v as Status | 'all'">
              {{ c.label }}<span class="n">{{ c.n }}</span>
            </button>
          </div>
        </div>

        <p class="msg" role="status">{{ msg }}</p>

        <section class="card" aria-label="Listado de usuarios">
          <div v-if="sel.length" class="bulk">
            <span class="count" aria-live="polite">{{ sel.length }}</span><span>seleccionados</span>
            <div v-if="pending" class="confirm">
              <span>{{ ask }}</span>
              <button class="btn ghost" type="button" @click="pending = null">Cancelar</button>
              <button class="btn solid-err" type="button" @click="applyBulk">Confirmar</button>
            </div>
            <div v-else class="bulk-acts">
              <button class="btn ghost" type="button" @click="pending = 'suspend'">Suspender</button>
              <button class="btn ghost danger" type="button" @click="pending = 'delete'">Eliminar</button>
            </div>
          </div>
          <div class="scroll">
            <table>
              <caption class="sr-only">Usuarios del espacio de trabajo. Marca filas para aplicar acciones en bloque.</caption>
              <thead>
                <tr>
                  <th class="c-sel" scope="col">
                    <input type="checkbox" aria-label="Seleccionar todos los usuarios de esta página" :disabled="!rows.length"
                      :checked="rows.length > 0 && picked === rows.length" :indeterminate.prop="picked > 0 && picked < rows.length"
                      @change="setPageSelected(($event.target as HTMLInputElement).checked)">
                  </th>
                  <th scope="col">Usuario</th><th scope="col">Rol</th><th scope="col">Estado</th><th scope="col">Última actividad</th>
                  <th class="c-act" scope="col"><span class="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in rows" :key="u.id" :class="{ on: sel.includes(u.id) }">
                  <td class="c-sel">
                    <input type="checkbox" :aria-label="`Seleccionar a ${u.name}`" :checked="sel.includes(u.id)"
                      @change="setSelected(u.id, ($event.target as HTMLInputElement).checked)">
                  </td>
                  <th scope="row">
                    <div class="who">
                      <span class="av" aria-hidden="true">{{ initials(u.name) }}</span>
                      <span>
                        <button class="name" type="button" @click="openDetail(u, $event.currentTarget as HTMLElement)">{{ u.name }}</button>
                        <span class="mail">{{ u.email }}</span>
                      </span>
                    </div>
                  </th>
                  <td class="rest" data-label="Rol"><span class="role">{{ u.role }}</span></td>
                  <td class="rest" data-label="Estado"><span :class="['st', u.status]">{{ LABEL[u.status] }}</span></td>
                  <td class="rest" data-label="Última actividad"><span class="last">{{ u.last }}</span></td>
                  <td class="c-act">
                    <button class="more" type="button" :aria-label="`Acciones de ${u.name}`" :aria-expanded="menu === u.id" :aria-controls="`m-${u.id}`"
                      @click="menu = menu === u.id ? null : u.id">
                      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.mas" /></svg>
                    </button>
                    <div :id="`m-${u.id}`" class="menu" :hidden="menu !== u.id">
                      <button type="button" @click="openFromMenu(u, $event)">Ver perfil</button>
                      <button type="button" @click="toggleStatus(u)">{{ u.status === 'suspendido' ? 'Reactivar' : 'Suspender' }}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="!list.length" class="empty">No hay usuarios con esos filtros. <button class="link" type="button" @click="resetFilters">Limpiar filtros</button></p>
          <div class="pager">
            <span aria-live="polite">{{ range }}</span>
            <div class="pg">
              <button class="iconbtn" type="button" aria-label="Página anterior" :disabled="current === 1" @click="page = current - 1"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.prev" /></svg></button>
              <span>Página {{ current }} de {{ pages }}</span>
              <button class="iconbtn" type="button" aria-label="Página siguiente" :disabled="current === pages" @click="page = current + 1"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.next" /></svg></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <dialog ref="dialog" class="drawer" aria-labelledby="dname" @close="closeDetail">
    <template v-if="detail">
      <div class="dhead">
        <span class="av" aria-hidden="true">{{ initials(detail.name) }}</span>
        <div><h2 id="dname">{{ detail.name }}</h2><p>{{ detail.email }}</p></div>
        <button class="iconbtn" type="button" aria-label="Cerrar detalle" @click="dialog?.close()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICON.cerrar" /></svg></button>
      </div>
      <div class="tabs" role="tablist" aria-label="Secciones del usuario">
        <button class="tab" type="button" role="tab" :aria-selected="tab === 'perfil'" @click="tab = 'perfil'">Perfil</button>
        <button class="tab" type="button" role="tab" :aria-selected="tab === 'act'" @click="tab = 'act'">Actividad</button>
      </div>
      <div class="dbody">
        <dl v-if="tab === 'perfil'" class="facts">
          <dt>Rol</dt><dd>{{ detail.role }}</dd>
          <dt>Estado</dt><dd>{{ LABEL[detail.status] }}</dd>
          <dt>Último acceso</dt><dd>{{ detail.last }}</dd>
          <dt>Miembro desde</dt><dd>{{ detail.since }}</dd>
        </dl>
        <ol v-else class="tl">
          <li><span>Inició sesión</span><small>{{ detail.last }}</small></li>
          <li><span>Exportó el informe de septiembre</span><small>3 oct 2026</small></li>
          <li><span>Editó el panel de Ventas</span><small>1 oct 2026</small></li>
        </ol>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
/* Tokens: ver pestaña HTML + CSS */
[hidden]{display:none!important}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ico{flex:none;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.app{display:grid;grid-template-columns:220px minmax(0,1fr);min-height:calc(100vh - 40px);overflow:hidden;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:grid-template-columns .16s}
.app.rail{grid-template-columns:64px minmax(0,1fr)}
.side{display:flex;flex-direction:column;gap:18px;padding:16px 10px;background:var(--surface);border-right:1px solid var(--border);overflow:hidden}
.brand{display:flex;align-items:center;gap:10px;padding:0 6px;font-weight:700;font-size:16px;white-space:nowrap}
.logo{flex:none;width:26px;height:26px;border-radius:min(var(--radius),7px);background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff))}
.side ul{display:grid;gap:2px;margin:0;padding:0;list-style:none}
.side a{position:relative;display:flex;align-items:center;gap:10px;height:36px;padding:0 10px;border-radius:min(var(--radius),6px);color:var(--muted);font-weight:500;text-decoration:none;white-space:nowrap;transition:background .14s,color .14s}
.side a:hover{background:var(--bg);color:var(--text)}
.side a[aria-current=page]{background:var(--accent-soft);color:var(--accent)}
.side a[aria-current=page]::before{content:"";position:absolute;left:-10px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--accent)}
.rail .brand{justify-content:center;padding:0}
.rail .side a{justify-content:center;padding:0}
.rail .brand-t,.rail .lbl{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.main{display:flex;flex-direction:column;min-width:0}
.top{display:flex;align-items:center;gap:12px;padding:10px 24px;background:var(--surface);border-bottom:1px solid var(--border)}
.search{position:relative;flex:1;min-width:0;max-width:420px}
.search .ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted)}
.search input{width:100%;height:36px;padding:0 12px 0 34px;font:inherit;color:inherit;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.end{margin-left:auto;display:flex;align-items:center;gap:12px}
.iconbtn{flex:none;display:grid;place-items:center;width:34px;height:34px;padding:0;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer}
.iconbtn:hover{color:var(--text);border-color:var(--accent)}
.iconbtn:disabled{opacity:.4;cursor:default;border-color:var(--border);color:var(--muted)}
.avatar{flex:none;width:34px;height:34px;padding:0;border:0;border-radius:999px;background:var(--accent-soft);color:var(--accent);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.content{display:grid;grid-template-columns:minmax(0,1fr);align-content:start;gap:16px;padding:22px 24px}
.head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px}
h1{margin:0;font-size:22px;line-height:1.25}
h1:focus{outline:none}
.head p{margin:2px 0 0;color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;font:inherit;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer}
.btn:hover{filter:brightness(.93)}
.btn.ghost{color:var(--text);background:var(--surface);border-color:var(--border);font-weight:500}
.btn.ghost:hover{border-color:var(--accent)}
.btn.ghost.danger{color:var(--err)}
.btn.ghost.danger:hover{border-color:var(--err);background:var(--err-soft)}
.btn.solid-err{background:var(--err);border-color:var(--err)}
.filters{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}
.rolesel{display:flex;align-items:center;gap:8px;color:var(--muted)}
.field{height:34px;padding:0 10px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{height:30px;padding:0 12px;font:inherit;font-size:13px;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer}
.chip:hover{color:var(--text)}
.chip[aria-pressed=true]{color:var(--accent);background:var(--accent-soft);border-color:var(--accent)}
.chip .n{margin-left:4px;font-variant-numeric:tabular-nums;opacity:.75}
.msg{min-height:20px;margin:0;font-size:13px;color:var(--muted)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.bulk{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;min-height:50px;padding:8px 14px;background:var(--accent-soft);border-bottom:1px solid var(--border);border-radius:var(--radius) var(--radius) 0 0}
.count{min-width:26px;padding:1px 8px;text-align:center;font-weight:600;color:var(--accent-ink);background:var(--accent);border-radius:999px;font-variant-numeric:tabular-nums}
.bulk-acts,.confirm{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-left:auto}
.scroll{overflow-x:auto}
table{width:100%;min-width:640px;border-collapse:collapse}
th,td{padding:10px 12px;text-align:left;vertical-align:middle;border-bottom:1px solid var(--border)}
th{font-size:13px;font-weight:600;color:var(--muted)}
tbody tr:last-child>*{border-bottom:0}
tbody tr:hover{background:var(--bg)}
tbody tr.on{background:var(--accent-soft)}
.c-sel{width:44px;padding-right:0}
.c-act{width:56px;text-align:right;position:relative}
input[type=checkbox]{width:16px;height:16px;margin:0;accent-color:var(--accent);cursor:pointer}
.who{display:flex;align-items:center;gap:10px;min-width:0}
.av{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
.name{display:block;padding:0;border:0;background:none;font:inherit;font-weight:600;color:var(--text);text-align:left;cursor:pointer}
.name:hover{color:var(--accent);text-decoration:underline}
.mail{display:block;font-size:13px;font-weight:400;color:var(--muted)}
.role{display:inline-block;padding:1px 9px;font-size:12px;font-weight:600;border:1px solid var(--border);border-radius:999px}
.st{display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
.st::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--muted)}
.st.activo::before{background:var(--ok)}
.st.invitado::before{background:var(--warn)}
.st.suspendido::before{background:var(--err)}
.last{color:var(--muted);white-space:nowrap}
.more{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;color:var(--muted);background:none;border:1px solid transparent;border-radius:var(--radius);cursor:pointer}
.more:hover,.more[aria-expanded=true]{color:var(--text);background:var(--bg);border-color:var(--border)}
.menu{position:absolute;right:10px;top:100%;z-index:2;display:grid;min-width:180px;padding:6px;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.menu button{padding:7px 10px;font:inherit;font-size:13px;color:var(--text);background:none;border:0;border-radius:min(var(--radius),6px);text-align:left;cursor:pointer}
.menu button:hover{background:var(--accent-soft);color:var(--accent)}
.empty{margin:0;padding:28px 16px;text-align:center;color:var(--muted)}
.link{padding:0;font:inherit;color:var(--accent);background:none;border:0;text-decoration:underline;cursor:pointer}
.pager{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;font-size:13px;color:var(--muted);border-top:1px solid var(--border)}
.pg{display:flex;align-items:center;gap:8px}
dialog.drawer{position:fixed;inset:0 0 0 auto;width:min(400px,100%);height:100%;max-width:100%;max-height:none;margin:0;padding:0;color:var(--text);background:var(--surface);border:0;border-left:1px solid var(--border);box-shadow:var(--shadow)}
dialog.drawer[open]{display:flex;flex-direction:column}
dialog.drawer::backdrop{background:rgba(8,12,22,.45)}
.dhead{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--border)}
.dhead>div{flex:1;min-width:0}
.dhead h2{margin:0;font-size:17px;overflow-wrap:anywhere}
.dhead p{margin:0;font-size:13px;color:var(--muted);overflow-wrap:anywhere}
.tabs{display:flex;gap:4px;padding:0 12px;border-bottom:1px solid var(--border)}
.tab{margin-bottom:-1px;padding:10px 12px;font:inherit;font-weight:600;color:var(--muted);background:none;border:0;border-bottom:2px solid transparent;cursor:pointer}
.tab[aria-selected=true]{color:var(--accent);border-bottom-color:var(--accent)}
.dbody{flex:1;overflow:auto;padding:18px 20px}
.facts{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px 18px;margin:0}
.facts dt{color:var(--muted)}
.facts dd{margin:0;overflow-wrap:anywhere}
.tl{display:grid;gap:12px;margin:0;padding:0;list-style:none}
.tl li{display:grid;gap:2px;padding-left:14px;border-left:2px solid var(--border)}
.tl small{color:var(--muted)}
@media (max-width:859px){
  .top,.content{padding-left:16px;padding-right:16px}
  .top{flex-wrap:wrap;gap:8px}
  .search{order:1;flex-basis:100%;max-width:none}
  .scroll{overflow:visible}
  table{display:block;min-width:0}
  thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  tbody{display:grid;gap:10px;padding:10px}
  tbody tr{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px 12px;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
  tbody tr.on{background:var(--accent-soft)}
  tbody tr>*{padding:0;border:0}
  tbody tr:hover{background:var(--surface)}
  tbody tr.on:hover{background:var(--accent-soft)}
  .c-sel{grid-column:1;grid-row:1;align-self:start;width:auto;padding:2px 0 0}
  tbody th{grid-column:2;grid-row:1;min-width:0}
  .mail{overflow-wrap:anywhere}
  .c-act{grid-column:3;grid-row:1;width:auto}
  .rest{grid-column:2 / 4;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px}
  .rest::before{content:attr(data-label);color:var(--muted)}
  .menu{right:0}
  .pager{justify-content:center}
}
@media (max-width:520px){
  .app,.app.rail{grid-template-columns:minmax(0,1fr)}
  .app.rail .side{flex-direction:row;align-items:center;gap:8px;padding:8px 10px;border-right:0;border-bottom:1px solid var(--border);overflow-x:auto}
  .app.rail .brand{padding:0}
  .app.rail .side ul{display:flex;gap:2px}
  .app.rail .side a{width:38px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
