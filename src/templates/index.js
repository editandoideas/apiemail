import * as contact from './contact.js';
import * as notification from './notification.js';

/**
 * Tipos de correo. `access` define que key puede usarlo:
 *  - public: la key del navegador (y tambien la secret).
 *  - secret: solo desde el backend del cliente.
 * Para agregar un tipo: crear el modulo con { schema, render } y registrarlo aqui.
 */
export const TEMPLATES = {
  contact: { access: 'public', ...contact },
  notification: { access: 'secret', ...notification },
};
