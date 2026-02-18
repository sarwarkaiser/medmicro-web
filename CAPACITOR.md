# Capacitor — Native iOS & Android Build Guide

This guide walks you through wrapping **MedMicro** as a native iOS or Android app using [Capacitor 6](https://capacitorjs.com/).

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Xcode | ≥ 15 (macOS only, for iOS) |
| Android Studio | 2023+ (for Android) |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

This installs `@capacitor/core` and `@capacitor/cli` as dev dependencies.

### 2. Initialise Capacitor (first time only)

```bash
npx cap init
```

Use these values when prompted:
- **App name**: MedMicro
- **App ID**: com.medmicro.app
- **Web asset directory**: public

> `capacitor.config.json` is already pre-configured in the repo — you can skip re-running `init` if it exists.

---

## iOS Build

### 1. Add iOS platform

```bash
npx cap add ios
```

### 2. Copy web assets

```bash
npx cap copy ios
```

### 3. Open in Xcode

```bash
npx cap open ios
```

### 4. Build & Run

In Xcode:
1. Select your target device or simulator
2. Press **⌘R** to build and run
3. For App Store submission: Product → Archive

---

## Android Build

### 1. Add Android platform

```bash
npx cap add android
```

### 2. Copy web assets

```bash
npx cap copy android
```

### 3. Open in Android Studio

```bash
npx cap open android
```

### 4. Build & Run

In Android Studio:
1. Select your emulator or device
2. Click **Run ▶** or press **Shift+F10**
3. For Play Store: Build → Generate Signed Bundle/APK

---

## Sync after web changes

After updating the PWA frontend, run:

```bash
npx cap sync
```

This copies web assets and updates native plugins for both platforms.

---

## Splash Screen

The splash screen is configured in `capacitor.config.json`:
- **Background**: `#020617` (dark slate)
- **Duration**: 2000 ms
- **Spinner**: disabled

To customise the splash image, add native assets in:
- iOS: `ios/App/App/Assets.xcassets/Splash.imageset/`
- Android: `android/app/src/main/res/drawable/`

---

## Tips

- Run `npx cap doctor` to check your environment setup
- Use `npx cap update` to keep Capacitor plugins in sync
- Live reload during development: `npx cap run ios --livereload --external`
