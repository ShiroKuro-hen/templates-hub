<script setup lang="ts">
import { ref } from 'vue';

type Field = HTMLInputElement | HTMLSelectElement;
const methods = [['card', 'Tarjeta'], ['paypal', 'PayPal'], ['bizum', 'Bizum']] as const;
const method = ref('card');
const status = ref<{ ok: boolean; text: string } | null>(null);

function submit(e: Event) {
  const bad = ([...(e.currentTarget as HTMLFormElement).elements] as Field[]).filter((el) => el.willValidate && !el.checkValidity());
  bad.forEach((el) => { el.style.borderColor = 'var(--err)'; });
  bad[0]?.focus();
  status.value = bad.length
    ? { ok: false, text: `Revisa ${bad.length} campo${bad.length > 1 ? 's' : ''} marcado${bad.length > 1 ? 's' : ''} en rojo para completar el pago.` }
    : { ok: true, text: 'Pedido confirmado. Te hemos enviado el recibo por correo.' };
}
function clear(e: Event) { const el = e.target as Field; if (el.checkValidity()) el.style.borderColor = ''; }
</script>

<template>
  <form class="checkout" novalidate @submit.prevent="submit" @input="clear">
    <div class="card">
      <fieldset>
        <legend>Contacto</legend>
        <label>Correo electrónico<input type="email" name="email" autocomplete="email" required>
          <span class="hint">Te enviaremos aquí la confirmación del pedido.</span></label>
      </fieldset>
      <fieldset>
        <legend>Dirección de envío</legend>
        <div class="grid">
          <label>Nombre completo<input name="name" autocomplete="name" required></label>
          <label>Teléfono<input type="tel" name="tel" autocomplete="tel" required></label>
          <label style="grid-column:1/-1">Dirección<input name="address" autocomplete="street-address" required></label>
          <label>Código postal<input name="zip" autocomplete="postal-code" inputmode="numeric" pattern="\d{5}" required>
            <span class="hint">5 dígitos, por ejemplo 28013.</span></label>
          <label>Provincia<select name="region" autocomplete="address-level1">
            <option>Madrid</option><option>Barcelona</option><option>Valencia</option><option>Sevilla</option></select></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Método de pago</legend>
        <div class="methods">
          <label v-for="[v, label] in methods" :key="v" class="method">
            <input v-model="method" type="radio" name="method" :value="v"> {{ label }}
          </label>
        </div>
      </fieldset>
      <fieldset :disabled="method !== 'card'">
        <legend>Datos de la tarjeta</legend>
        <div class="grid">
          <label style="grid-column:1/-1">Número de tarjeta<input name="cc" autocomplete="cc-number" inputmode="numeric" pattern="[\d ]{15,19}" required>
            <span class="hint">Entre 15 y 16 dígitos, sin guiones.</span></label>
          <label>Caducidad<input name="exp" autocomplete="cc-exp" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])\/\d{2}" required></label>
          <label>CVC<input name="cvc" autocomplete="cc-csc" inputmode="numeric" pattern="\d{3,4}" required></label>
        </div>
      </fieldset>
    </div>
    <aside class="card summary" aria-labelledby="sum-title">
      <h2 id="sum-title">Resumen</h2>
      <dl>
        <dt>Subtotal (3 artículos)</dt><dd>182,90 €</dd>
        <dt>Envío estándar</dt><dd>4,95 €</dd>
        <dt>IVA incluido</dt><dd>31,74 €</dd>
        <dt class="total">Total</dt><dd class="total">187,85 €</dd>
      </dl>
      <button class="pay" type="submit">Pagar 187,85 €</button>
      <p class="note">Pago cifrado. Puedes cancelar el pedido durante 24 horas.</p>
      <p v-if="status" :class="['status', { err: !status.ok }]" role="status">{{ status.text }}</p>
    </aside>
  </form>
</template>

<style scoped>
.checkout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start;max-width:1000px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
@media (max-width:720px){.checkout{grid-template-columns:1fr}}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px}
fieldset{border:0;margin:0 0 20px;padding:0;min-width:0}
fieldset:disabled{display:none}
legend{font-size:16px;font-weight:600;margin-bottom:12px;padding:0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
label{display:block;font-weight:500}
input,select{box-sizing:border-box;width:100%;margin-top:4px;padding:8px 10px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s}
input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
input:user-invalid{border-color:var(--err)}
.hint{display:block;font-size:12px;color:var(--muted);font-weight:400;margin-top:4px}
input:user-invalid + .hint{color:var(--err)}
.methods{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
.method{display:flex;gap:8px;align-items:center;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,border-color .14s}
.method input{width:auto;margin:0;accent-color:var(--accent)}
.method:has(:checked){border-color:var(--accent);background:var(--accent-soft)}
.summary{position:sticky;top:20px;overflow:hidden}
.summary::before{content:"";display:block;height:3px;margin:-20px -20px 16px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.summary h2{font-size:16px;margin:0 0 12px}
dl{margin:0;display:grid;grid-template-columns:1fr auto;gap:8px 12px}
dt{color:var(--muted)} dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
.total{font-size:16px;font-weight:600;color:var(--text);padding-top:12px;border-top:1px solid var(--border)}
.pay{width:100%;margin-top:16px;padding:10px 14px;font:inherit;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer}
.pay:hover{filter:brightness(1.08)}
.note{font-size:12px;color:var(--muted);margin:8px 0 0}
.status{margin:12px 0 0;padding:8px 12px;border-radius:var(--radius);background:var(--ok-soft);color:var(--ok)}
.status.err{background:var(--err-soft);color:var(--err)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
