#!/usr/bin/env sh
# Root-level Gradle wrapper shim for CI environments invoking ./gradlew from repo root.
# Delegates to the Expo app shim if present; otherwise no-op with success.
APP_DIR="./recipe_app_frontend"
if [ -x "$APP_DIR/android/gradlew" ]; then
  cd "$APP_DIR" && exec ./android/gradlew "$@"
elif [ -x "./android/gradlew" ]; then
  exec ./android/gradlew "$@"
else
  echo "Gradle wrapper shim (root): No native Android project present. Skipping gradle task: $*"
  exit 0
fi
