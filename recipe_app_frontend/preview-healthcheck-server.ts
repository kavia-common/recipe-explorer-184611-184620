import express from 'express';

/**
 * PUBLIC_INTERFACE
 * startPreviewHealthcheckServer
 * Starts a lightweight Express server that immediately responds 200 OK at a configurable path,
 * intended for CI/preview readiness checks while Metro/Expo is still bundling.
 *
 * Behavior:
 * - Binds to 0.0.0.0 on EXPO_PUBLIC_PORT (default 3030).
 * - If EADDRINUSE on the configured port we do NOT port drift; we log once and exit silently
 *   because another process is already serving on the configured port (e.g., expo).
 * - Trusts proxy when EXPO_PUBLIC_TRUST_PROXY=true.
 * - Logs minimally unless EXPO_PUBLIC_LOG_LEVEL=silent.
 *
 * Returns the created HTTP server instance or undefined on failure.
 */
// PUBLIC_INTERFACE
export function startPreviewHealthcheckServer() {
  try {
    const port = Number(process.env.EXPO_PUBLIC_PORT || 3030);
    const trustProxy = (process.env.EXPO_PUBLIC_TRUST_PROXY || 'true').toLowerCase() === 'true';
    const logLevel = (process.env.EXPO_PUBLIC_LOG_LEVEL || 'info').toLowerCase();
    const healthPath = process.env.EXPO_PUBLIC_HEALTHCHECK_PATH || '/healthz';
    const host = process.env.EXPO_PUBLIC_HOST || '0.0.0.0';

    const app = express();
    app.set('trust proxy', trustProxy);

    // Primary health endpoint served by this lightweight server (when it owns the port)
    app.get(healthPath, (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.status(200).send('OK');
    });

    // Also provide a static healthcheck fallback mapping at /healthcheck.html for consistency.
    app.get('/healthcheck.html', (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.type('text/html').send('<!doctype html><title>Healthcheck</title>OK');
    });

    // Optional: info endpoint for quick smoke
    app.get('/', (_req, res) => {
      res.type('text/plain').send('Recipe App Preview Healthcheck Server');
    });

    const listen = (bindPort: number) => {
      const server = app.listen(bindPort, host, () => {
        if (logLevel !== 'silent') {
          console.log(`[preview-healthcheck] listening on ${host}:${bindPort}, path: ${healthPath}`);
        }
      });
      server.on('error', (err: unknown) => {
        const code = (err as { code?: string })?.code;
        if (code === 'EADDRINUSE') {
          // Do not drift to another port to avoid confusing the preview system.
          if (logLevel !== 'silent') {
            console.warn(`[preview-healthcheck] port ${bindPort} in use; another process is listening (likely expo). Not starting duplicate server.`);
          }
        } else {
          console.warn('[preview-healthcheck] server error:', err);
        }
      });
      return server;
    };

    // Attempt binding to the requested port first
    const server = listen(port);
    return server;
  } catch (err) {
    console.warn('[preview-healthcheck] failed to start:', err);
    return undefined;
  }
}
