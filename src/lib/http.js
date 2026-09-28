export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const errorBody = (code, message, details) => ({ error: { code, message, ...(details && { details }) } });

// Log estructurado para Cloud Logging (campo `severity`). Nunca registrar contenido ni correos de visitantes.
export function log(severity, message, fields = {}) {
  const line = JSON.stringify({ severity, message, ...fields });
  if (severity === 'ERROR' || severity === 'WARNING') console.error(line);
  else console.log(line);
}
