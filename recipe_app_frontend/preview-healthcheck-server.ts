import express from 'express';

/**
 * Starts a lightweight Express server that responds to a configurable healthcheck path.
 * This is used only in preview/CI environments so the preview system can detect readiness
 * on the expected port (default 3000) even when using Expo.
 */
export function startPreviewHealthcheckServer() {
  try {
    const port = Number(process.env.EXPO_PUBLIC_PORT || 3000);
    const trustProxy = (process.env.EXPO_PUBLIC_TRUST_PROXY || 'true').toLowerCase() === 'true';
    const logLevel = (process.env.EXPO_PUBLIC_LOG_LEVEL || 'info').toLowerCase();
    const healthPath = process.env.EXPO_PUBLIC_HEALTHCHECK_PATH || '/healthz';

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

    app.listen(port, () => {
      if (logLevel !== 'silent') {
        console.log(`[preview-healthcheck] listening on ${port}, path: ${healthPath}`);
      }
    });
  } catch (err) {
    console.warn('[preview-healthcheck] failed to start:', err);
  }
}
