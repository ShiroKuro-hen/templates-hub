<script setup lang="ts">
import { computed, ref } from 'vue';

const items = [{ n: 'Auriculares Nimbo Air', d: 'Grafito, cantidad 1', p: 249 }, { n: 'Estuche de viaje', d: 'Cantidad 1', p: 29 }];
const envios = [{ n: 'Estándar', d: 'Llega en 3 a 5 días hábiles', c: 0 }, { n: 'Express', d: 'Llega en 1 a 2 días hábiles', c: 12 }];
const fmt = (n: number) => 'US$ ' + n.toFixed(2).replace('.', ',');
const envio = ref(0), codigo = ref(''), promo = ref(false), aviso = ref(''), cc = ref(''), ex = ref(''), email = ref(''), pagado = ref(false);

const sub = items.reduce((s, i) => s + i.p, 0);
const desc = computed(() => (promo.value ? sub * 0.1 : 0));
const costo = computed(() => envios[envio.value].c);
const imp = computed(() => (sub - desc.value) * 0.18);
const total = computed(() => sub - desc.value + costo.value + imp.value);

function aplicar() {
  promo.value = codigo.value.trim().toUpperCase() === 'NIMBO10';
  aviso.value = promo.value ? 'Código NIMBO10 aplicado: 10 % de descuento.' : 'El código no es válido. Revisa que esté bien escrito.';
}
const fmtCc = () => { cc.value = cc.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); };
const fmtEx = () => { ex.value = ex.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/'); };
</script>

<template>
  <div class="page">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="hp" viewBox="0 0 200 200"><path d="M44 120V98a56 56 0 0 1 112 0v22" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" /><rect x="30" y="104" width="34" height="62" rx="15" fill="currentColor" /><rect x="136" y="104" width="34" height="62" rx="15" fill="currentColor" /></symbol></svg>
    <header class="top">
      <a class="brand" href="#" aria-label="Nimbo, inicio"><i />Nimbo</a>
      <nav aria-label="Pasos de compra"><ol class="steps"><li><a href="#">Carrito</a></li><li aria-current="step">Envío y pago</li><li>Confirmación</li></ol></nav>
    </header>
    <div class="co">
      <form aria-label="Datos de compra" @submit.prevent="pagado = true">
        <fieldset class="box"><legend>Contacto</legend>
          <label class="f">Correo electrónico
            <input v-model="email" type="email" autocomplete="email" placeholder="nombre@empresa.com" required />
            <span class="err">Escribe un correo válido, por ejemplo nombre@empresa.com.</span>
          </label>
        </fieldset>
        <fieldset class="box"><legend>Dirección de envío</legend>
          <div class="row"><label class="f">Nombre<input autocomplete="given-name" required /></label><label class="f">Apellidos<input autocomplete="family-name" required /></label></div>
          <div class="row"><label class="f">Dirección<input autocomplete="street-address" placeholder="Calle y número" required /></label></div>
          <div class="row">
            <label class="f">Ciudad<input autocomplete="address-level2" required /></label>
            <label class="f">País<select autocomplete="country"><option>Perú</option><option>Chile</option><option>Colombia</option><option>México</option></select></label>
            <label class="f">Código postal<input autocomplete="postal-code" inputmode="numeric" required /></label>
          </div>
        </fieldset>
        <fieldset class="box"><legend>Método de envío</legend>
          <label v-for="(o, i) in envios" :key="o.n" class="opt">
            <input v-model="envio" type="radio" name="envio" :value="i" />
            <span>{{ o.n }}<small>{{ o.d }}</small></span><b>{{ o.c ? fmt(o.c) : 'Gratis' }}</b>
          </label>
        </fieldset>
        <fieldset class="box"><legend>Pago con tarjeta</legend>
          <div class="row"><label class="f">Número de tarjeta
            <input v-model="cc" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" pattern="\d{4} \d{4} \d{4} \d{4}" required @input="fmtCc" />
            <span class="err">Escribe los 16 dígitos de tu tarjeta.</span></label></div>
          <div class="row">
            <label class="f">Vence<input v-model="ex" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/\d{2}" required @input="fmtEx" /></label>
            <label class="f">CVC<input inputmode="numeric" autocomplete="cc-csc" maxlength="4" pattern="\d{3,4}" required /></label>
          </div>
        </fieldset>
        <button class="btn pri" type="submit" :disabled="pagado">Pagar {{ fmt(total) }}</button>
        <p class="note">Pago seguro. Tus datos viajan cifrados y no guardamos tu tarjeta.</p>
        <p id="ok" role="status">{{ pagado ? `Pago recibido. Enviamos el recibo a ${email}.` : '' }}</p>
      </form>
      <aside class="box" aria-labelledby="rs">
        <h2 id="rs">Resumen del pedido</h2>
        <div v-for="i in items" :key="i.n" class="it"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#hp" /></svg><div>{{ i.n }}<small>{{ i.d }}</small></div><b>{{ fmt(i.p) }}</b></div>
        <form class="promo" @submit.prevent="aplicar">
          <input v-model="codigo" aria-label="Código de descuento" placeholder="Código de descuento" autocomplete="off" />
          <button class="btn" type="submit">Aplicar</button>
        </form>
        <p id="pm" role="status">{{ aviso }}</p>
        <dl>
          <dt>Subtotal</dt><dd>{{ fmt(sub) }}</dd>
          <dt>Descuento</dt><dd>{{ promo ? '− ' : '' }}{{ fmt(desc) }}</dd>
          <dt>Envío</dt><dd>{{ costo ? fmt(costo) : 'Gratis' }}</dd>
          <dt>Impuestos (18 %)</dt><dd>{{ fmt(imp) }}</dd>
          <dt class="tot">Total</dt><dd class="tot">{{ fmt(total) }}</dd>
        </dl>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page{max-width:1000px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit}
:is(a,button):focus-visible,label:has(input[type=radio]:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;margin-bottom:20px}
.brand{display:inline-flex;align-items:center;gap:8px;font-size:18px;font-weight:700;text-decoration:none}
.brand i{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.steps{display:flex;gap:16px;margin:0;padding:0;list-style:none;color:var(--muted)}
.steps li+li::before{content:"/";margin-right:16px}
.steps [aria-current=step]{color:var(--text);font-weight:600}
.co{display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start}
.box{margin:0 0 16px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
fieldset.box{min-width:0}
legend{float:left;width:100%;margin-bottom:12px;padding:0;font-size:16px;font-weight:600}
legend+*{clear:both}
.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:12px}
.row:last-child{margin:0}
.f{display:grid;gap:4px;font-weight:500}
input:not([type=radio]),select{box-sizing:border-box;width:100%;padding:9px 12px;font:inherit;font-weight:400;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:1px;border-color:var(--accent)}
input:user-invalid{border-color:var(--err)}
.err{display:none;font-weight:400;color:var(--err)}
input:user-invalid~.err{display:block}
.opt{display:flex;align-items:center;gap:12px;margin-bottom:8px;padding:12px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:border-color .14s,background .14s}
.opt:last-child{margin:0}
.opt:has(:checked){border-color:var(--accent);background:var(--accent-soft)}
.opt input{accent-color:var(--accent)}
.opt span{flex:1}.opt small{display:block;color:var(--muted)}
.opt b{font-variant-numeric:tabular-nums}
.btn{padding:10px 16px;font:inherit;font-weight:600;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:filter .14s,border-color .14s}
.btn:hover:not(:disabled){border-color:var(--accent);filter:brightness(.97)}
.btn.pri{width:100%;background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn:disabled{opacity:.6;cursor:default}
.note{margin:8px 0 0;color:var(--muted);font-size:13px;text-align:center}
#ok{margin:12px 0 0;padding:0;color:var(--ok);font-weight:600}
aside{position:sticky;top:20px}
aside h2{margin:0 0 12px;font-size:16px}
.it{display:grid;grid-template-columns:48px 1fr auto;gap:12px;align-items:center;margin-bottom:12px}
.it svg{width:48px;height:48px;padding:6px;box-sizing:border-box;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.it small{display:block;color:var(--muted)}
.promo{display:flex;gap:8px;margin:16px 0 4px}
.promo .btn{flex:none}
#pm{min-height:20px;margin:0 0 8px;font-size:13px;color:var(--muted)}
dl{display:grid;grid-template-columns:1fr auto;gap:6px 12px;margin:0;padding-top:12px;border-top:1px solid var(--border);font-variant-numeric:tabular-nums}
dd{margin:0;text-align:right}dt{color:var(--muted)}
.tot{margin-top:6px;padding-top:12px;border-top:1px solid var(--border);font-size:18px;font-weight:700;color:var(--text)}
@media (max-width:820px){.co{grid-template-columns:1fr}aside{position:static}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
