<div align="center">

<img src="assets/icon.png" width="96" alt="Rawdati logo" />

# Rawdati · روضتي

**A kindergarten app for Algerian families: parents follow their child's day, teachers share it in a few taps.**

![Expo](https://img.shields.io/badge/Expo_SDK_58-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![i18n](https://img.shields.io/badge/Arabic_RTL_·_French_·_English_·_Tamazight-FFD45C)

</div>

## About

Parents in Algeria often hear about their child's day only at pick-up time. Rawdati gives them a live
view of it: arrival, meals, naps, photos, messages with the teacher, schedule changes, progress and fees.
Teachers use the same app in **Teacher mode** to check children in, log the day and post updates.

The app is built for the local context: Arabic with full right-to-left layout, French, English and
Tamazight (Tifinagh script), and payment flows designed around Edahabia / CIB cards.

> **Status:** front end complete (25 screens) with mock data. Backend, real login and payments are next.

## Features

**For parents**
- Daily timeline: arrival, meals, naps, activities and photos
- Chat with teachers and kindergarten news
- Attendance, authorised pick-up people and schedule changes
- Progress reports, fees, checkout and receipts
- Switch language instantly, including Arabic RTL without restarting

**For teachers**
- Morning check-in for the whole class
- Quick daily log and photo posts
- Family list with private notes and chat

## Tech stack

| Area | Tools |
| --- | --- |
| App | Expo SDK 58, React Native, TypeScript |
| Navigation | Expo Router (file-based, separate parent and teacher tab groups) |
| UI | Custom design system (tokens, components), react-native-svg |
| Languages | i18next with Arabic (RTL), French, English, Tamazight |
| Fonts | Baloo 2, Nunito, Baloo Bhaijaan 2, Noto Sans Tifinagh |
| State | React context store with AsyncStorage |

## Run it

```bash
npm install
npm run web        # opens in the browser at http://localhost:8081
npm start          # then scan the QR code with Expo Go on your phone
npm run typecheck
```

## Project structure

```
src/
  app/            every file is a screen (Expo Router)
    (parent)/     parent tabs: home · day · photos · fees · me
    (teacher)/    teacher tabs: check-in · log · post · parents
  components/     shared UI: buttons, cards, sheets, icons, tab bar
  theme/          design tokens and font mapping
  i18n/           translations (keys are the English strings)
  data/           mock data; `api` is where the backend plugs in
  store/          app state: login, selected child, language, pick-up, fees
scripts/
  extract-strings.js   lists strings missing from a translation
```

## Roadmap

- [x] All 25 screens from the design, parent and teacher modes
- [x] Arabic RTL, French and English translations
- [ ] Backend API and real phone/SMS login
- [ ] Push notifications
- [ ] Edahabia / CIB online payment
- [ ] Camera upload, PDF receipts, voice messages
- [ ] Tamazight translations

## Author

**Hiba Fethallah** · [Portfolio](https://hiba-fethallah.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/hiba-fethallah-508b42295/)
