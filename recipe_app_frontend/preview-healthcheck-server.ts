import express from 'express';

/**
 * PUBLIC_INTERFACE
 * startPreviewHealthcheckServer
 * Starts a lightweight Express server that immediately responds 200 OK at a configurable path,
 * intended for CI/preview readiness checks while Metro/Expo is still bundling.
 *
 * Behavior:
 * - Binds to 0.0.0.0 on EXPO_PUBLIC_PORT (default 3000).
 * - If EADDRINUSE on primary port, tries a secondary ephemeral port but still relies on the Expo dev
 *   server to serve a static /healthz page via web/healthcheck.html (so readiness on port 3000 works).
 * - Trusts proxy when EXPO_PUBLIC_TRUST_PROXY=true.
 * - Logs minimally unless EXPO_PUBLIC_LOG_LEVEL=silent.
 *
 * Returns the created HTTP server instance or undefined on failure.
 */
// PUBLIC_INTERFACE
export function startPreviewHealthcheckServer() {
  try {
    const port = Number(process.env.EXPO_PUBLIC_PORT || 3000);
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

    const listen = (bindPort: number) =>
      app
        .listen(bindPort, host, () => {
          if (logLevel !== 'silent') {
            console.log(`[preview-healthcheck] listening on ${host}:${bindPort}, path: ${healthPath}`);
          }
        })
        .on('error', (err: unknown) => {
          const code = (err as { code?: string })?.code;
          if (code === 'EADDRINUSE') {
            // If 3000 is taken by Expo, we still want readiness on 3000; Expo will serve the app.
            if (logLevel !== 'silent') {
              console.warn(`[preview-healthcheck] port ${bindPort} in use; assuming Expo dev server will serve ${healthPath}.`);
            }
            // Try a fallback port to keep a tiny server alive for logs, but do not crash.
            try {
              const fallback = 0; // ephemeral
              const srv = app.listen(fallback, host, () => {
                const addr = srv.address();
                if (logLevel !== 'silent') {
                  console.log('[preview-healthcheck] fallback healthcheck server listening on ephemeral port', addr);
                }
              });
              // No return from here; this error handler isn't expected to return the fallback
            } catch (e) {
              if (logLevel !== 'silent') {
                console.warn('[preview-healthcheck] failed to bind fallback port:', e);
              }
            }
          } else {
            console.warn('[preview-healthcheck] server error:', err);
          }
        });

    // Attempt binding to the requested port first
    const server = listen(port);
    return server;
  } catch (err) {
    console.warn('[preview-healthcheck] failed to start:', err);
    return undefined;
  }
}
