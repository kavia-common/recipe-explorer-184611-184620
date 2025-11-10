@ECHO OFF
REM Gradle wrapper shim for CI environments invoking ./gradlew from the app root.
REM In Expo managed workflow there is no native project by default. If an Android
REM wrapper exists in .\android, delegate to it; otherwise no-op and succeed.

IF EXIST android\gradlew.bat (
  PUSHD android
  CALL gradlew.bat %*
  POPD
  EXIT /B %ERRORLEVEL%
) ELSE (
  ECHO Gradle wrapper shim (app): No native Android project present. Skipping gradle task: %*
  EXIT /B 0
)
