import express from 'express';

/**
 * Starts a lightweight Express server that responds to a configurable healthcheck path.
 * This is used only in preview/CI environments so the preview system can detect readiness
 * on the expected port (default 3000) even when using Expo.
 *
 * The server:
 * - Binds explicitly to 0.0.0.0 unless EXPO_PUBLIC_HOST is provided.
 * - Returns 200 OK at EXPO_PUBLIC_HEALTHCHECK_PATH (default /healthz).
 * - Gracefully handles EADDRINUSE (when Expo is already using the port), logging and exiting
 *   without crashing the app, so the preview remains healthy if another server serves the path.
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

    app.get(healthPath, (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.status(200).send('OK');
    });

    // Optional: info endpoint for debugging in preview
    app.get('/', (_req, res) => {
      res.type('text/plain').send('Recipe App Preview Healthcheck Server');
    });

    const server = app
      .listen(port, host, () => {
        if (logLevel !== 'silent') {
          console.log(`[preview-healthcheck] listening on ${host}:${port}, path: ${healthPath}`);
        }
      })
      .on('error', (err: unknown) => {
        const code = (err as { code?: string })?.code;
        if (code === 'EADDRINUSE') {
          // Port is already used by the Expo dev server. In that case,
          // we can't bind here; log and continue so the process doesn't crash.
          if (logLevel !== 'silent') {
            console.warn(
              `[preview-healthcheck] port ${port} already in use; assuming Expo dev server is running.`
            );
          }
        } else {
          console.warn('[preview-healthcheck] server error:', err);
        }
      });

    return server;
  } catch (err) {
    console.warn('[preview-healthcheck] failed to start:', err);
    return undefined;
  }
}
