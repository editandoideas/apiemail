import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { loadRegistry } from './config/sites.js';
import { createResendMailer } from './services/mailer.js';
import { verifyTurnstile } from './services/turnstile.js';
import { log } from './lib/http.js';

const env = loadEnv();
if (!env.resendApiKey) {
  log('ERROR', 'RESEND_API_KEY no definida');
  process.exit(1);
}

const registry = loadRegistry(env);
const app = createApp({ registry, mailer: createResendMailer(env.resendApiKey), verifyTurnstile, env });

app.listen(env.port, () => {
  log('INFO', 'apiemail_listening', { port: env.port, sites: registry.sites.size });
});
