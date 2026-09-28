// Genera una key nueva y su hash. Uso: npm run key:new -- public|secret
// La key en claro se entrega al sitio del cliente; en config/sites.json solo va el hash.
import { generateKey, hashKey } from '../src/lib/keys.js';

const kind = process.argv[2];
if (kind !== 'public' && kind !== 'secret') {
  console.error('Uso: npm run key:new -- public|secret');
  process.exit(1);
}

const key = generateKey(kind);
console.log(`key  (${kind}): ${key}`);
console.log(`hash (sha256): ${hashKey(key)}`);
console.log(`\nAgrega el hash a "${kind}KeyHashes" del sitio en config/sites.json.`);
