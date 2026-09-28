import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { buildRegistry } from '../src/config/sites.js';
import { loadEnv } from '../src/config/env.js';
import { hashKey } from '../src/lib/keys.js';
import { MailerError } from '../src/services/mailer.js';

const PK = 'pk_live_test_modulax';
const SK = 'sk_live_test_modulax';
const PK_TURNSTILE = 'pk_live_test_turnstile';
const ORIGIN = 'https://modulax.mx';

const contactData = { name: 'Ana', email: 'ana@example.com', message: 'Hola\n<b>quiero</b> info' };

function setup({ ipLimit = 100 } = {}) {
  const registry = buildRegistry(
    {
      sites: [
        {
          id: 'modulax',
          name: 'Modulax',
          domain: 'modulax.mx',
          origins: [ORIGIN],
          publicKeyHashes: [hashKey(PK)],
          secretKeyHashes: [hashKey(SK)],
          templates: ['contact', 'notification'],
        },
        {
          id: 'protegido',
          name: 'Protegido',
          domain: 'protegido.com',
          origins: ['https://protegido.com'],
          to: ['ventas@protegido.com'],
          publicKeyHashes: [hashKey(PK_TURNSTILE)],
          turnstileSecretEnv: 'TURNSTILE_SECRET_TEST',
        },
      ],
    },
    { defaultFromAddress: 'no-reply@editandoideas.com', env: { TURNSTILE_SECRET_TEST: 'x' } },
  );
  const mailer = { send: vi.fn().mockResolvedValue({ id: 're_123' }) };
  const verifyTurnstile = vi.fn().mockResolvedValue(true);
  const env = { ...loadEnv({}), trustProxy: 0, rateLimitIpPerMinute: ipLimit };
  return { app: createApp({ registry, mailer, verifyTurnstile, env }), mailer, verifyTurnstile };
}

let ctx;
beforeEach(() => {
  ctx = setup();
});

const post = (app, body, { key = PK, origin = ORIGIN } = {}) => {
  const req = request(app).post('/v1/send');
  if (key) req.set('X-Api-Key', key);
  if (origin) req.set('Origin', origin);
  return req.send(body);
};

describe('POST /v1/send — contacto con public key', () => {
  it('envia a contacto@dominio, con replyTo del visitante y HTML escapado', async () => {
    const res = await post(ctx.app, { template: 'contact', data: contactData });
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ id: 're_123', status: 'accepted' });

    const [msg] = ctx.mailer.send.mock.calls[0];
    expect(msg.to).toEqual(['contacto@modulax.mx']);
    expect(msg.from).toBe('Modulax <no-reply@editandoideas.com>');
    expect(msg.replyTo).toBe('ana@example.com');
    expect(msg.html).toContain('&lt;b&gt;quiero&lt;/b&gt;');
    expect(msg.html).not.toContain('<b>quiero</b>');
    expect(msg.tags).toContainEqual({ name: 'site', value: 'modulax' });
  });

  it('ignora un "to" enviado en la peticion', async () => {
    await post(ctx.app, { template: 'contact', data: { ...contactData, to: ['victima@x.com'] } });
    expect(ctx.mailer.send.mock.calls[0][0].to).toEqual(['contacto@modulax.mx']);
  });

  it('usa los destinatarios configurados del sitio', async () => {
    await post(ctx.app, { template: 'contact', data: contactData, turnstileToken: 't' }, {
      key: PK_TURNSTILE,
      origin: 'https://protegido.com',
    });
    expect(ctx.mailer.send.mock.calls[0][0].to).toEqual(['ventas@protegido.com']);
  });

  it('rechaza sin key, con key invalida y con origin ajeno', async () => {
    expect((await post(ctx.app, { template: 'contact', data: contactData }, { key: null })).status).toBe(401);
    expect((await post(ctx.app, { template: 'contact', data: contactData }, { key: 'pk_x' })).status).toBe(401);
    const foreign = await post(ctx.app, { template: 'contact', data: contactData }, { origin: 'https://evil.com' });
    expect(foreign.status).toBe(403);
    expect(foreign.body.error.code).toBe('origin_not_allowed');
    const noOrigin = await post(ctx.app, { template: 'contact', data: contactData }, { origin: null });
    expect(noOrigin.status).toBe(403);
    expect(ctx.mailer.send).not.toHaveBeenCalled();
  });

  it('valida datos (422) y rechaza saltos de linea en nombre', async () => {
    const res = await post(ctx.app, { template: 'contact', data: { ...contactData, name: 'A\nBcc: x@y.com' } });
    expect(res.status).toBe(422);
    const bad = await post(ctx.app, { template: 'contact', data: { name: 'A', email: 'no', message: 'x' } });
    expect(bad.status).toBe(422);
  });

  it('honeypot: responde 202 sin enviar', async () => {
    const res = await post(ctx.app, { template: 'contact', data: contactData, website: 'http://spam' });
    expect(res.status).toBe(202);
    expect(ctx.mailer.send).not.toHaveBeenCalled();
  });

  it('no permite la plantilla notification con public key', async () => {
    const res = await post(ctx.app, {
      template: 'notification',
      data: { to: ['x@y.com'], subject: 'hola', text: 'x' },
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('template_requires_secret_key');
  });

  it('plantilla desconocida o no habilitada → 404', async () => {
    expect((await post(ctx.app, { template: 'nope', data: {} })).status).toBe(404);
    expect((await post(ctx.app, { template: '__proto__', data: {} })).status).toBe(404);
  });

  it('usa locale en', async () => {
    await post(ctx.app, { template: 'contact', locale: 'en', data: contactData });
    expect(ctx.mailer.send.mock.calls[0][0].subject).toBe('[Modulax] New contact message from Ana');
  });
});

describe('Turnstile', () => {
  it('rechaza si la verificacion falla', async () => {
    ctx.verifyTurnstile.mockResolvedValueOnce(false);
    const res = await post(ctx.app, { template: 'contact', data: contactData }, {
      key: PK_TURNSTILE,
      origin: 'https://protegido.com',
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('captcha_failed');
  });
});

describe('secret key', () => {
  it('envia notification a destinatarios arbitrarios desde servidor', async () => {
    const res = await post(
      ctx.app,
      { template: 'notification', data: { to: ['cliente@x.com'], subject: 'Pedido', html: '<p>ok</p>' } },
      { key: SK, origin: null },
    );
    expect(res.status).toBe(202);
    expect(ctx.mailer.send.mock.calls[0][0].to).toEqual(['cliente@x.com']);
  });

  it('se rechaza si llega desde un navegador (con Origin)', async () => {
    const res = await post(ctx.app, { template: 'contact', data: contactData }, { key: SK });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('secret_key_in_browser');
  });

  it('acepta Authorization: Bearer y pasa Idempotency-Key con prefijo del sitio', async () => {
    const res = await request(ctx.app)
      .post('/v1/send')
      .set('Authorization', `Bearer ${SK}`)
      .set('Idempotency-Key', 'form-42')
      .send({ template: 'contact', data: contactData });
    expect(res.status).toBe(202);
    expect(ctx.mailer.send.mock.calls[0][1]).toEqual({ idempotencyKey: 'modulax:form-42' });
  });
});

describe('infraestructura', () => {
  it('preflight CORS solo para origins registrados', async () => {
    const ok = await request(ctx.app)
      .options('/v1/send')
      .set('Origin', ORIGIN)
      .set('Access-Control-Request-Method', 'POST');
    expect(ok.headers['access-control-allow-origin']).toBe(ORIGIN);
    const bad = await request(ctx.app)
      .options('/v1/send')
      .set('Origin', 'https://evil.com')
      .set('Access-Control-Request-Method', 'POST');
    expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rate limit por IP para public key', async () => {
    const { app } = setup({ ipLimit: 2 });
    await post(app, { template: 'contact', data: contactData });
    await post(app, { template: 'contact', data: contactData });
    const res = await post(app, { template: 'contact', data: contactData });
    expect(res.status).toBe(429);
  });

  it('error del proveedor → 502 generico', async () => {
    ctx.mailer.send.mockRejectedValueOnce(new MailerError({ message: 'domain not verified' }));
    const res = await post(ctx.app, { template: 'contact', data: contactData });
    expect(res.status).toBe(502);
    expect(res.body.error.message).not.toContain('domain');
  });

  it('JSON invalido → 400 y /health → 200', async () => {
    const res = await request(ctx.app)
      .post('/v1/send')
      .set('X-Api-Key', PK)
      .set('Origin', ORIGIN)
      .set('Content-Type', 'application/json')
      .send('{bad');
    expect(res.status).toBe(400);
    expect((await request(ctx.app).get('/health')).status).toBe(200);
  });
});
