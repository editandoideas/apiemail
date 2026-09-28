import { Resend } from 'resend';

export class MailerError extends Error {
  constructor(cause) {
    super(cause?.message ?? 'Error del proveedor de correo');
    this.name = 'MailerError';
    this.providerError = cause;
  }
}

export function createResendMailer(apiKey) {
  const resend = new Resend(apiKey);
  return {
    async send(message, { idempotencyKey } = {}) {
      const { data, error } = await resend.emails.send(message, idempotencyKey ? { idempotencyKey } : undefined);
      if (error) throw new MailerError(error);
      return { id: data.id };
    },
  };
}
