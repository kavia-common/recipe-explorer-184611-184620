import { registerRootComponent } from 'expo';

import App from './App';

// In preview/CI environments, start a minimal Express healthcheck server that responds on
// EXPO_PUBLIC_PORT (default 3000) at EXPO_PUBLIC_HEALTHCHECK_PATH (default /healthz).
// This ensures the preview system detects readiness even though Expo dev server is not a typical web app server.
try {
  // Only attempt to start the Node server when running in a web/Node context.
  // @ts-expect-error process is available at runtime in bundlers/Node (not typed in RN web context)
  const isPreview =
    process.env?.CI === 'true' ||
    process.env?.KAVIA_PREVIEW === 'true' ||
    process.env?.NODE_ENV === 'development';

  const runningInNode = typeof (globalThis as unknown as { window?: unknown }).window === 'undefined';
  const shouldStartHealthServer = isPreview && runningInNode;

  if (shouldStartHealthServer) {
    // Use dynamic import to avoid bundling into the client and to satisfy lint rules
    import('./preview-healthcheck-server')
      .then((mod) => {
        if (typeof mod.startPreviewHealthcheckServer === 'function') {
          mod.startPreviewHealthcheckServer();
        }
      })
      .catch(() => {
        // ignore failures to keep app startup unaffected
      });
  }
} catch {
  // ignore failures to keep app startup unaffected
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
