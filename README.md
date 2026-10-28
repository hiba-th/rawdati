# Rawdati (روضتي) — mobile app front end

Parents follow their child's day at kindergarten (arrival, meals, naps, photos, chat,
schedule changes, progress, fees). Teachers use the same app in **Teacher mode**.
Built from the design handoff in `../design/rawdati-handoff/` (all 25 screens).

**Stack:** Expo SDK 58 · React Native · TypeScript · Expo Router · react-native-svg ·
i18next (Arabic RTL, French, English, Tamazight) · Google Fonts (Baloo 2, Nunito,
Baloo Bhaijaan 2, Noto Sans Tifinagh).

## Run it

```bash
npm install
npm run web        # opens in the browser at http://localhost:8081
npm start          # then scan the QR code with Expo Go on your phone
npm run typecheck
```

## Folder map

```
src/
  app/                 every file is a screen (Expo Router)
    index.tsx          01 splash → onboarding / login / home
    onboarding.tsx     02    language.tsx 03    login.tsx 04    verify.tsx 05    children.tsx 06
    (parent)/          bottom tabs: home 07 · day 08 · photos 09 · fees 18 · me 22
    attendance 10 · pickup 11 · schedule 12 · progress 13 · messages 14 · notifications 15
    news 16 · activities 17 · checkout 19 · payment-done 20 · receipts 21
    (teacher)/         teacher tabs: checkin 23 · log 24 · post 25 (Parents tab opens messages)
  components/          shared UI: ui.tsx (Text, Button, Card, Pill, Toggle, Grid…),
                       Icon.tsx, Art.tsx (logo, child faces), TabBar, Sheet, Field
  theme/               design tokens + font mapping
  i18n/                translations — keys are the English strings (ar.ts, fr.ts, tzm.ts)
  data/mock.ts         sample data from the handoff; `api` is the place to plug in a backend
  store/AppStore.tsx   app state (login, chosen child, language, pick-up, fees…) + toasts
scripts/extract-strings.js   lists strings missing from a translation: `node scripts/extract-strings.js ar`
```

## Notes

- **Arabic** flips the whole layout to right-to-left without restarting the app.
- **Tamazight** has no translations yet; it falls back to French. Add strings to `src/i18n/tzm.ts`.
- **Placeholders to replace** (from the handoff): `[DOCTOR NAME · PHONE]`, `[KINDERGARTEN RIP]`,
  the kindergarten phone number in `src/data/mock.ts`, and the coloured blocks standing in for photos.
- **Not built yet (needs a backend):** real login/SMS, push notifications, real Edahabia/CIB payment
  page (WebView), PDF generation, camera/gallery picker, voice messages. Buttons for these show a
  short message instead.
