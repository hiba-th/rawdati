import {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import {
  BalooBhaijaan2_600SemiBold,
  BalooBhaijaan2_700Bold,
  BalooBhaijaan2_800ExtraBold,
} from '@expo-google-fonts/baloo-bhaijaan-2';
import { NotoSansTifinagh_400Regular } from '@expo-google-fonts/noto-sans-tifinagh';
import type { Lang } from '../i18n';

export const fontAssets = {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  BalooBhaijaan2_600SemiBold,
  BalooBhaijaan2_700Bold,
  BalooBhaijaan2_800ExtraBold,
  NotoSansTifinagh_400Regular,
};

export type Weight = 600 | 700 | 800;

const SUFFIX: Record<Weight, string> = { 600: '600SemiBold', 700: '700Bold', 800: '800ExtraBold' };

// Custom fonts in React Native are one family per weight, so we pick the file here.
// Display = Baloo 2, body = Nunito; Arabic uses Baloo Bhaijaan 2 for both.
export function fontFamily(display: boolean, weight: Weight, lang: Lang): string {
  if (lang === 'ar') return `BalooBhaijaan2_${SUFFIX[weight]}`;
  return display ? `Baloo2_${SUFFIX[weight]}` : `Nunito_${SUFFIX[weight]}`;
}

export const tifinaghFont = 'NotoSansTifinagh_400Regular';
export const arabicFont = 'BalooBhaijaan2_700Bold';
