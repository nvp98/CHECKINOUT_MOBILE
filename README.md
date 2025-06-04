# 📱 React Native Project Setup Guide

This guide walks you through installing and running a React Native project (v0.66.x).

---

## 🔧 Prerequisites

| Tool                    | Version            | Notes                             |
| ----------------------- | ------------------ | --------------------------------- |
| Node.js                 | 14.x – 16.x        | Recommended: `nvm use 16.x.x`    |
| npm                     | 6.x – 8.x          | Or use `yarn`                     |
| React Native CLI        | `npx react-native` | No need to install globally       |
| JDK                     | 11                 | Set JAVA\_HOME                    |
| Android Studio          | Installed          | Android SDK + Emulator            |
| Android SDK Build Tools | ≥ 30.0.2           | Ensure matching compileSdkVersion |
| Git                     | Installed          |                                   |

---

## 📅 1. Clone the Repository

```bash
git clone https://github.com/nvp98/CHECKINOUT_MOBILE.git
cd CHECKINOUT_MOBILE
```

---

## 📦 2. Install Dependencies

```bash
npm install
# OR (if using yarn)
# yarn install
```

> ✅ Tip: If you get errors, try:
> `npm install --legacy-peer-deps`
> Or clean cache:
> `npm cache clean --force`

---

## ⚙️ 3. Android Environment Setup

```bash
cd android
./gradlew clean
cd ..
```

> You may also remove folders to ensure clean build:

```bash
rm -rf node_modules
rm -rf android/.gradle
rm -rf android/app/build

Then reinstall:

```bash
npm install

## 🛠 4. Start Metro Server

```bash
npm start
```

Or in separate terminal:

```bash
npx react-native start
```

---

## 📱 5. Run the App (Android)

```bash
npx react-native run-android
```

---

## 🐞 Common Issues

| Issue                              | Solution                                                                |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `RNCAndroidDialogPicker not found` | Ensure `@react-native-picker/picker` is linked properly and recompiled  |
| `Invariant Violation`              | Clear build cache, re-run Metro, and rebuild                            |
| Gradle error (compileSdk < minSdk) | Check `android/build.gradle` and set `compileSdkVersion = 31` or higher |
| `variant.getJavaCompile()` warning | Ignore or downgrade Gradle plugin if needed                             |

---

## 📁 Project Structure Overview

```
/android           - Native Android project
/ios               - Native iOS project (if enabled)
/src               - App source code
  /screens
  /components
  /api
index.js           - App entry point
package.json       - Dependencies and scripts
```

---

## 🔪 Test

```bash
npm test
```

---

## 📌 Notes

* For development, use emulator or real device with debugging enabled.
* If using `.env` files, make sure `react-native-dotenv` is configured.
