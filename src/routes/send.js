import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { HttpError, errorBody, log } from '../lib/http.js';
import { TEMPLATES } from '../templates/index.js';
import { renderAcuse } from '../templates/marcas/index.js';

const envelopeSchema = z.object({
  template: z.string().min(1).max(40),
  locale: z.enum(['es', 'en']).optional(),
  data: z.record(z.string(), z.unknown()),
  turnstileToken: z.string().max(2048).optional(),
  recaptchaToken: z.string().max(4096).optional(),
  // Honeypot: campo oculto en el formulario. Si un bot lo llena, se simula el envio.
  website: z.string().max(500).optional(),
});

const rateLimited = errorBody('rate_limited', 'Demasiadas peticiones, intenta mas tarde');

export function sendRouter({ registry, mailer, verifyTurnstile, verifyRecaptcha, env }) {
  const router = Router();

  // Por IP solo para keys publicas: la secret la usa un backend que concentra a todos sus usuarios.
  const ipLimiter = rateLimit({
    windowMs: 60_000,
    limit: env.rateLimitIpPerMinute,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.keyKind === 'secret',
    message: rateLimited,
  });

  // Tope por sitio: limita el dano si una key se filtra.
  const siteLimiter = rateLimit({
    windowMs: 60 * 60_000,
    limit: env.rateLimitSitePerHour,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (req) => `site:${req.site.id}`,
    message: rateLimited,
  });

  router.post('/send', authenticate(registry), ipLimiter, siteLimiter, async (req, res) => {
    const { site, keyKind } = req;

    const envelope = envelopeSchema.safeParse(req.body);
    if (!envelope.success) {
      throw new HttpError(400, 'invalid_request', 'Peticion invalida', z.flattenError(envelope.error).fieldErrors);
    }
    const { template: templateId, locale, data, turnstileToken, recaptchaToken, website } = envelope.data;

    const template = Object.hasOwn(TEMPLATES, templateId) ? TEMPLATES[templateId] : undefined;
    if (!template || !site.templates.includes(templateId)) {
      throw new HttpError(404, 'unknown_template', `Tipo de correo "${templateId}" no disponible para este sitio`);
    }
    if (template.access === 'secret' && keyKind !== 'secret') {
      throw new HttpError(403, 'template_requires_secret_key', 'Este tipo de correo requiere la secret key');
    }

    if (website) {
      log('WARNING', 'honeypot_triggered', { site: site.id, ip: req.ip });
      return res.status(202).json({ id: null, status: 'accepted' });
    }

    if (keyKind === 'public' && site.turnstileSecret) {
      const ok = await verifyTurnstile({ secret: site.turnstileSecret, token: turnstileToken, remoteIp: req.ip });
      if (!ok) throw new HttpError(403, 'captcha_failed', 'Verificacion anti-spam fallida');
    }
    if (keyKind === 'public' && site.recaptchaSecret) {
      const ok = await verifyRecaptcha({ secret: site.recaptchaSecret, token: recaptchaToken, remoteIp: req.ip });
      if (!ok) throw new HttpError(403, 'captcha_failed', 'Verificacion anti-spam fallida');
    }

    const parsed = template.schema.safeParse(data);
    if (!parsed.success) {
      throw new HttpError(422, 'invalid_data', 'Datos invalidos', z.flattenError(parsed.error));
    }

    const message = template.render(site, parsed.data, locale ?? site.defaultLocale);
    const idempotencyKey = req.get('idempotency-key')?.slice(0, 200);

    const { id } = await mailer.send(
      {
        from: site.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(message.replyTo && { replyTo: message.replyTo }),
        tags: [
          { name: 'site', value: site.id },
          { name: 'template', value: templateId },
        ],
      },
      { idempotencyKey: idempotencyKey && `${site.id}:${idempotencyKey}` },
    );

    log('INFO', 'email_sent', { site: site.id, template: templateId, keyKind, resendId: id });

    // Acuse de recibo para el visitante. Va después del correo al sitio y no lo
    // condiciona: si falla, la solicitud ya llegó y la respuesta sigue siendo 202.
    if (templateId === 'contact' && site.autoReply) {
      try {
        const acuse = renderAcuse(site.brand, parsed.data, locale ?? site.defaultLocale);
        const { id: acuseId } = await mailer.send(
          {
            from: site.from,
            to: [parsed.data.email],
            subject: acuse.subject,
            html: acuse.html,
            text: acuse.text,
            replyTo: acuse.replyTo,
            tags: [
              { name: 'site', value: site.id },
              { name: 'template', value: 'acuse' },
            ],
          },
          { idempotencyKey: idempotencyKey && `${site.id}:${idempotencyKey}:acuse` },
        );
        log('INFO', 'autoreply_sent', { site: site.id, resendId: acuseId });
      } catch (err) {
        log('WARNING', 'autoreply_failed', { site: site.id, error: err.message });
      }
    }

    res.status(202).json({ id, status: 'accepted' });
  });

  return router;
}
