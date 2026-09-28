import { HttpError } from '../lib/http.js';
import { hashKey } from '../lib/keys.js';

function readKey(req) {
  const auth = req.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
  return req.get('x-api-key')?.trim();
}

/**
 * Identifica el sitio a partir de la key (nunca de un parametro de la peticion).
 *  - public key (pk_): va en el navegador, asi que es publica. Se exige que el Origin
 *    coincida con los origins del sitio. CORS solo protege navegadores; esta validacion
 *    corre en el servidor.
 *  - secret key (sk_): solo servidor a servidor. Si llega con Origin es que alguien la
 *    puso en el frontend, y se rechaza.
 */
export function authenticate(registry) {
  return (req, _res, next) => {
    const key = readKey(req);
    if (!key) throw new HttpError(401, 'missing_api_key', 'Falta la API key');

    const match = registry.keys.get(hashKey(key));
    if (!match) throw new HttpError(401, 'invalid_api_key', 'API key invalida');

    const origin = req.get('origin');
    if (match.kind === 'public' && (!origin || !match.site.origins.includes(origin))) {
      throw new HttpError(403, 'origin_not_allowed', 'Origen no autorizado para esta key');
    }
    if (match.kind === 'secret' && origin) {
      throw new HttpError(403, 'secret_key_in_browser', 'La secret key no se debe usar desde el navegador');
    }

    req.site = match.site;
    req.keyKind = match.kind;
    next();
  };
}
