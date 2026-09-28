const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Verifica el token de Cloudflare Turnstile del formulario. Devuelve true/false; nunca lanza.
export async function verifyTurnstile({ secret, token, remoteIp }) {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const json = await res.json();
    return json.success === true;
  } catch {
    return false;
  }
}
