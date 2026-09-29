import { escapeHtml } from '../escape.js';

// Correos de marca del formulario de modulax.mx:
//  - acuse(): el que recibe quien llena el formulario.
//  - aviso(): el que recibe la Dirección Comercial en contacto@modulax.mx.
//
// Identidad: Manual de Marca MODULAX v2.0 (skill formato-modulax). Grafito #1E2227,
// Lima Técnico #C2F23C solo sobre grafito, Lima Ink #7BAF0F como filete sobre claro,
// wordmark MODULA + X lima, cifras siempre con su condición. Los textos repiten los de
// src/data/site.js del sitio: si cambian allá, se cambian aquí.
//
// El acuse tiene contenido fijo a propósito: lo único del visitante que aparece es su
// nombre de pila ya filtrado (ver marcas/index.js). Nada de su mensaje se repite. El
// aviso sí lleva todo lo que escribió, siempre escapado.

const SITIO = 'https://modulax.mx';
const UTM = 'utm_source=acuse&utm_medium=email&utm_campaign=formulario-contacto';
const url = (ruta) => `${SITIO}${ruta}?${UTM}`;

const C = {
  grafito: '#1E2227',
  tinta: '#1B1B1F',
  lima: '#C2F23C',
  limaInk: '#7BAF0F',
  acero: '#9AA3AB',
  hueso: '#FAFBF8',
  huesoTenue: '#F4F5F0',
  grafito700: '#30363D',
  pizarra: '#6B6B73',
  linea: '#DCDED8',
};

const DISPLAY = "'Space Grotesk','Arial Black',Arial,sans-serif";
const SANS = "Inter,Arial,'Helvetica Neue',Helvetica,sans-serif";
const MONO = "'IBM Plex Mono',Consolas,'Courier New',monospace";

const CONTACTO = {
  firma: 'Dirección Comercial',
  telefono: '55 3290 5846',
  telefonoHref: '+525532905846',
  correo: 'contacto@modulax.mx',
  ciudad: 'Ciudad de México',
};

const PASOS = [
  ['01', 'Reunión técnica de 45 minutos', 'Revisamos su calendario, sus regiones críticas y sus tipos de estructura estándar.'],
  ['02', 'Ficha de capacidades', 'Le entregamos la ficha de capacidades de MODULAX en la misma semana.'],
  ['03', 'Alcance y tabulador del piloto', 'Acordados en dos rondas de trabajo, con precios por m² y por servicio.'],
];

// Cifra + condición: el manual prohíbe publicar una sin la otra.
const CIFRAS = [
  ['Nacional', '', 'Cobertura', 'Bajo negociación de tiempos, logística y costos por región.'],
  ['600', 'm²/día', 'Ritmo pico', 'Con condiciones ideales de sitio y baja restricción de seguridad.'],
  ['1,000', 'm² / 8 días', 'Ritmo sostenido', 'Estándar de proyecto según alcance y protocolo del cliente final.'],
];

const SERVICIOS = [
  ['01', 'Montaje de estructura y lona', 'Montamos, tensamos y sellamos conforme a su plano y protocolo.'],
  ['02', 'Luminarias y extractores', 'Colocamos y verificamos los complementos en sitio.'],
  ['03', 'Obra civil complementaria', 'Dados de cimentación, sardinel y rampas conforme al diseño entregado.'],
];

const eyebrow = (texto, color, filete) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
  `<td style="width:24px;border-top:2px solid ${filete};font-size:0;line-height:0">&nbsp;</td>` +
  `<td style="padding-left:10px;font-family:${SANS};font-size:11px;line-height:14px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${color}">${texto}</td>` +
  `</tr></table>`;

const boton = (href, texto, { fondo, color, borde }) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
  `<td bgcolor="${fondo}" style="border-radius:999px;background:${fondo};${borde ? `border:1.5px solid ${borde};` : ''}">` +
  `<a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:15px;line-height:18px;font-weight:700;color:${color};text-decoration:none;border-radius:999px;white-space:nowrap">${texto}</a>` +
  `</td></tr></table>`;

export function acuse({ nombre }) {
  const saludo = nombre ? `Gracias, ${nombre}.` : 'Gracias por escribirnos.';
  const preheader = 'Ya estamos revisando su proyecto. Esto es lo que sigue para su reunión técnica.';

  const pasos = PASOS.map(
    ([n, titulo, cuerpo], i) =>
      `<tr><td style="padding:${i ? '18px' : '0'} 0 0">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
      `<td width="52" valign="top" style="font-family:${DISPLAY};font-size:26px;line-height:28px;font-weight:700;color:${C.grafito}">${n}</td>` +
      `<td valign="top" style="border-left:3px solid ${C.limaInk};padding-left:14px">` +
      `<div style="font-family:${SANS};font-size:16px;line-height:22px;font-weight:700;color:${C.grafito}">${titulo}</div>` +
      `<div style="font-family:${SANS};font-size:14px;line-height:21px;color:${C.pizarra};padding-top:2px">${cuerpo}</div>` +
      `</td></tr></table></td></tr>`,
  ).join('');

  const cifras = CIFRAS.map(
    ([valor, unidad, rotulo, condicion]) =>
      `<td class="col" width="33%" valign="top" style="padding:0 6px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
      `<td bgcolor="${C.tinta}" style="background:${C.tinta};border-top:3px solid ${C.lima};padding:18px 16px">` +
      `<div style="font-family:${DISPLAY};font-size:26px;line-height:30px;font-weight:700;color:${C.lima}">${valor}` +
      (unidad ? `<span style="font-family:${MONO};font-size:12px;font-weight:500;color:${C.hueso}">&nbsp;${unidad}</span>` : '') +
      `</div>` +
      `<div style="font-family:${SANS};font-size:13px;line-height:18px;font-weight:700;color:${C.hueso};padding-top:8px">${rotulo}</div>` +
      `<div style="font-family:${SANS};font-size:12px;line-height:17px;color:${C.acero};padding-top:4px">${condicion}</div>` +
      `</td></tr></table></td>`,
  ).join('');

  const servicios = SERVICIOS.map(
    ([n, titulo, cuerpo]) =>
      `<tr><td style="padding:0 0 14px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
      `<td bgcolor="${C.huesoTenue}" style="background:${C.huesoTenue};border-top:3px solid ${C.limaInk};padding:16px 18px">` +
      `<div style="font-family:${MONO};font-size:12px;line-height:16px;color:${C.pizarra}">Servicio ${n}</div>` +
      `<div style="font-family:${SANS};font-size:16px;line-height:22px;font-weight:700;color:${C.grafito};padding-top:2px">${titulo}</div>` +
      `<div style="font-family:${SANS};font-size:14px;line-height:21px;color:${C.grafito700};padding-top:2px">${cuerpo}</div>` +
      `</td></tr></table></td></tr>`,
  ).join('');

  const html = `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Recibimos su solicitud · MODULAX</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; }
  a { color:${C.grafito}; }
  @media (max-width:620px) {
    .contenedor { width:100% !important; }
    .pad { padding-left:24px !important; padding-right:24px !important; }
    .col { display:block !important; width:100% !important; padding:0 0 12px !important; }
    .titular { font-size:32px !important; line-height:36px !important; }
    .foto { height:auto !important; }
    .izq { text-align:left !important; padding-top:14px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.huesoTenue}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.huesoTenue}" style="background:${C.huesoTenue}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="contenedor" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px">

  <!-- Banda grafito: wordmark + titular -->
  <tr><td class="pad" bgcolor="${C.grafito}" style="background:${C.grafito};padding:36px 44px 40px">
    <div style="font-family:${DISPLAY};font-size:26px;line-height:26px;font-weight:700;letter-spacing:0.5px;color:${C.hueso}">MODULA<span style="color:${C.lima}">X</span></div>
    <div style="height:44px;line-height:44px;font-size:0">&nbsp;</div>
    ${eyebrow('Solicitud recibida', C.acero, C.lima)}
    <h1 class="titular" style="margin:14px 0 0;font-family:${DISPLAY};font-size:38px;line-height:42px;font-weight:700;color:${C.hueso}">${escapeHtml(saludo)}<br><span style="color:${C.lima}">Ya estamos revisando su proyecto.</span></h1>
    <p style="margin:16px 0 0;font-family:${SANS};font-size:16px;line-height:25px;color:${C.acero}">La Dirección Comercial de MODULAX le escribirá para agendar una reunión técnica. Mientras tanto, esto es lo que sigue y lo que ponemos en su obra.</p>
  </td></tr>

  <!-- Foto de obra real -->
  <tr><td style="font-size:0;line-height:0">
    <img class="foto" src="${SITIO}/img/hero-estructura-contraluz.jpg" width="600" alt="Estructura de celosía montada por MODULAX, vista a contraluz" style="display:block;width:100%;max-width:600px;height:auto;border:0">
  </td></tr>

  <!-- Qué sigue -->
  <tr><td class="pad" bgcolor="${C.hueso}" style="background:${C.hueso};padding:40px 44px 36px">
    ${eyebrow('Qué sigue', C.grafito700, C.limaInk)}
    <h2 style="margin:12px 0 22px;font-family:${DISPLAY};font-size:24px;line-height:29px;font-weight:700;color:${C.grafito}">Del primer contacto a la obra, sin fricción</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${pasos}</table>
  </td></tr>

  <!-- Frase de marca -->
  <tr><td class="pad" bgcolor="${C.hueso}" style="background:${C.hueso};padding:0 44px 36px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-left:4px solid ${C.limaInk};padding:6px 0 6px 18px;font-family:${DISPLAY};font-size:22px;line-height:28px;font-weight:700;color:${C.grafito}">Ustedes fabrican.<br>Nosotros ejecutamos.</td>
    </tr></table>
  </td></tr>

  <!-- Cifras con condición -->
  <tr><td class="pad" bgcolor="${C.grafito}" style="background:${C.grafito};padding:38px 38px 32px">
    <div style="padding:0 6px">${eyebrow('Capacidad operativa', C.acero, C.lima)}
    <h2 style="margin:12px 0 22px;font-family:${DISPLAY};font-size:24px;line-height:29px;font-weight:700;color:${C.hueso}">Lo que ejecutamos, y bajo qué condición</h2></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cifras}</tr></table>
  </td></tr>

  <!-- Servicios -->
  <tr><td class="pad" bgcolor="${C.hueso}" style="background:${C.hueso};padding:40px 44px 26px">
    ${eyebrow('Qué hacemos en su obra', C.grafito700, C.limaInk)}
    <h2 style="margin:12px 0 20px;font-family:${DISPLAY};font-size:24px;line-height:29px;font-weight:700;color:${C.grafito}">Un solo interlocutor en sitio</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${servicios}</table>
  </td></tr>

  <!-- Llamado a la acción -->
  <tr><td class="pad" bgcolor="${C.hueso}" style="background:${C.hueso};padding:10px 44px 44px">
    <p style="margin:0 0 18px;font-family:${SANS};font-size:16px;line-height:25px;color:${C.grafito}"><strong>Adelántese a la reunión:</strong> capture las medidas de su nave en el cotizador y vea el montaje en 3D, fase por fase.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" style="padding:0 12px 12px 0">${boton(url('/calculadora'), 'Estimar mi nave', { fondo: C.grafito, color: C.hueso })}</td>
      <td class="col" style="padding:0 0 12px">${boton(url('/alianza'), 'Conocer la alianza', { fondo: C.hueso, color: C.grafito, borde: C.grafito })}</td>
    </tr></table>
  </td></tr>

  <!-- Barra lima de cierre -->
  <tr><td class="pad" bgcolor="${C.lima}" style="background:${C.lima};padding:28px 44px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" valign="middle" style="font-family:${DISPLAY};font-size:20px;line-height:24px;font-weight:700;color:${C.grafito}">ARMA. ESCALA.<br>REUBICA.</td>
      <td class="col izq" valign="middle" align="right" style="font-family:${MONO};font-size:13px;line-height:20px;color:${C.grafito}">
        ${CONTACTO.firma}<br>
        <a href="tel:${CONTACTO.telefonoHref}" style="color:${C.grafito};text-decoration:none">${CONTACTO.telefono}</a> · <a href="mailto:${CONTACTO.correo}" style="color:${C.grafito};text-decoration:none">${CONTACTO.correo}</a><br>
        ${CONTACTO.ciudad} · <a href="${url('/')}" style="color:${C.grafito};text-decoration:none">modulax.mx</a>
      </td>
    </tr></table>
  </td></tr>

  <!-- Pie legal -->
  <tr><td class="pad" style="padding:22px 44px 8px;font-family:${SANS};font-size:12px;line-height:18px;color:${C.pizarra}">
    Recibe este correo porque llenó el formulario de contacto en modulax.mx. Si no fue usted, ignórelo: no volveremos a escribirle. Para cualquier duda, responda a este correo.
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    saludo,
    'Ya estamos revisando su proyecto.',
    '',
    'La Dirección Comercial de MODULAX le escribirá para agendar una reunión técnica.',
    '',
    'QUÉ SIGUE',
    ...PASOS.map(([n, t, c]) => `${n}  ${t}\n    ${c}`),
    '',
    'Ustedes fabrican. Nosotros ejecutamos.',
    '',
    'CAPACIDAD OPERATIVA',
    ...CIFRAS.map(([v, u, r, c]) => `- ${r}: ${v}${u ? ` ${u}` : ''}. ${c}`),
    '',
    'QUÉ HACEMOS EN SU OBRA',
    ...SERVICIOS.map(([n, t, c]) => `- Servicio ${n} · ${t}. ${c}`),
    '',
    `Adelántese a la reunión: estime su nave en ${url('/calculadora')}`,
    '',
    '--',
    'MODULAX · ARMA. ESCALA. REUBICA.',
    CONTACTO.firma,
    `${CONTACTO.telefono} · ${CONTACTO.correo}`,
    `${CONTACTO.ciudad} · modulax.mx`,
    '',
    'Recibe este correo porque llenó el formulario de contacto en modulax.mx. Si no fue usted, ignórelo.',
  ].join('\n');

  return {
    subject: 'Recibimos su solicitud · Su reunión técnica con MODULAX',
    replyTo: CONTACTO.correo,
    html,
    text,
  };
}

const fila = ([k, v], i) =>
  `<tr><td class="etq" width="170" valign="top" style="padding:11px 14px;${i ? `border-top:1px solid ${C.linea};` : ''}font-family:${SANS};font-size:12px;line-height:17px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${C.pizarra}">${escapeHtml(k)}</td>` +
  `<td class="val" valign="top" style="padding:11px 14px;${i ? `border-top:1px solid ${C.linea};` : ''}font-family:${SANS};font-size:15px;line-height:21px;color:${C.grafito};word-break:break-word">${v}</td></tr>`;

/**
 * Aviso interno para contacto@modulax.mx. Recibe los datos ya validados y las filas
 * etiquetadas que arma templates/contact.js; todo lo del visitante se escapa aquí.
 */
export function aviso({ data, rows, site, conAcuse }) {
  const quien = data.company ? `${data.name} · ${data.company}` : data.name;
  const asuntoRespuesta = encodeURIComponent('Su reunión técnica con MODULAX');
  const responder = `mailto:${encodeURIComponent(data.email)}?subject=${asuntoRespuesta}`;
  const telefono = data.phone && data.phone.replace(/[^\d+]/g, '');

  // Valores con enlace donde sirve: correo y teléfono se pulsan desde el móvil.
  const valores = rows.map(([k, v]) => {
    if (v === data.email) return [k, `<a href="mailto:${escapeHtml(data.email)}" style="color:${C.grafito}">${escapeHtml(v)}</a>`];
    if (v === data.phone && telefono) return [k, `<a href="tel:${escapeHtml(telefono)}" style="color:${C.grafito}">${escapeHtml(v)}</a>`];
    if (v === data.pageUrl) return [k, `<span style="font-family:${MONO};font-size:13px;color:${C.pizarra}">${escapeHtml(v)}</span>`];
    return [k, escapeHtml(v)];
  });

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Nueva solicitud · MODULAX</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; }
  @media (max-width:620px) {
    .contenedor { width:100% !important; }
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .col { display:block !important; width:100% !important; padding:0 0 10px !important; }
    .titular { font-size:28px !important; line-height:32px !important; }
    .etq { display:block !important; width:auto !important; padding-bottom:0 !important; }
    .val { display:block !important; border-top:0 !important; padding-top:3px !important; }
    .izq { text-align:left !important; padding-top:6px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.huesoTenue}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(`${quien} pidió una reunión técnica desde ${site.domain}.`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.huesoTenue}" style="background:${C.huesoTenue}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="contenedor" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px">

  <!-- Banda grafito -->
  <tr><td class="pad" bgcolor="${C.grafito}" style="background:${C.grafito};padding:30px 40px 34px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:${DISPLAY};font-size:22px;line-height:22px;font-weight:700;letter-spacing:0.5px;color:${C.hueso}">MODULA<span style="color:${C.lima}">X</span></td>
      <td align="right" style="font-family:${MONO};font-size:12px;line-height:16px;color:${C.acero}">Formulario · ${escapeHtml(site.domain)}</td>
    </tr></table>
    <div style="height:34px;line-height:34px;font-size:0">&nbsp;</div>
    ${eyebrow('Nueva solicitud de reunión técnica', C.acero, C.lima)}
    <h1 class="titular" style="margin:12px 0 0;font-family:${DISPLAY};font-size:32px;line-height:37px;font-weight:700;color:${C.hueso}">${escapeHtml(data.name)}</h1>
    ${data.company ? `<p style="margin:6px 0 0;font-family:${DISPLAY};font-size:20px;line-height:25px;font-weight:700;color:${C.lima}">${escapeHtml(data.company)}</p>` : ''}
    <div style="height:24px;line-height:24px;font-size:0">&nbsp;</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" style="padding:0 12px 0 0">${boton(escapeHtml(responder), 'Responder', { fondo: C.lima, color: C.grafito })}</td>
      ${telefono ? `<td class="col" style="padding:0">${boton(`tel:${escapeHtml(telefono)}`, `Llamar al ${escapeHtml(data.phone)}`, { fondo: C.grafito, color: C.hueso, borde: C.acero })}</td>` : ''}
    </tr></table>
  </td></tr>

  <!-- Datos -->
  <tr><td class="pad" bgcolor="${C.hueso}" style="background:${C.hueso};padding:34px 40px 10px">
    ${eyebrow('Datos del contacto', C.grafito700, C.limaInk)}
    <div style="height:14px;line-height:14px;font-size:0">&nbsp;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.huesoTenue}" style="background:${C.huesoTenue};border-top:3px solid ${C.limaInk}">${valores.map(fila).join('')}</table>
  </td></tr>

  <!-- Mensaje -->
  <tr><td class="pad" bgcolor="${C.hueso}" style="background:${C.hueso};padding:26px 40px 34px">
    ${eyebrow('Mensaje', C.grafito700, C.limaInk)}
    <div style="height:14px;line-height:14px;font-size:0">&nbsp;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-left:4px solid ${C.limaInk};padding:4px 0 4px 18px;font-family:${SANS};font-size:16px;line-height:25px;color:${C.grafito}">${escapeHtml(data.message).replace(/\r?\n/g, '<br>')}</td>
    </tr></table>
  </td></tr>

  <!-- Siguiente paso -->
  <tr><td class="pad" bgcolor="${C.grafito}" style="background:${C.grafito};padding:24px 40px">
    <p style="margin:0;font-family:${SANS};font-size:14px;line-height:21px;color:${C.acero}"><strong style="color:${C.hueso}">Siguiente paso:</strong> responder para agendar la reunión técnica de 45 minutos.${conAcuse ? ` ${escapeHtml(data.name.split(/\s+/)[0])} ya recibió el acuse de MODULAX con la ruta de arranque.` : ''}</p>
  </td></tr>

  <!-- Barra lima -->
  <tr><td class="pad" bgcolor="${C.lima}" style="background:${C.lima};padding:18px 40px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" style="font-family:${DISPLAY};font-size:16px;line-height:20px;font-weight:700;color:${C.grafito}">ARMA. ESCALA. REUBICA.</td>
      <td class="col izq" align="right" style="font-family:${MONO};font-size:12px;line-height:16px;color:${C.grafito}">Responder contesta a ${escapeHtml(data.email)}</td>
    </tr></table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return {
    subject: data.company
      ? `Nueva solicitud · ${data.company} · ${data.name}`
      : `Nueva solicitud · ${data.name}`,
    html,
  };
}
