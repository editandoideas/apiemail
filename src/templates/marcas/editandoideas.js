import { escapeHtml } from '../escape.js';

// Correos de marca del formulario de editandoideas.com:
//  - acuse(): el que recibe quien llena el formulario. Es de marketing: agradece y lleva
//    de vuelta al sitio (páginas y artículos elegidos según el tipo de solicitud).
//  - aviso(): el que recibe el equipo comercial en tania@editandoideas.com.
//
// Identidad: skill editando-ideas-marca del repo del sitio. Tinta #08090B, amarillo
// #FFD21A solo como relleno (o como texto sobre tinta), acento #8A6200 como texto sobre
// claro. Títulos Helvetica Neue/Arial Bold, cuerpo Nunito/Arial, eyebrows en mono. Los
// textos salen de las páginas publicadas (meta description, navegación y blog): si allá
// cambian, se cambian aquí. Nada de cifras ni promesas que el sitio no publique.
//
// El acuse tiene contenido fijo: del visitante solo se usan su nombre de pila ya filtrado
// y `tema`, que únicamente elige una lista de TEMAS y nunca se repite. Su mensaje no
// aparece. El aviso sí lleva todo lo que escribió, siempre escapado.

const SITIO = 'https://www.editandoideas.com';
const UTM = 'utm_source=acuse&utm_medium=email&utm_campaign=formulario-contacto';
const url = (ruta, contenido) => `${SITIO}${ruta}?${UTM}&utm_content=${contenido}`;
const img = (archivo) => `${SITIO}/img/${archivo}`;

const C = {
  tinta: '#08090B',
  tintaSup: '#12151A',
  texto: '#14161A',
  secundario: '#4A5058',
  tenue: '#6B7280',
  acento: '#8A6200',
  lineaAcento: '#B38600',
  fondo: '#FAFAF7',
  blanco: '#FFFFFF',
  papel: '#F3F2ED',
  borde: '#E2E0D8',
  amarillo: '#FFD21A',
  claro: '#F7F7F5',
  claroSec: '#C7CBD1',
};

const DISPLAY = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SANS = "Nunito,Arial,'Helvetica Neue',Helvetica,sans-serif";
const MONO = "'JetBrains Mono',Consolas,'Courier New',monospace";

const CONTACTO = {
  correo: 'tania@editandoideas.com',
  whatsapp: '+52 55 1017 9354',
  whatsappHref: 'https://wa.me/5215510179354',
  linkedin: 'https://www.linkedin.com/company/editandoideas',
  instagram: 'https://www.instagram.com/editando_ideas',
  facebook: 'https://www.facebook.com/editandoideas',
};

// Páginas del sitio, con la ruta de cada idioma (app/route-map.ts) y el texto de su
// meta description o de la navegación.
const PAGINAS = {
  calculadora: {
    es: ['/calculadora', 'Calculadora de proyecto', 'Arma tu proyecto pieza por pieza y obtén el pago único, la mensualidad y lo que necesita para funcionar.', 'Armar mi estimación'],
    en: ['/en/calculator', 'Project calculator', 'Build your project piece by piece and get the one-time payment, the monthly fee, and what it needs to work.', 'Build my estimate'],
  },
  portafolio: {
    es: ['/portafolio-sitios-web', 'Portafolio de sitios web', 'Sitios construidos por Editando Ideas, por industria, en escritorio y en móvil.', 'Ver el portafolio'],
    en: ['/en/website-portfolio', 'Website portfolio', 'Websites built by Editando Ideas, grouped by industry, on desktop and mobile.', 'See the portfolio'],
  },
  casos: {
    es: ['/casos', 'Casos en producción', 'Plataformas de aprendizaje, gestión de expedientes, evaluaciones, ERP y comercio electrónico.', 'Ver los casos'],
    en: ['/en/case-studies', 'Systems in production', 'Learning platforms, records management, assessments, custom ERP, and ecommerce.', 'See the cases'],
  },
  auditoria: {
    es: ['/consultoria/auditoria-tecnica', 'Auditoría técnica', 'Antes de decidir qué hacer con un sistema, conviene saber en qué estado está.', 'Conocer la auditoría'],
    en: ['/en/consulting/technical-audit', 'Technical audit', 'Before deciding what to do with a system, you need to know what state it is in.', 'About the audit'],
  },
  estrategia: {
    es: ['/consultoria/estrategia-tecnologica', 'Estrategia tecnológica', 'Diagnóstico, arquitectura y hoja de ruta para decidir con criterio técnico.', 'Ver la estrategia'],
    en: ['/en/consulting/technology-strategy', 'Technology strategy', 'Diagnosis, architecture, and a roadmap to decide with technical judgment.', 'See the strategy'],
  },
  talento: {
    es: ['/talento', 'Talento tecnológico', 'Especialistas AEM, React, Flutter, cloud y QA que se integran a tu equipo.', 'Ver modalidades'],
    en: ['/en/talent', 'Technology talent', 'AEM, React, Flutter, cloud, and QA specialists who embed into your team.', 'See the models'],
  },
  nearshoring: {
    es: ['/nearshoring', 'Nearshoring desde México', 'Solape horario real, mismo idioma y criterio técnico verificable.', 'Cómo trabajamos'],
    en: ['/en/nearshoring', 'Nearshoring from Mexico', 'Real time-zone overlap, shared language, verifiable technical judgment.', 'How we work'],
  },
  nosotros: {
    es: ['/nosotros', 'Quiénes somos', 'Doce años de trayectoria, sistemas en producción y clientes activos desde 2016.', 'Conocernos'],
    en: ['/en/about', 'About us', 'Twelve years of work, systems in production, and clients still active since 2016.', 'Meet us'],
  },
  soluciones: {
    es: ['/soluciones', 'Soluciones', 'Sitios, plataformas, apps Flutter, cloud y Adobe Experience Manager.', 'Ver soluciones'],
    en: ['/en/solutions', 'Solutions', 'Websites, platforms, Flutter apps, cloud, and Adobe Experience Manager.', 'See solutions'],
  },
};

// Entradas del blog (app/route-map.ts BLOG_POSTS y locales/*/blog.ts) con su portada OG.
const ARTICULOS = {
  auditoria: {
    img: 'blog-auditoria-tecnica-og.jpg',
    es: ['/blog/que-incluye-una-auditoria-tecnica', 'Qué incluye una auditoría técnica y qué entrega al final.'],
    en: ['/en/blog/what-a-technical-audit-includes', 'What a technical audit includes, and what it delivers.'],
  },
  excel: {
    img: 'blog-excel-sistema-og.jpg',
    es: ['/blog/senales-de-que-excel-ya-no-debe-ser-tu-sistema', 'Señales de que Excel ya no debe ser el sistema de tu operación.'],
    en: ['/en/blog/signs-a-spreadsheet-should-no-longer-run-your-operation', 'Signs a spreadsheet should no longer run your operation.'],
  },
  microservicios: {
    img: 'blog-monolito-microservicios-og.jpg',
    es: ['/blog/monolito-o-microservicios-cuando-conviene-separar', 'Monolito o microservicios: cuándo sí conviene separar.'],
    en: ['/en/blog/monolith-or-microservices-when-to-split', 'Monolith or microservices: when splitting actually pays off.'],
  },
  aem: {
    img: 'blog-migracion-aem-og.jpg',
    es: ['/blog/que-revisar-antes-de-migrar-aem-6-5-a-cloud-service', 'Qué revisar antes de migrar un proyecto de AEM 6.5 a AEM as a Cloud Service.'],
    en: ['/en/blog/what-to-check-before-migrating-aem-6-5-to-cloud-service', 'What to check before migrating an AEM 6.5 project to AEM as a Cloud Service.'],
  },
  reconstruccion: {
    img: 'blog-reconstruccion-sitio-og.jpg',
    es: ['/blog/como-reconstruimos-editandoideas-com', 'Cómo reconstruimos editandoideas.com: estático, bilingüe y sin scripts en línea.'],
    en: ['/en/blog/how-we-rebuilt-editandoideas-com', 'How we rebuilt editandoideas.com: static, bilingual, and with no inline scripts.'],
  },
};

// Qué se recomienda según el tipo de solicitud que eligió en el formulario (`fields.tema`).
const TEMAS = {
  project: { paginas: ['calculadora', 'portafolio', 'casos'], articulos: ['excel', 'reconstruccion'] },
  consulting: { paginas: ['auditoria', 'estrategia', 'casos'], articulos: ['auditoria', 'microservicios'] },
  talent: { paginas: ['talento', 'nearshoring', 'nosotros'], articulos: ['aem', 'microservicios'] },
};
const TEMA_GENERAL = { paginas: ['soluciones', 'calculadora', 'portafolio'], articulos: ['excel', 'auditoria'] };

export const ETIQUETA_TEMA = {
  project: 'Tengo un proyecto',
  consulting: 'Necesito definir el problema',
  talent: 'Necesito capacidad técnica',
};

const T = {
  es: {
    lang: 'es',
    asunto: 'Recibimos tu mensaje · Editando Ideas',
    preheader: 'Ya está con quien va a responderte. Mientras tanto, esto te puede servir.',
    eyebrow: 'Mensaje recibido',
    saludo: (n) => (n ? `Gracias, ${n}.` : 'Gracias por escribirnos.'),
    titular: 'Tu mensaje ya está con quien va a responderte.',
    intro: 'Lo leemos con calma antes de proponer nada y te contestamos al correo que nos dejaste. Atendemos de lunes a viernes, de 9:00 a 18:00, hora de Ciudad de México (UTC−6).',
    fotoAlt: 'Equipo revisando reportes y gráficas sobre una mesa',
    mientras: 'Mientras tanto',
    mientrasTitulo: 'Adelanta la conversación',
    mientrasTexto: 'Elegimos estas páginas según lo que nos contaste. Llegar con esto revisado hace más útil la primera llamada.',
    blogEyebrow: 'Del blog',
    blogTitulo: 'Lo que aprendemos construyendo software, por escrito',
    leer: 'Leer el artículo',
    blogTodo: 'Ver todos los artículos',
    blog: '/blog',
    rector: 'Diseñamos, construimos y sostenemos lo que tu negocio necesita en digital.',
    whatsappTexto: '¿Prefieres hablarlo ya? Escríbenos por WhatsApp.',
    whatsappBoton: 'Abrir WhatsApp',
    pie: 'Recibes este correo porque llenaste el formulario de contacto en editandoideas.com. Si no fuiste tú, ignóralo: no volveremos a escribirte. Para cualquier duda, responde a este correo.',
    privacidad: ['/privacidad', 'Aviso de privacidad'],
  },
  en: {
    lang: 'en',
    asunto: 'We got your message · Editando Ideas',
    preheader: 'It is with the person who will reply. Meanwhile, this may help.',
    eyebrow: 'Message received',
    saludo: (n) => (n ? `Thank you, ${n}.` : 'Thank you for writing to us.'),
    titular: 'Your message is with the person who will reply.',
    intro: 'We read it carefully before proposing anything, and we reply to the email address you gave us. We work Monday to Friday, 9:00 to 18:00 Mexico City time (UTC−6).',
    fotoAlt: 'A team reviewing reports and charts on a table',
    mientras: 'Meanwhile',
    mientrasTitulo: 'Get a head start',
    mientrasTexto: 'We picked these pages based on what you told us. Coming in with them reviewed makes the first call more useful.',
    blogEyebrow: 'From the blog',
    blogTitulo: 'What we learn building software, in writing',
    leer: 'Read the article',
    blogTodo: 'See all articles',
    blog: '/en/blog',
    rector: 'We design, build and maintain what your business needs in digital.',
    whatsappTexto: 'Rather talk now? Message us on WhatsApp.',
    whatsappBoton: 'Open WhatsApp',
    pie: 'You are receiving this email because you filled in the contact form on editandoideas.com. If it was not you, ignore it: we will not write again. For any question, reply to this email.',
    privacidad: ['/en/privacy', 'Privacy notice'],
  },
};

const eyebrow = (texto, color, filete) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
  `<td style="width:24px;border-top:2px solid ${filete};font-size:0;line-height:0">&nbsp;</td>` +
  `<td style="padding-left:10px;font-family:${MONO};font-size:11px;line-height:14px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:${color}">${texto}</td>` +
  `</tr></table>`;

const boton = (href, texto, { fondo, color, borde }) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
  `<td bgcolor="${fondo}" style="border-radius:999px;background:${fondo};${borde ? `border:1px solid ${borde};` : ''}">` +
  `<a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:15px;line-height:18px;font-weight:700;color:${color};text-decoration:none;border-radius:999px;white-space:nowrap">${texto}</a>` +
  `</td></tr></table>`;

// Logotipo textual del sitio: isotipo + «Editando Ideas» con «Ideas» en amarillo (sobre tinta).
const marcaOscura = (alto) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
  `<td valign="middle" style="padding-right:10px"><img src="${SITIO}/brand/isotipo-192.png" width="${alto}" height="${alto}" alt="" style="display:block;border:0"></td>` +
  `<td valign="middle" style="font-family:${DISPLAY};font-size:${Math.round(alto * 0.5)}px;line-height:1;font-weight:700;letter-spacing:-0.3px;color:${C.claro}">Editando <span style="color:${C.amarillo}">Ideas</span></td>` +
  `</tr></table>`;

const CABECERA_HTML = (lang, titulo, preheader) => `<!doctype html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${titulo}</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; }
  a { color:${C.acento}; }
  @media (max-width:620px) {
    .contenedor { width:100% !important; }
    .pad { padding-left:24px !important; padding-right:24px !important; }
    .col { display:block !important; width:100% !important; padding:0 0 12px !important; }
    .titular { font-size:30px !important; line-height:34px !important; }
    .izq { text-align:left !important; padding-top:14px !important; }
    .etq { display:block !important; width:auto !important; padding-bottom:0 !important; }
    .val { display:block !important; border-top:0 !important; padding-top:3px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.papel}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.papel}" style="background:${C.papel}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="contenedor" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px">`;

const CIERRE_HTML = `
</table>
</td></tr>
</table>
</body>
</html>`;

export function acuse({ nombre, tema, locale }) {
  const t = T[locale === 'en' ? 'en' : 'es'];
  const lang = t.lang;
  const plan = Object.hasOwn(TEMAS, tema ?? '') ? TEMAS[tema] : TEMA_GENERAL;
  const saludo = t.saludo(nombre);

  const paginas = plan.paginas.map((id) => {
    const [ruta, titulo, texto, accion] = PAGINAS[id][lang];
    return { href: url(ruta, id), titulo, texto, accion };
  });
  const articulos = plan.articulos.map((id) => {
    const [ruta, titulo] = ARTICULOS[id][lang];
    return { href: url(ruta, `blog-${id}`), titulo, img: img(ARTICULOS[id].img) };
  });

  const tarjetasPaginas = paginas
    .map(
      (p, i) =>
        `<tr><td style="padding:${i ? '12px' : '0'} 0 0">` +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
        `<td bgcolor="${C.blanco}" style="background:${C.blanco};border:1px solid ${C.borde};border-left:4px solid ${C.amarillo};border-radius:12px;padding:18px 20px">` +
        `<a href="${p.href}" style="text-decoration:none">` +
        `<div style="font-family:${DISPLAY};font-size:18px;line-height:23px;font-weight:700;color:${C.texto}">${p.titulo}</div>` +
        `<div style="font-family:${SANS};font-size:14px;line-height:21px;color:${C.secundario};padding-top:4px">${p.texto}</div>` +
        `<div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:700;color:${C.acento};padding-top:10px">${p.accion}&nbsp;→</div>` +
        `</a></td></tr></table></td></tr>`,
    )
    .join('');

  const tarjetasArticulos = articulos
    .map(
      (a) =>
        `<td class="col" width="50%" valign="top" style="padding:0 8px">` +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.blanco}" style="background:${C.blanco};border:1px solid ${C.borde};border-radius:12px">` +
        `<tr><td style="font-size:0;line-height:0"><a href="${a.href}"><img src="${a.img}" width="254" alt="" style="display:block;width:100%;height:auto;border:0;border-radius:12px 12px 0 0"></a></td></tr>` +
        `<tr><td style="padding:16px 18px 18px">` +
        `<a href="${a.href}" style="text-decoration:none"><div style="font-family:${DISPLAY};font-size:16px;line-height:21px;font-weight:700;color:${C.texto}">${a.titulo}</div>` +
        `<div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:700;color:${C.acento};padding-top:10px">${t.leer}&nbsp;→</div></a>` +
        `</td></tr></table></td>`,
    )
    .join('');

  const html = `${CABECERA_HTML(lang, escapeHtml(t.asunto), t.preheader)}

  <!-- Isla oscura: marca + titular -->
  <tr><td class="pad" bgcolor="${C.tinta}" style="background:${C.tinta};padding:34px 44px 40px;border-radius:18px 18px 0 0">
    ${marcaOscura(40)}
    <div style="height:40px;line-height:40px;font-size:0">&nbsp;</div>
    ${eyebrow(t.eyebrow, C.amarillo, C.amarillo)}
    <h1 class="titular" style="margin:14px 0 0;font-family:${DISPLAY};font-size:36px;line-height:40px;font-weight:700;letter-spacing:-0.9px;color:${C.claro}">${escapeHtml(saludo)}<br>${t.titular}</h1>
    <p style="margin:16px 0 0;font-family:${SANS};font-size:16px;line-height:25px;color:${C.claroSec}">${t.intro}</p>
  </td></tr>

  <!-- Foto de trabajo (Pexels 3184292, fauxels; public/img/IMAGE-CREDITS.md) -->
  <tr><td style="font-size:0;line-height:0">
    <img src="${img('reportes-mesa-1024.jpg')}" width="600" height="338" alt="${t.fotoAlt}" style="display:block;width:100%;max-width:600px;height:auto;border:0">
  </td></tr>

  <!-- Páginas recomendadas -->
  <tr><td class="pad" bgcolor="${C.fondo}" style="background:${C.fondo};padding:40px 44px 36px">
    ${eyebrow(t.mientras, C.acento, C.lineaAcento)}
    <h2 style="margin:12px 0 8px;font-family:${DISPLAY};font-size:26px;line-height:31px;font-weight:700;letter-spacing:-0.6px;color:${C.texto}">${t.mientrasTitulo}</h2>
    <p style="margin:0 0 22px;font-family:${SANS};font-size:15px;line-height:23px;color:${C.secundario}">${t.mientrasTexto}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tarjetasPaginas}</table>
  </td></tr>

  <!-- Del blog -->
  <tr><td class="pad" bgcolor="${C.papel}" style="background:${C.papel};padding:38px 36px 34px">
    <div style="padding:0 8px">${eyebrow(t.blogEyebrow, C.acento, C.lineaAcento)}
    <h2 style="margin:12px 0 22px;font-family:${DISPLAY};font-size:24px;line-height:29px;font-weight:700;letter-spacing:-0.5px;color:${C.texto}">${t.blogTitulo}</h2></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${tarjetasArticulos}</tr></table>
    <div style="padding:22px 8px 0">${boton(url(t.blog, 'blog'), t.blogTodo, { fondo: C.blanco, color: C.texto, borde: C.texto })}</div>
  </td></tr>

  <!-- Banda amarilla: WhatsApp -->
  <tr><td class="pad" bgcolor="${C.amarillo}" style="background:${C.amarillo};padding:26px 44px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" valign="middle" style="font-family:${DISPLAY};font-size:19px;line-height:24px;font-weight:700;color:${C.tinta}">${t.whatsappTexto}</td>
      <td class="col izq" valign="middle" align="right">${boton(CONTACTO.whatsappHref, t.whatsappBoton, { fondo: C.tinta, color: C.claro })}</td>
    </tr></table>
  </td></tr>

  <!-- Pie oscuro -->
  <tr><td class="pad" bgcolor="${C.tinta}" style="background:${C.tinta};padding:32px 44px;border-radius:0 0 18px 18px">
    ${marcaOscura(32)}
    <p style="margin:16px 0 18px;font-family:${DISPLAY};font-size:17px;line-height:23px;font-weight:700;color:${C.claro}">${t.rector}</p>
    <p style="margin:0;font-family:${MONO};font-size:12px;line-height:20px;color:${C.claroSec}">
      <a href="mailto:${CONTACTO.correo}" style="color:${C.claroSec};text-decoration:none">${CONTACTO.correo}</a> · <a href="${CONTACTO.whatsappHref}" style="color:${C.claroSec};text-decoration:none">${CONTACTO.whatsapp}</a><br>
      <a href="${url(lang === 'en' ? '/en' : '/', 'pie')}" style="color:${C.amarillo};text-decoration:none">editandoideas.com</a> · <a href="${CONTACTO.linkedin}" style="color:${C.claroSec};text-decoration:none">LinkedIn</a> · <a href="${CONTACTO.instagram}" style="color:${C.claroSec};text-decoration:none">Instagram</a> · <a href="${CONTACTO.facebook}" style="color:${C.claroSec};text-decoration:none">Facebook</a>
    </p>
  </td></tr>

  <!-- Pie legal -->
  <tr><td class="pad" style="padding:22px 44px 8px;font-family:${SANS};font-size:12px;line-height:18px;color:${C.tenue}">
    ${t.pie} <a href="${SITIO}${t.privacidad[0]}" style="color:${C.tenue}">${t.privacidad[1]}</a>.
  </td></tr>
${CIERRE_HTML}`;

  const text = [
    saludo,
    t.titular,
    '',
    t.intro,
    '',
    t.mientras.toUpperCase(),
    ...paginas.map((p) => `- ${p.titulo}: ${p.texto}\n  ${p.href}`),
    '',
    t.blogEyebrow.toUpperCase(),
    ...articulos.map((a) => `- ${a.titulo}\n  ${a.href}`),
    `${t.blogTodo}: ${url(t.blog, 'blog')}`,
    '',
    `${t.whatsappTexto} ${CONTACTO.whatsappHref}`,
    '',
    '--',
    'Editando Ideas',
    t.rector,
    `${CONTACTO.correo} · ${CONTACTO.whatsapp} · editandoideas.com`,
    '',
    t.pie,
  ].join('\n');

  return { subject: t.asunto, replyTo: CONTACTO.correo, html, text };
}

const fila = ([k, v], i) =>
  `<tr><td class="etq" width="160" valign="top" style="padding:11px 14px;${i ? `border-top:1px solid ${C.borde};` : ''}font-family:${MONO};font-size:11px;line-height:17px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:${C.tenue}">${escapeHtml(k)}</td>` +
  `<td class="val" valign="top" style="padding:11px 14px;${i ? `border-top:1px solid ${C.borde};` : ''}font-family:${SANS};font-size:15px;line-height:21px;color:${C.texto};word-break:break-word">${v}</td></tr>`;

/**
 * Aviso interno para tania@editandoideas.com. Recibe los datos ya validados y las filas
 * etiquetadas que arma templates/contact.js; todo lo del visitante se escapa aquí.
 */
export function aviso({ data, rows, site, conAcuse }) {
  const tema = data.fields?.tema;
  const etiquetaTema = Object.hasOwn(ETIQUETA_TEMA, tema ?? '') ? ETIQUETA_TEMA[tema] : null;
  const enIngles = /^https?:\/\/[^/]+\/en(\/|$)/.test(data.pageUrl ?? '');
  const quien = data.company ? `${data.name} · ${data.company}` : data.name;
  const asuntoRespuesta = encodeURIComponent(enIngles ? 'Re: your message to Editando Ideas' : 'Re: tu mensaje a Editando Ideas');
  const responder = `mailto:${encodeURIComponent(data.email)}?subject=${asuntoRespuesta}`;
  const telefono = data.phone && data.phone.replace(/[^\d+]/g, '');
  const whatsapp = telefono && `https://wa.me/${telefono.replace(/^\+/, '')}`;

  // `tema` llega como id; en el aviso se muestra con su nombre.
  const filas = rows
    .filter(([k]) => k !== 'tema')
    .map(([k, v]) => {
      if (v === data.email) return [k, `<a href="mailto:${escapeHtml(data.email)}" style="color:${C.acento}">${escapeHtml(v)}</a>`];
      if (v === data.phone && telefono) return [k, `<a href="tel:${escapeHtml(telefono)}" style="color:${C.acento}">${escapeHtml(v)}</a>`];
      if (v === data.pageUrl) return [k, `<span style="font-family:${MONO};font-size:12px;color:${C.tenue}">${escapeHtml(v)}</span>`];
      return [k, escapeHtml(v)];
    });
  filas.push(['Idioma', enIngles ? 'Inglés · responder en inglés' : 'Español']);

  const html = `${CABECERA_HTML('es', 'Nuevo mensaje · Editando Ideas', escapeHtml(`${quien} escribió desde ${site.domain}.`))}

  <!-- Isla oscura -->
  <tr><td class="pad" bgcolor="${C.tinta}" style="background:${C.tinta};padding:28px 40px 34px;border-radius:18px 18px 0 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td>${marcaOscura(32)}</td>
      <td align="right" style="font-family:${MONO};font-size:11px;line-height:16px;color:${C.claroSec}">Formulario · ${escapeHtml(site.domain)}</td>
    </tr></table>
    <div style="height:30px;line-height:30px;font-size:0">&nbsp;</div>
    ${eyebrow(etiquetaTema ? `Nuevo mensaje · ${etiquetaTema}` : 'Nuevo mensaje de contacto', C.amarillo, C.amarillo)}
    <h1 class="titular" style="margin:12px 0 0;font-family:${DISPLAY};font-size:32px;line-height:37px;font-weight:700;letter-spacing:-0.8px;color:${C.claro}">${escapeHtml(data.name)}</h1>
    ${data.company ? `<p style="margin:6px 0 0;font-family:${DISPLAY};font-size:19px;line-height:24px;font-weight:700;color:${C.amarillo}">${escapeHtml(data.company)}</p>` : ''}
    <div style="height:24px;line-height:24px;font-size:0">&nbsp;</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="col" style="padding:0 12px 0 0">${boton(escapeHtml(responder), 'Responder', { fondo: C.amarillo, color: C.tinta })}</td>
      ${whatsapp ? `<td class="col" style="padding:0">${boton(escapeHtml(whatsapp), 'Escribir por WhatsApp', { fondo: C.tinta, color: C.claro, borde: C.claroSec })}</td>` : ''}
    </tr></table>
  </td></tr>

  <!-- Mensaje -->
  <tr><td class="pad" bgcolor="${C.fondo}" style="background:${C.fondo};padding:34px 40px 10px">
    ${eyebrow('Mensaje', C.acento, C.lineaAcento)}
    <div style="height:14px;line-height:14px;font-size:0">&nbsp;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="${C.blanco}" style="background:${C.blanco};border:1px solid ${C.borde};border-left:4px solid ${C.amarillo};border-radius:12px;padding:18px 20px;font-family:${SANS};font-size:16px;line-height:25px;color:${C.texto}">${escapeHtml(data.message).replace(/\r?\n/g, '<br>')}</td>
    </tr></table>
  </td></tr>

  <!-- Datos -->
  <tr><td class="pad" bgcolor="${C.fondo}" style="background:${C.fondo};padding:26px 40px 34px">
    ${eyebrow('Datos del contacto', C.acento, C.lineaAcento)}
    <div style="height:14px;line-height:14px;font-size:0">&nbsp;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.blanco}" style="background:${C.blanco};border:1px solid ${C.borde};border-radius:12px">${filas.map(fila).join('')}</table>
  </td></tr>

  <!-- Siguiente paso -->
  <tr><td class="pad" bgcolor="${C.tinta}" style="background:${C.tinta};padding:22px 40px;border-radius:0 0 18px 18px">
    <p style="margin:0;font-family:${SANS};font-size:14px;line-height:21px;color:${C.claroSec}"><strong style="color:${C.claro}">Siguiente paso:</strong> «Responder» le contesta directo a ${escapeHtml(data.email)}.${conAcuse ? ' Ya recibió el acuse de Editando Ideas con páginas y artículos del sitio según lo que pidió.' : ''}</p>
  </td></tr>
${CIERRE_HTML}`;

  const partes = [etiquetaTema, data.company, data.name].filter(Boolean);
  return { subject: `Nuevo mensaje · ${partes.join(' · ')}`, html };
}
