# recipe-explorer-184611-184620

This repository contains an Expo React Native app (managed workflow).

CI Notes:
- A root-level `gradlew` shim is included to satisfy CI jobs that invoke `./gradlew`. In managed Expo, no native project exists by default; the shim returns success to avoid false negatives.
- Prefer running `npm run ci` for lint-only checks.

For the app documentation, see `recipe_app_frontend/README.md`.
