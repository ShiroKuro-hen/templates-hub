<script setup lang="ts">
const params = [
  { nombre: 'cliente_id', tipo: 'string', obligatorio: true, texto: 'Identificador del cliente. Empieza por cli_.' },
  { nombre: 'total', tipo: 'integer', obligatorio: true, texto: 'Importe en centavos. Debe ser mayor que 0.' },
  { nombre: 'moneda', tipo: 'string', obligatorio: false, texto: 'Código ISO 4217. Por defecto USD.' },
  { nombre: 'notas', tipo: 'string', obligatorio: false, texto: 'Texto libre de hasta 200 caracteres.' },
];
const respuestas = [
  { codigo: 201, titulo: 'Pedido creado', json: { id: 'ped_9f3k2', cliente_id: 'cli_204', total: 128000, moneda: 'USD', estado: 'pendiente', creado: '2026-10-06T14:32:10Z' } },
  { codigo: 422, titulo: 'Datos no válidos', json: { error: 'datos_no_validos', mensaje: 'El campo total debe ser mayor que 0.', campo: 'total' } },
];
</script>

<template>
  <article class="ep">
    <h1>Crear un pedido</h1>
    <div class="route"><span class="m">POST</span><code>/v1/pedidos</code></div>
    <p>Registra un pedido para un cliente existente. Requiere una clave de API en la cabecera <code>Authorization</code>.</p>

    <h2 id="ph">Parámetros del cuerpo</h2>
    <div class="tw" role="region" aria-labelledby="ph" tabindex="0">
      <table>
        <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Uso</th><th scope="col">Descripción</th></tr></thead>
        <tbody>
          <tr v-for="p in params" :key="p.nombre">
            <th scope="row"><code>{{ p.nombre }}</code></th>
            <td><code>{{ p.tipo }}</code></td>
            <td class="req"><b v-if="p.obligatorio">Obligatorio</b><template v-else>Opcional</template></td>
            <td>{{ p.texto }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Respuestas</h2>
    <details v-for="(r, i) in respuestas" :key="r.codigo" :open="i === 0">
      <summary><span class="st" :class="{ bad: r.codigo >= 400 }">{{ r.codigo }}</span>{{ r.titulo }}</summary>
      <pre><code>{{ JSON.stringify(r.json, null, 2) }}</code></pre>
    </details>
  </article>
</template>

<style scoped>
.ep{max-width:720px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0 0 12px;font-size:22px;line-height:1.2}
h2{margin:24px 0 8px;font-size:15px}
code{font:13px ui-monospace,"Cascadia Code",Menlo,monospace}
.route{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow-x:auto}
.m{flex:none;display:inline-flex;align-items:center;gap:6px;padding:1px 10px;font-weight:600;background:var(--ok-soft);border-radius:999px}
.m::before{content:"";width:8px;height:8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.route code{white-space:nowrap}
p{margin:12px 0 0;color:var(--muted);max-width:64ch}
.tw{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius)}
.tw:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
table{width:100%;min-width:520px;border-collapse:collapse}
th,td{padding:8px 12px;text-align:left;vertical-align:top;border-bottom:1px solid var(--border)}
tbody tr:last-child td,tbody tr:last-child th{border-bottom:0}
thead th{color:var(--muted);font-weight:600;background:var(--bg)}
tbody th{font-weight:400;white-space:nowrap}
td:nth-child(2) code{color:var(--accent)}
.req{color:var(--muted);font-size:12px}
.req b{color:var(--text);font-weight:600}
details{margin-bottom:8px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
summary{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;list-style:none;transition:background .14s}
summary::-webkit-details-marker{display:none}
summary:hover{background:var(--accent-soft)}
summary::after{content:"";margin-left:auto;width:6px;height:6px;border:solid var(--muted);border-width:0 1.5px 1.5px 0;transform:rotate(45deg);transition:transform .14s}
details[open]>summary::after{transform:rotate(-135deg)}
.st{padding:0 8px;font-weight:600;font-variant-numeric:tabular-nums;border-radius:999px;background:var(--ok-soft)}
.st.bad{background:var(--err-soft)}
pre{margin:0;padding:12px 16px;overflow:auto;background:var(--bg);border-top:1px solid var(--border)}
@media (max-width:420px){.ep{padding:16px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
