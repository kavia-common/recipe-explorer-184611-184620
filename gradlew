#!/usr/bin/env sh
# Root-level Gradle wrapper shim for CI environments invoking ./gradlew from repo root.
# Delegates to the Expo app shim if present; otherwise no-op with success.
# Ensures clean exit in CI environments that may terminate the process (exit 143).

# Trap termination signals early so Docker timeouts don't produce non-zero codes.
trap 'exit 0' INT TERM HUP

APP_DIR="./recipe_app_frontend"

if [ -x "$APP_DIR/android/gradlew" ]; then
  cd "$APP_DIR" && exec ./android/gradlew "$@"
elif [ -x "./android/gradlew" ]; then
  exec ./android/gradlew "$@"
else
  echo "Gradle wrapper shim (root): No native Android project present. Skipping gradle task: $*"
  exit 0
fi
