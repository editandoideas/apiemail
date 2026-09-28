import { z } from 'zod';
import { singleLine } from './escape.js';

// Correo libre para uso servidor a servidor (solo secret key). El contenido lo arma el backend del cliente.
export const schema = z
  .object({
    to: z.array(z.email()).min(1).max(10),
    subject: z.string().trim().min(1).max(200),
    html: z.string().max(200_000).optional(),
    text: z.string().max(100_000).optional(),
    replyTo: z.email().optional(),
  })
  .refine((d) => d.html || d.text, 'se requiere html o text');

export function render(_site, data) {
  return {
    to: data.to,
    replyTo: data.replyTo,
    subject: singleLine(data.subject),
    html: data.html,
    text: data.text,
  };
}
