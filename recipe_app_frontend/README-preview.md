# Preview/CI Readiness (App)

- Preflight install:
  - The `web` script runs a quick pre-check (`scripts/pre-web-start.cjs`) to install dependencies with `npm ci --prefer-offline --no-audit --silent` (or `npm install --prefer-offline --no-audit --silent`) if `node_modules` is missing. It also verifies `@react-native-async-storage/async-storage` presence and attempts to add it if absent.
- Healthcheck server:
  - `node ./preview-healthcheck-launcher.cjs` starts a tiny Express server that binds to 0.0.0.0 and responds 200 at `${EXPO_PUBLIC_HEALTHCHECK_PATH:-/healthz}` on port `${EXPO_PUBLIC_PORT:-3030}`.
  - If EADDRINUSE on the configured port, we do not drift to another port to avoid confusing the preview readiness check; typically Expo is already bound and will answer on the same port.
- Expo Web starts as usual:
  - `expo start --web --port ${EXPO_PUBLIC_PORT:-3030}` (port is passed from env for consistency with the healthcheck server).
- Configure envs via `.env`:
  - See `.env.example` for defaults.

Common checks:
- curl http://localhost:3030/healthz  -> should return `OK`
- curl http://127.0.0.1:3030/healthz  -> should return `OK`
- curl http://0.0.0.0:3030/healthz     -> should return `OK` (depending on curl/host setup)
