import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { Lang, useLang, useTranslation } from '../i18n';
import { arabicFont, tifinaghFont } from '../theme/fonts';
import { BackButton, Button, IconTile, RadioDot, Screen, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

const LANGS: { id: Lang; code: string; native: string; en: string; chip: string; font?: string }[] = [
  { id: 'ar', code: 'ع', native: 'العربية', en: 'Arabic', chip: colors.sunTint, font: arabicFont },
  { id: 'fr', code: 'FR', native: 'Français', en: 'French', chip: colors.skyTint },
  { id: 'en', code: 'EN', native: 'English', en: 'English', chip: colors.leafTint },
  { id: 'tzm', code: 'ⵣ', native: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', en: 'Tamazight', chip: colors.lilacTint, font: tifinaghFont },
];

// 03 · Language — Arabic is the default; choosing it flips the app to RTL.
export default function Language() {
  const { t } = useTranslation();
  const current = useLang();
  const store = useStore();
  const [sel, setSel] = useState<Lang>(store.lang ?? 'ar');
  const fromSettings = store.loggedIn;

  const pick = (l: Lang) => {
    setSel(l);
    store.chooseLanguage(l); // preview the choice immediately
  };

  return (
    <Screen
      footer={
        <Button
          label={t('Continue')}
          onPress={() => {
            store.chooseLanguage(sel);
            if (fromSettings) router.back();
            else router.replace('/role');
          }}
        />
      }
    >
      <View style={{ paddingHorizontal: 24, gap: 8 }}>
        {fromSettings ? (
          <BackButton fallback="/me" />
        ) : (
          <IconTile icon="chatLines" bg={colors.skyTint} color={colors.skyText} size={56} r={20} iconSize={28} />
        )}
        <T d w={800} size={32} lh={36} accessibilityRole="header" style={{ marginTop: 10 }}>
          {t('Which language do you prefer?')}
        </T>
        <T size={15} lh={22} w={600} color={colors.muted}>
          {t('You can change it anytime in Settings.')}
        </T>
      </View>

      <View accessibilityRole="radiogroup" accessibilityLabel={t('Language')} style={{ marginTop: 26, paddingHorizontal: 24, gap: 12 }}>
        {LANGS.map((l) => {
          const on = sel === l.id;
          return (
            <Tap
              key={l.id}
              role="radio"
              accessibilityState={{ checked: on }}
              label={`${l.native}, ${l.en}`}
              onPress={() => pick(l.id)}
              style={{
                minHeight: 76,
                borderRadius: 24,
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#FFFFFF',
                borderWidth: 2.5,
                borderColor: on ? colors.coral : '#FFFFFF',
                boxShadow: on ? `0px 6px 0px ${colors.coralSoft}` : '0px 4px 0px #F1E8DE',
                marginBottom: 4,
              }}
            >
              <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: l.chip, alignItems: 'center', justifyContent: 'center' }}>
                <T size={16} w={800} center style={l.font ? { fontFamily: l.font } : undefined}>
                  {l.code}
                </T>
              </View>
              <View style={{ flex: 1 }}>
                <T size={19} w={800} style={l.font ? { fontFamily: l.font } : current === 'ar' ? undefined : { fontFamily: 'Nunito_800ExtraBold' }}>
                  {l.native}
                </T>
                <T size={13} w={700} color={colors.muted}>
                  {t(l.en)}
                </T>
              </View>
              <RadioDot on={on} size={26} check />
            </Tap>
          );
        })}
      </View>
      {sel === 'tzm' && (
        <T size={13} w={600} color={colors.muted} style={{ marginHorizontal: 24, marginTop: 14 }}>
          {t('Tamazight translation is in progress — some screens show French for now.')}
        </T>
      )}
    </Screen>
  );
}
