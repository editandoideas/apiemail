import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { TEMPLATES } from '../templates/index.js';

const sha256Hex = z.string().regex(/^[a-f0-9]{64}$/, 'debe ser un hash sha256 en hex');
const origin = z
  .string()
  .regex(/^https?:\/\/[a-z0-9.-]+(:\d+)?$/, 'origin sin ruta ni barra final, p. ej. https://cliente.com');

const siteSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{2,40}$/),
  name: z.string().min(1).max(80),
  domain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/),
  origins: z.array(origin).default([]),
  // Destinatarios fijos del correo de contacto; por defecto contacto@<domain>.
  to: z.array(z.email()).min(1).max(5).optional(),
  // Remitente; requiere el dominio verificado en Resend. Sin el, se usa DEFAULT_FROM_ADDRESS.
  from: z.string().min(3).optional(),
  publicKeyHashes: z.array(sha256Hex).default([]),
  secretKeyHashes: z.array(sha256Hex).default([]),
  templates: z.array(z.enum(Object.keys(TEMPLATES))).min(1).default(['contact']),
  defaultLocale: z.enum(['es', 'en']).default('es'),
  // Nombre de la variable de entorno con el secret de Cloudflare Turnstile del sitio.
  turnstileSecretEnv: z.string().regex(/^[A-Z0-9_]+$/).optional(),
  // Nombre de la variable de entorno con la secret key de Google reCAPTCHA del sitio.
  recaptchaSecretEnv: z.string().regex(/^[A-Z0-9_]+$/).optional(),
  enabled: z.boolean().default(true),
});

const fileSchema = z.object({ sites: z.array(siteSchema) });

/**
 * Carga y valida el registro de sitios. Devuelve:
 *  - sites: Map id -> sitio normalizado
 *  - keys:  Map sha256(key) -> { site, kind: 'public' | 'secret' }
 *  - allowedOrigins: Set con todos los origins (para el preflight CORS)
 */
export function buildRegistry(raw, { defaultFromAddress, env = process.env } = {}) {
  const parsed = fileSchema.parse(raw);
  const sites = new Map();
  const keys = new Map();
  const allowedOrigins = new Set();

  for (const s of parsed.sites) {
    if (sites.has(s.id)) throw new Error(`sites: id duplicado "${s.id}"`);
    const site = {
      ...s,
      to: s.to ?? [`contacto@${s.domain}`],
      from: s.from ?? `${s.name} <${defaultFromAddress}>`,
      turnstileSecret: s.turnstileSecretEnv ? env[s.turnstileSecretEnv] : undefined,
      recaptchaSecret: s.recaptchaSecretEnv ? env[s.recaptchaSecretEnv] : undefined,
    };
    for (const [name, value] of [[s.turnstileSecretEnv, site.turnstileSecret], [s.recaptchaSecretEnv, site.recaptchaSecret]]) {
      if (name && !value) throw new Error(`sites: falta la variable ${name} para "${s.id}"`);
    }
    sites.set(site.id, site);
    if (!site.enabled) continue;

    for (const [kind, hashes] of [['public', s.publicKeyHashes], ['secret', s.secretKeyHashes]]) {
      for (const hash of hashes) {
        if (keys.has(hash)) throw new Error(`sites: hash de key repetido en "${s.id}"`);
        keys.set(hash, { site, kind });
      }
    }
    for (const o of site.origins) allowedOrigins.add(o);
  }

  return { sites, keys, allowedOrigins };
}

export function loadRegistry(env) {
  const raw = env.sitesJson ? JSON.parse(env.sitesJson) : JSON.parse(readFileSync(env.sitesFile, 'utf8'));
  return buildRegistry(raw, { defaultFromAddress: env.defaultFromAddress });
}
