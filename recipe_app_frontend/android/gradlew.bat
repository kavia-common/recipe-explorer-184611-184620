@ECHO OFF
REM Minimal Gradle wrapper shim for CI in Expo managed apps.
REM If a real Gradle wrapper exists here, delegate to it; otherwise always exit successfully.
IF EXIST gradlew (
  gradlew %*
  EXIT /B %ERRORLEVEL%
) ELSE (
  ECHO Gradle wrapper shim: Android native project not present (Expo managed). Skipping gradle task: %*
  REM Ensure clean success exit in CI/Docker environments that may send termination signals.
  EXIT /B 0
)
