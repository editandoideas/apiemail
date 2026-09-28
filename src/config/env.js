const int = (value, fallback) => {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
};

export function loadEnv(source = process.env) {
  return {
    port: int(source.PORT, 8080),
    nodeEnv: source.NODE_ENV ?? 'development',
    resendApiKey: source.RESEND_API_KEY ?? '',
    // Remitente cuando el sitio no tiene dominio propio verificado en Resend.
    defaultFromAddress: source.DEFAULT_FROM_ADDRESS ?? 'no-reply@editandoideas.com',
    sitesFile: source.SITES_FILE ?? 'config/sites.json',
    sitesJson: source.SITES_JSON ?? '',
    // Numero de proxies delante de la app (Cloud Run = 1) para leer la IP real.
    trustProxy: int(source.TRUST_PROXY, 1),
    rateLimitIpPerMinute: int(source.RATE_LIMIT_IP_PER_MINUTE, 5),
    rateLimitSitePerHour: int(source.RATE_LIMIT_SITE_PER_HOUR, 100),
  };
}
