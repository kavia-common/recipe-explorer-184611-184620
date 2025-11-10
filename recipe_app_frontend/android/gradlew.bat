@ECHO OFF
REM Minimal Gradle wrapper shim for CI in Expo managed apps.
IF EXIST gradlew (
  gradlew %*
) ELSE (
  ECHO Gradle wrapper shim: Android native project not present (Expo managed). Skipping gradle task: %*
  EXIT /B 0
)
