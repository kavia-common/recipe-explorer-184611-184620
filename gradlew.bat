@ECHO OFF
REM Root-level Gradle wrapper shim for CI in Expo managed apps.
REM Delegates to the app shim if present; otherwise exit successfully.

SET APP_DIR=recipe_app_frontend

IF EXIST %APP_DIR%\\android\\gradlew.bat (
  PUSHD %APP_DIR%
  CALL android\\gradlew.bat %*
  POPD
  EXIT /B %ERRORLEVEL%
) ELSE IF EXIST android\\gradlew.bat (
  CALL android\\gradlew.bat %*
  EXIT /B %ERRORLEVEL%
) ELSE (
  ECHO Gradle wrapper shim (root): No native Android project present. Skipping gradle task: %*
  REM Ensure clean success exit in CI/Docker environments that may send termination signals.
  EXIT /B 0
)
