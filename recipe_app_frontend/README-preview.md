# Preview/CI Readiness (App)

- Preflight install:
  - The `web` script runs a quick pre-check (`scripts/pre-web-start.cjs`) to install dependencies with `npm ci` or `npm install` if `node_modules` is missing. It also verifies `@react-native-async-storage/async-storage` presence.
- Healthcheck server:
  - `node ./preview-healthcheck-launcher.cjs` starts a tiny Express server that binds to 0.0.0.0 and responds 200 at `${EXPO_PUBLIC_HEALTHCHECK_PATH:-/healthz}` on port `${EXPO_PUBLIC_PORT:-3000}`.
  - It tolerates EADDRINUSE if Expo already uses port 3000 and will use a fallback ephemeral port while Expo can serve the static `/healthcheck.html`.
- Expo Web starts as usual:
  - `expo start --web` (port may be set via `--port 3000` when invoked by CI).
- Configure envs via `.env`:
  - See `.env.example` for defaults.

Common checks:
- curl http://localhost:3000/healthz  -> should return `OK`
- curl http://127.0.0.1:3000/healthz  -> should return `OK`
- curl http://0.0.0.0:3000/healthz     -> should return `OK` (depending on curl/host setup)
