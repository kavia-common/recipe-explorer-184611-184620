# Recipe App Frontend

This is an Expo React Native application implementing the initial UI and core flows:

- Bottom tabs: Browse, Search, Saved
- Recipe list with cards, details screen, and saved toggle
- Search input and filter chips for cuisine and time
- Local persistence of saved recipes with AsyncStorage
- Ocean Professional theme (blue & amber accents, subtle shadows, rounded corners)

## Running

- Install deps: npm install
- Start: npm start

The app uses only local mock data for now and stores saved recipe IDs locally.

## Preview healthcheck

In CI/preview environments, we spin up a tiny Express server that responds with 200 OK at a configurable path (default `/healthz`) on port 3000 so the preview system can detect readiness while the Expo dev server is running.

Environment variables (see `.env.example`):
- EXPO_PUBLIC_PORT (default 3000)
- EXPO_PUBLIC_HEALTHCHECK_PATH (default /healthz)
- EXPO_PUBLIC_TRUST_PROXY (default true)
- EXPO_PUBLIC_LOG_LEVEL (default info)
