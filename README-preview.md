# Preview/CI Readiness Notes

- The preview system expects a web server on port 3000 to be ready and respond with HTTP 200 OK at a healthcheck path.
- This project runs Expo dev server using `npm run web`. For CI/preview:
  - The script order is:
    1) `scripts/pre-web-start.cjs` — ensures dependencies are installed quickly using `npm ci --prefer-offline --no-audit --silent` if `node_modules` is missing.
    2) `preview-healthcheck-launcher.cjs` — immediately starts a background Express server that binds to `0.0.0.0` and responds 200 at:
       - Port: `EXPO_PUBLIC_PORT` (default `3000`)
       - Path: `EXPO_PUBLIC_HEALTHCHECK_PATH` (default `/healthz`)
    3) `expo start --web --port ${EXPO_PUBLIC_PORT:-3000}` — starts the Expo web dev server.
  - Expo web also serves a static page at `/healthcheck.html` that returns `OK` if accessed.
- Ensure environment variables are set via `.env` or CI variables (see `recipe_app_frontend/.env.example`).
- CI should:
  1. `cd recipe_app_frontend` (no manual install needed; the web script installs if node_modules is missing)
  2. Start the preview with `npm run web` (the healthcheck server starts immediately in the background)
  3. See `.env.example` for configurable env vars
