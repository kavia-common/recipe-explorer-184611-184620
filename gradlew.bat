@ECHO OFF
REM Root-level Gradle wrapper shim for CI in Expo managed apps.
SET APP_DIR=recipe_app_frontend
IF EXIST %APP_DIR%\android\gradlew.bat (
  PUSHD %APP_DIR%
  CALL android\gradlew.bat %*
  POPD
  EXIT /B %ERRORLEVEL%
) ELSE IF EXIST android\gradlew.bat (
  CALL android\gradlew.bat %*
  EXIT /B %ERRORLEVEL%
) ELSE (
  ECHO Gradle wrapper shim (root): No native Android project present. Skipping gradle task: %*
  EXIT /B 0
)
