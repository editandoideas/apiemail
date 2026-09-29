import * as modulax from './modulax.js';

/**
 * Correos con la identidad de un cliente. Un sitio los activa en sites.json:
 *  - `brand: "<id>"`: el aviso de contacto (el que llega al buzón del sitio) sale con la marca.
 *  - `autoReply: true`: además, un acuse de marca para quien llenó el formulario. Exige
 *    `brand` y captcha.
 *
 * El acuse es la única excepción a "la key pública nunca decide el destinatario", así que el
 * contenido es fijo: del visitante sólo se usa el nombre de pila, filtrado por
 * `nombreDePila()`. Nada más de lo que escribió se repite en el acuse.
 */
export const MARCAS = { modulax };

// Primera palabra del nombre, sólo letras (con apóstrofo o guion) y hasta 30 caracteres.
// Cualquier otra cosa —un enlace, un dominio, un texto publicitario— se descarta y el
// acuse saluda sin nombre.
export function nombreDePila(nombre) {
  const primera = String(nombre ?? '').trim().split(/\s+/)[0] ?? '';
  return /^\p{L}[\p{L}'-]{0,29}$/u.test(primera) ? primera : null;
}

export function renderAcuse(id, { name }) {
  return MARCAS[id].acuse({ nombre: nombreDePila(name) });
}
