<script setup lang="ts">
import { computed, ref } from 'vue';

type Role = 'Administrador' | 'Editor' | 'Lector';
type Invite = { email: string; role: Role; when: string };

const MAX = 10, MEMBERS = 4;
const HINT: Record<Role, string> = {
  Administrador: 'Gestiona miembros, facturación y ajustes.',
  Editor: 'Crea y edita proyectos. No ve la facturación.',
  Lector: 'Solo consulta proyectos y comentarios.',
};
const roles = Object.keys(HINT) as Role[];
const props = withDefaults(defineProps<{ initial?: Invite[]; onInvite?: (i: Invite) => Promise<void> }>(), {
  initial: () => [
    { email: 'carlos.mendoza@norte.cloud', role: 'Editor', when: 'hace 2 días' },
    { email: 'valeria.rios@norte.cloud', role: 'Lector', when: 'hace 5 días' },
    { email: 'andres.paz@norte.cloud', role: 'Administrador', when: 'hoy' },
  ],
});
const pending = ref<Invite[]>([...props.initial]);
const email = ref('');
const role = ref<Role>('Editor');
const msg = ref({ text: '', ok: false });
const sent = ref<string | null>(null);
const field = ref<HTMLInputElement | null>(null);
const used = computed(() => MEMBERS + pending.value.length);

async function submit(e: Event) {
  const v = email.value.trim().toLowerCase();
  const m = !(e.target as HTMLFormElement).checkValidity() ? 'Escribe un correo válido, por ejemplo nombre@empresa.com.'
    : pending.value.some((p) => p.email === v) ? `${v} ya tiene una invitación pendiente. Usa Reenviar en la lista.`
    : used.value >= MAX ? `Alcanzaste el límite de ${MAX} puestos. Cancela una invitación o amplía tu plan.` : '';
  if (m) { msg.value = { text: m, ok: false }; return; }
  const inv: Invite = { email: v, role: role.value, when: 'ahora' };
  await props.onInvite?.(inv);
  pending.value.unshift(inv); email.value = ''; msg.value = { text: `Invitación enviada a ${v}.`, ok: true };
}
function cancel(p: Invite) {
  pending.value = pending.value.filter((x) => x !== p);
  msg.value = { text: `Invitación a ${p.email} cancelada.`, ok: false }; field.value?.focus();
}
function resend(p: Invite) {
  msg.value = { text: `Invitación reenviada a ${p.email}.`, ok: true };
  sent.value = p.email; setTimeout(() => (sent.value = null), 1600);
}
</script>

<template>
  <main class="card">
    <section aria-labelledby="t">
      <h1 id="t">Invitar al equipo</h1>
      <p class="sub">Los miembros nuevos reciben un correo con un enlace válido por 7 días.</p>
      <div class="seats"><span>{{ used }} de {{ MAX }} puestos ocupados</span></div>
      <div class="meter" role="meter" aria-label="Puestos ocupados" aria-valuemin="0" :aria-valuemax="MAX" :aria-valuenow="used">
        <i :style="{ width: `${(used / MAX) * 100}%` }" />
      </div>
      <form novalidate @submit.prevent="submit">
        <div class="f"><label for="email">Correo electrónico</label>
          <input id="email" ref="field" v-model="email" type="email" autocomplete="off" placeholder="nombre@empresa.com" required
                 :aria-invalid="(!!msg.text && !msg.ok) || undefined" aria-describedby="msg"></div>
        <div class="f role"><label for="role">Rol</label>
          <select id="role" v-model="role" aria-describedby="rh"><option v-for="r in roles" :key="r">{{ r }}</option></select></div>
        <button class="btn primary" type="submit">Enviar invitación</button>
        <p id="rh" class="hint">{{ HINT[role] }}</p>
        <p id="msg" class="msg" :class="{ ok: msg.ok }" role="status" aria-live="polite">{{ msg.text }}</p>
      </form>
    </section>
    <section aria-labelledby="p">
      <h2 id="p">Invitaciones pendientes <span class="count">{{ pending.length }}</span></h2>
      <ul>
        <li v-for="p in pending" :key="p.email" class="row">
          <span class="av" aria-hidden="true">{{ p.email[0].toUpperCase() }}</span>
          <div class="who"><strong>{{ p.email }}</strong><span>{{ p.role }}, enviada {{ p.when }}</span></div>
          <div class="acts">
            <button class="btn sm" type="button" :aria-label="`Reenviar invitación a ${p.email}`" @click="resend(p)">{{ sent === p.email ? 'Reenviada' : 'Reenviar' }}</button>
            <button class="btn sm danger" type="button" :aria-label="`Cancelar invitación a ${p.email}`" @click="cancel(p)">Cancelar</button>
          </div>
        </li>
      </ul>
      <p v-if="!pending.length" class="empty">No hay invitaciones pendientes. Escribe un correo arriba para sumar a tu equipo.</p>
    </section>
  </main>
</template>

<style scoped>
.card{max-width:620px;margin:0 auto;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
section{padding:20px}
section+section{border-top:1px solid var(--border)}
h1{margin:0;font-size:18px;line-height:1.3}
h2{display:flex;align-items:center;gap:8px;margin:0 0 12px;font-size:15px}
.sub{margin:4px 0 16px;color:var(--muted)}
.seats{display:flex;justify-content:space-between;margin-bottom:6px;color:var(--muted);font-variant-numeric:tabular-nums}
.meter{height:4px;margin-bottom:20px;border-radius:999px;background:var(--border);overflow:hidden}
.meter i{display:block;height:100%;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .14s}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
form{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px}
.f{flex:1 1 200px}
.f.role{flex:0 1 160px}
label{display:block;margin-bottom:6px;font-weight:600}
input,select{box-sizing:border-box;width:100%;height:40px;padding:0 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input:focus-visible,select:focus-visible{border-color:var(--accent)}
input[aria-invalid=true]{border-color:var(--err)}
.hint,.msg{flex-basis:100%;margin:0;font-size:13px;color:var(--muted)}
.msg{color:var(--err)}
.msg.ok{color:var(--text)}
.msg:empty{display:none}
.btn{font:inherit;font-weight:600;height:40px;padding:0 16px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn.primary{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.btn.primary:hover{background:var(--accent);filter:brightness(1.08)}
.btn.sm{height:32px;padding:0 12px}
.btn.danger{color:var(--err)}
.btn.danger:hover{background:var(--err-soft);border-color:var(--err)}
.count{padding:0 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-variant-numeric:tabular-nums}
ul{margin:0;padding:0;list-style:none}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--border)}
.row:first-child{border-top:0;padding-top:0}
.av{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:600}
.who{flex:1 1 180px;min-width:0}
.who strong,.who span{display:block;overflow-wrap:anywhere}
.who span{color:var(--muted)}
.acts{display:flex;gap:6px}
.empty{margin:0;padding:16px;border:1px dashed var(--border);border-radius:var(--radius);color:var(--muted);text-align:center}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
