'use strict';

/**
 * Bootstraps the preview healthcheck server in a Node context before Expo web starts.
 * Avoids require() to satisfy lint rules by spawning a tiny ESM runner.
 *
 * Environment defaults:
 * - EXPO_PUBLIC_PORT=3000
 * - EXPO_PUBLIC_HEALTHCHECK_PATH=/healthz
 * - EXPO_PUBLIC_HOST=0.0.0.0
 */
(function main() {
  try {
    // Ensure defaults
    process.env.EXPO_PUBLIC_PORT = process.env.EXPO_PUBLIC_PORT || '3000';
    process.env.EXPO_PUBLIC_HEALTHCHECK_PATH = process.env.EXPO_PUBLIC_HEALTHCHECK_PATH || '/healthz';
    process.env.EXPO_PUBLIC_HOST = process.env.EXPO_PUBLIC_HOST || '0.0.0.0';

    // Build a tiny ESM runner that uses jiti to load the TS module and start it.
    const runner = `
      import jitiFactory from 'jiti';
      const jiti = jitiFactory(import.meta.url);
      const mod = jiti('./preview-healthcheck-server');
      if (mod && typeof mod.startPreviewHealthcheckServer === 'function') {
        mod.startPreviewHealthcheckServer();
      } else {
        console.warn('[preview-healthcheck-launcher] startPreviewHealthcheckServer not found.');
      }
    `;

    // Spawn node with ESM input type to execute the runner using dynamic import to avoid require().
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const { spawn } = await import('node:child_process');
      const child = spawn(process.execPath, ['--input-type=module', '-e', runner], {
        stdio: 'inherit',
        env: process.env,
        cwd: __dirname,
      });
      child.on('error', (err) => {
        console.warn('[preview-healthcheck-launcher] failed to spawn runner:', err);
      });
    })();
  } catch (err) {
    console.warn('[preview-healthcheck-launcher] failed to start:', err);
  }
})();
