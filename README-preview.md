# Preview/CI Readiness Notes

- The preview system expects a web server on port 3000 to be ready and respond with HTTP 200 OK at a healthcheck path.
- This project runs Expo dev server using `npm start`. For CI/preview:
  - A minimal Express healthcheck server is started automatically (in Node context) to respond on:
    - Port: `EXPO_PUBLIC_PORT` (default `3000`)
    - Path: `EXPO_PUBLIC_HEALTHCHECK_PATH` (default `/healthz`)
  - Expo web also serves a static page at `/healthcheck.html` that returns `OK` if accessed.
- Ensure environment variables are set via `.env` or CI variables (see `recipe_app_frontend/.env.example`).
- CI should:
  1. `cd recipe_app_frontend && npm install`
  2. Start the preview as usual with `npm run web -- --port 3000` (the healthcheck will make readiness detectable)
  3. See `.env.example` for configurable env vars
