# Preview/CI Readiness (App)

- Healthcheck server is launched alongside Expo Web by the `web` script:
  - `node ./preview-healthcheck-launcher.cjs` starts a tiny Express server that binds to 0.0.0.0 and responds 200 at `${EXPO_PUBLIC_HEALTHCHECK_PATH:-/healthz}` on port `${EXPO_PUBLIC_PORT:-3000}`.
  - It tolerates EADDRINUSE if Expo already uses port 3000.
- Expo Web starts as usual:
  - `expo start --web` (port may be set via `--port 3000` when invoked by CI).
- Configure envs via `.env`:
  - See `.env.example` for defaults.

Common checks:
- curl http://localhost:3000/healthz  -> should return `OK`
- curl http://127.0.0.1:3000/healthz  -> should return `OK`
- curl http://0.0.0.0:3000/healthz     -> should return `OK` (depending on curl/host setup)
