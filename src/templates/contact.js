import { z } from 'zod';
import { escapeHtml, escapeMultiline, singleLine } from './escape.js';
import { MARCAS } from './marcas/index.js';

const noNewlines = (max) => z.string().trim().min(1).max(max).regex(/^[^\r\n]*$/, 'sin saltos de linea');

export const schema = z.object({
  name: noNewlines(120),
  email: z.email().max(254),
  phone: noNewlines(40).optional(),
  company: noNewlines(120).optional(),
  subject: noNewlines(150).optional(),
  message: z.string().trim().min(1).max(5000),
  // Campos adicionales propios de cada formulario (presupuesto, servicio, etc.).
  fields: z
    .record(noNewlines(60), z.string().trim().max(500))
    .refine((r) => Object.keys(r).length <= 20, 'maximo 20 campos')
    .optional(),
  pageUrl: z.url().max(500).optional(),
});

const LABELS = {
  es: {
    subject: (site, name) => `[${site}] Nuevo mensaje de contacto de ${name}`,
    heading: 'Nuevo mensaje desde el formulario de contacto',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    company: 'Empresa',
    subjectLabel: 'Asunto',
    message: 'Mensaje',
    pageUrl: 'Página',
    footer: (domain) => `Enviado desde ${domain}. Responde a este correo para contestar directamente a quien escribió.`,
  },
  en: {
    subject: (site, name) => `[${site}] New contact message from ${name}`,
    heading: 'New message from the contact form',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    subjectLabel: 'Subject',
    message: 'Message',
    pageUrl: 'Page',
    footer: (domain) => `Sent from ${domain}. Reply to this email to answer the sender directly.`,
  },
};

export function render(site, data, locale) {
  const t = LABELS[locale];
  const rows = [
    [t.name, data.name],
    [t.email, data.email],
    [t.phone, data.phone],
    [t.company, data.company],
    [t.subjectLabel, data.subject],
    ...Object.entries(data.fields ?? {}),
    [t.pageUrl, data.pageUrl],
  ].filter(([, v]) => v);

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td>` +
        `<td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join('');

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">
<h2 style="font-size:18px">${escapeHtml(t.heading)}</h2>
<table cellpadding="0" cellspacing="0">${htmlRows}</table>
<h3 style="font-size:15px;margin-top:20px">${escapeHtml(t.message)}</h3>
<p style="white-space:normal;line-height:1.5">${escapeMultiline(data.message)}</p>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
<p style="font-size:12px;color:#777">${escapeHtml(t.footer(site.domain))}</p>
</body></html>`;

  // Sitio con marca propia: el aviso sale con su identidad. El texto plano es el mismo.
  const marca = site.brand && MARCAS[site.brand].aviso({ data, rows, site, conAcuse: Boolean(site.autoReply) });

  const text = [
    t.heading,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    `${t.message}:`,
    data.message,
    '',
    '--',
    t.footer(site.domain),
  ].join('\n');

  return {
    // El destinatario SIEMPRE sale del registro del sitio, nunca de la peticion.
    to: site.to,
    replyTo: data.email,
    subject: singleLine(
      data.subject ? `[${site.name}] ${data.subject}` : marca ? marca.subject : t.subject(site.name, data.name),
    ),
    html: marca ? marca.html : html,
    text,
  };
}
