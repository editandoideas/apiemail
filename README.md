# editandoideas-apiemail

API de envío de correos para los sitios de clientes de Editando Ideas, sobre Resend.
Dominio: `https://apiemail.editandoideas.com`. Stack: Node 22+ · Express 5 · Resend · Zod.

Sitios iniciales: `modulax.mx` y `editandoideas.com` ([config/sites.json](config/sites.json)).

## Comandos

```bash
cp .env.example .env        # poner RESEND_API_KEY
npm install
npm run dev                 # http://localhost:8080 (recarga al guardar)
npm test                    # vitest + supertest (Resend simulado)
npm run key:new -- public   # o secret: genera key + hash
```

## Modelo de seguridad

El sitio de origen **se deduce de la API key**, no de un parámetro de la petición.
Cada sitio tiene dos tipos de key:

| Key | Dónde vive | Qué puede hacer |
| --- | --- | --- |
| `pk_live_…` (pública) | JavaScript del sitio (es visible para cualquiera) | Solo tipos `access: public` (hoy `contact`). El **destinatario es fijo** (`contacto@<dominio>` o `to` del sitio). Exige `Origin` registrado. |
| `sk_live_…` (secreta) | Backend del cliente | Cualquier tipo habilitado, incluido `notification` con destinatarios libres. Se rechaza si llega con `Origin` (señal de que se filtró al navegador). |

Por qué no basta con «API key + CORS»:

- Una key en el frontend es pública. Por eso la key pública nunca decide el destinatario. Aunque se filtre, no sirve como relay de spam: solo puede escribir al buzón de contacto del propio sitio.
- CORS solo lo respetan los navegadores; `curl` lo ignora. Aquí el `Origin` además se valida en el servidor contra el sitio de la key. Eso frena el uso de la key desde otros sitios web, aunque un script sí puede falsificar `Origin`.
- Contra bots: honeypot `website` (responde 202 sin enviar), rate limit por IP (5/min) y por sitio (100/h), y **captcha opcional por sitio** (Cloudflare Turnstile o Google reCAPTCHA) (recomendado en cuanto llegue spam).
- En `sites.json` solo se guardan hashes SHA-256 de las keys. Las keys en claro se entregan al sitio y no se versionan (`keys.local.md` está en `.gitignore`).
- Otras protecciones: HTML escapado, sin saltos de línea en nombre y asunto, cuerpo máximo de 300 KB y helmet. Los logs no guardan contenido ni correos de visitantes.

**Acuse de recibo (`autoReply`).** Es la única excepción a «la key pública no decide el destinatario»: si un sitio declara `brand: "<id>"` y `autoReply: true`, tras el correo de contacto se envía un acuse de marca a la dirección que dejó el visitante. Para que no sirva de relay:

- `brand` sola solo cambia la identidad del aviso que llega al buzón del sitio.
- El registro no arranca si el sitio tiene `autoReply` sin `brand` o sin captcha (`recaptchaSecretEnv` o `turnstileSecretEnv`).
- El contenido es fijo (`src/templates/marcas/<id>.js`). Del visitante solo se usa el nombre de pila, filtrado a letras (máx. 30); su mensaje nunca se repite.
- Si el acuse falla, la petición sigue respondiendo 202: el correo al sitio ya salió. Se registra `autoreply_failed`.
- Lleva su propia `Idempotency-Key` (`<sitio>:<key>:acuse`) y `replyTo` al buzón del sitio.

El rate limit es en memoria, por instancia. Con Cloud Run y varias instancias el tope real se multiplica. Si hace falta uno global, se mueve a Redis o Firestore.

## API

`POST /v1/send`

Cabeceras: `X-Api-Key: <key>` o `Authorization: Bearer <key>`; opcional `Idempotency-Key` (evita duplicados si el cliente reintenta).

```json
{
  "template": "contact",
  "locale": "es",
  "data": {
    "name": "Ana Pérez",
    "email": "ana@example.com",
    "phone": "+52 55 1234 5678",
    "company": "Acme",
    "subject": "Cotización",
    "message": "Hola, quiero información…",
    "fields": { "Servicio": "Naves industriales" },
    "pageUrl": "https://modulax.mx/contacto"
  },
  "turnstileToken": "…",
  "recaptchaToken": "…",
  "website": ""
}
```

Respuestas: `202 { id, status: "accepted" }` · `400 invalid_request` · `401 missing_api_key|invalid_api_key` · `403 origin_not_allowed|secret_key_in_browser|template_requires_secret_key|captcha_failed` · `404 unknown_template` · `422 invalid_data` · `429 rate_limited` · `502 provider_error`.

`notification` (solo secret key): `data = { to: [..], subject, html?, text?, replyTo? }`.

### Ejemplo desde el sitio

```js
await fetch('https://apiemail.editandoideas.com/v1/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': import.meta.env.VITE_APIEMAIL_KEY },
  body: JSON.stringify({ template: 'contact', data: { name, email, message }, website: honeypot }),
});
```

El sitio que llama debe permitir el dominio en su CSP: `connect-src https://apiemail.editandoideas.com`.

## Alta de un sitio nuevo

1. `npm run key:new -- public` (y `secret` si tiene backend).
2. Agregar el sitio a `config/sites.json` con `id`, `name`, `domain`, `origins` y los hashes. Si no se indica `to`, se envía a `contacto@<domain>`.
3. Remitente: sin `from` se usa `"<name> <DEFAULT_FROM_ADDRESS>"`. Si el dominio del cliente está verificado en Resend, se puede poner `"from": "Cliente <no-reply@cliente.com>"`, que mejora la entregabilidad.
4. Captcha (opcional, solo aplica a la public key). Primero se define la variable en el hosting y después se agrega el campo al sitio: si el campo existe y la variable no, la app no arranca.
   - Turnstile: `"turnstileSecretEnv": "TURNSTILE_SECRET_CLIENTE"`; el sitio manda `turnstileToken`.
   - Google reCAPTCHA (v2 invisible o v3): `"recaptchaSecretEnv": "RECAPTCHA_SECRET_CLIENTE"`; el sitio manda `recaptchaToken`. En v3 se exige score ≥ 0.5.
5. Para agregar un tipo de correo nuevo: crear el módulo en `src/templates/` con `{ schema, render }`, registrarlo en `src/templates/index.js` y habilitarlo en `templates` del sitio.

## Despliegue (pendiente)

Hay un `Dockerfile` pensado para Cloud Run, igual que `editando-apiadmin`. Falta:

- ~~Verificar dominios en Resend~~: `editandoideas.com` y `modulax.mx` ya verificados. Cada sitio envía desde `no-reply@<su dominio>` y `DEFAULT_FROM_ADDRESS` es `no-reply@editandoideas.com`.
- `RESEND_API_KEY` en Secret Manager. Opcional: `SITES_JSON` como secret para no reconstruir la imagen al dar de alta sitios.
- Mapear el dominio `apiemail.editandoideas.com` al servicio (CNAME a `ghs.googlehosted.com`).
