const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);

// Convierte saltos de linea en <br> despues de escapar.
export const escapeMultiline = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');

// Sin saltos de linea: evita inyeccion en asuntos y nombres.
export const singleLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();
