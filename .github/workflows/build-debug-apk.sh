#!/usr/bin/env bash
# Convenience script to build debug APK locally
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Project root: $ROOT_DIR"

echo "1) Installing node dependencies..."
npm ci

echo "2) Building web assets (Vite)..."
npm run build

echo "3) Copying web assets into Android (Capacitor)..."
npx cap copy android

echo "4) Building debug APK with Gradle..."
cd android
./gradlew assembleDebug --no-daemon

echo "Done. APK is at: android/app/build/outputs/apk/debug/app-debug.apk"
