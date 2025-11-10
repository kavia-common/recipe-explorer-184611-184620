This folder contains a minimal Gradle wrapper shim to satisfy CI environments that invoke generic Gradle commands.

This project is an Expo managed app and does not include a full native Android project. The shim exits successfully when no native project exists, preventing false negative CI failures.
