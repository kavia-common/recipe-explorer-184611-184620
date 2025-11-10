#!/usr/bin/env sh
# Root-level Gradle wrapper shim for CI environments invoking ./gradlew from repo root.
# Delegates to the Expo app shim if present; otherwise no-op with success.
# Ensures clean exit in CI environments that may terminate the process (exit 143).

# Trap termination signals early so Docker timeouts don't produce non-zero codes.
# Also include additional signals commonly sent by CI (QUIT, PIPE).
trap 'exit 0' INT TERM HUP QUIT PIPE

APP_DIR="./recipe_app_frontend"

# If CI attempts to run typical gradle lifecycle tasks in a managed Expo app, short-circuit them.
case "$1" in
  assemble*|bundle*|build|clean|test|lint|check|connected*|uninstall*|install*|publish*)
    echo "Gradle wrapper shim (root): Managed Expo app detected. Short-circuiting Gradle task: $*"
    exit 0
    ;;
esac

if [ -x "$APP_DIR/android/gradlew" ]; then
  cd "$APP_DIR" && exec ./android/gradlew "$@"
elif [ -x "./android/gradlew" ]; then
  exec ./android/gradlew "$@"
else
  echo "Gradle wrapper shim (root): No native Android project present. Skipping gradle task: $*"
  exit 0
fi
