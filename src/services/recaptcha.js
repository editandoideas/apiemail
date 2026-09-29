const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Score minimo para reCAPTCHA v3 (0 = bot, 1 = humano). v2 invisible no devuelve score.
const MIN_SCORE = 0.5;

// Verifica el token de Google reCAPTCHA (v2 invisible o v3). Devuelve true/false; nunca lanza.
export async function verifyRecaptcha({ secret, token, remoteIp }) {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const json = await res.json();
    if (json.success !== true) return false;
    return typeof json.score === 'number' ? json.score >= MIN_SCORE : true;
  } catch {
    return false;
  }
}
