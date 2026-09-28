import { HttpError, errorBody, log } from '../lib/http.js';
import { MailerError } from '../services/mailer.js';

export function notFound(_req, res) {
  res.status(404).json(errorBody('not_found', 'Ruta no encontrada'));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json(errorBody(err.code, err.message, err.details));
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json(errorBody('payload_too_large', 'Peticion demasiado grande'));
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(errorBody('invalid_json', 'JSON invalido'));
  }
  if (err instanceof MailerError) {
    log('ERROR', 'resend_error', { site: req.site?.id, provider: err.providerError });
    return res.status(502).json(errorBody('provider_error', 'No se pudo enviar el correo, intenta mas tarde'));
  }
  log('ERROR', 'unhandled_error', { error: err.message, stack: err.stack });
  res.status(500).json(errorBody('internal_error', 'Error interno'));
}
