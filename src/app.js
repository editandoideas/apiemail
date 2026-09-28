import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { sendRouter } from './routes/send.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { errorBody } from './lib/http.js';

export function createApp({ registry, mailer, verifyTurnstile, env }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);

  app.use(helmet());

  // CORS responde el preflight con la union de origins de todos los sitios. Que el
  // origin corresponda a la key concreta se valida despues, en authenticate().
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || registry.allowedOrigins.has(origin)),
      methods: ['POST'],
      allowedHeaders: ['Content-Type', 'X-Api-Key', 'Idempotency-Key'],
      maxAge: 86_400,
    }),
  );

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Freno general por IP, incluye peticiones con key invalida.
  app.use(
    '/v1',
    rateLimit({
      windowMs: 60_000,
      limit: 60,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: errorBody('rate_limited', 'Demasiadas peticiones, intenta mas tarde'),
    }),
  );
  app.use('/v1', express.json({ limit: '300kb' }));
  app.use('/v1', sendRouter({ registry, mailer, verifyTurnstile, env }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
