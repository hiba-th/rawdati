import { useEffect, useRef, useState } from 'react';
import { TextInput, TextInputInstance, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { Button, CheckRow, IconTile, Screen, T, Tap, BackButton, Pill } from '../components/ui';
import { colors } from '../theme/tokens';

const LEN = 6;
const RESEND = 60;

// 05 · Verify code — 6 boxes with auto-advance and paste, resend countdown.
export default function Verify() {
  const { t } = useTranslation();
  const store = useStore();
  const [code, setCode] = useState<string[]>(Array(LEN).fill(''));
  const [focus, setFocus] = useState(0);
  const [left, setLeft] = useState(RESEND);
  const [keep, setKeep] = useState(true);
  const refs = useRef<(TextInputInstance | null)[]>([]);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const onChange = (i: number, v: string) => {
    const digits = v.replace(/\D/g, '');
    const next = [...code];
    if (digits.length > 1) {
      // pasted (or SMS autofill) — spread over the boxes
      digits
        .slice(0, LEN - i)
        .split('')
        .forEach((d, k) => (next[i + k] = d));
      setCode(next);
      refs.current[Math.min(LEN - 1, i + digits.length)]?.focus();
      return;
    }
    next[i] = digits;
    setCode(next);
    if (digits && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, key: string) => {
    if (key === 'Backspace' && !code[i] && i > 0) {
      const next = [...code];
      next[i - 1] = '';
      setCode(next);
      refs.current[i - 1]?.focus();
    }
  };

  const complete = code.every(Boolean);
  const verify = () => {
    // "Keep me logged in" will decide whether the auth token is stored once a backend exists.
    store.set({ loggedIn: true, role: 'parent' });
    router.replace('/children');
  };

  return (
    <Screen
      footer={
        <>
          <CheckRow on={keep} onChange={setKeep} label={t('Keep me logged in on this phone')} />
          <Button label={t('Verify')} onPress={verify} disabled={!complete} />
        </>
      }
    >
      <View style={{ paddingHorizontal: 16 }}>
        <BackButton fallback="/login" />
      </View>
      <View style={{ paddingTop: 24, paddingHorizontal: 24, gap: 10 }}>
        <IconTile icon="phone" bg={colors.leafTint} color={colors.leaf} size={64} r={22} iconSize={30} />
        <T d w={800} size={32} lh={36} accessibilityRole="header" style={{ marginTop: 12 }}>
          {t('Check your SMS')}
        </T>
        <T size={15} lh={22} w={600} color={colors.muted}>
          {t('We sent a 6-digit code to')}{' '}
          <T size={15} w={800}>
            {'⁦'}+213 {store.phone}
            {'⁩'}
          </T>
          .{' '}
          <T size={15} w={800} color={colors.coral} onPress={() => router.back()} accessibilityRole="link">
            {t('Change')}
          </T>
        </T>
      </View>

      <View accessibilityLabel={t('Verification code')} style={{ marginTop: 28, paddingHorizontal: 24, flexDirection: 'row', gap: 8, direction: 'ltr' }}>
        {code.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              refs.current[i] = r;
            }}
            accessibilityLabel={t('Digit {{n}}', { n: i + 1 })}
            value={d}
            onChangeText={(v) => onChange(i, v)}
            onKeyPress={(e) => onKey(i, e.nativeEvent.key)}
            onFocus={() => setFocus(i)}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType={i === 0 ? 'oneTimeCode' : 'none'}
            autoComplete={i === 0 ? 'sms-otp' : 'off'}
            maxLength={i === 0 ? LEN : 2}
            selectTextOnFocus
            style={{
              flex: 1,
              minWidth: 0,
              height: 64,
              borderRadius: 18,
              borderWidth: focus === i ? 2.5 : 2,
              borderColor: focus === i ? colors.coral : colors.border,
              backgroundColor: '#FFFFFF',
              textAlign: 'center',
              fontFamily: 'Baloo2_800ExtraBold',
              fontSize: 28,
              color: colors.ink,
            }}
          />
        ))}
      </View>

      <View style={{ paddingTop: 20, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T size={14} w={700} color={colors.muted}>
          {t('Didn’t get it?')}
        </T>
        {left > 0 ? (
          <Pill label={t('Resend in {{time}}', { time: `0:${String(left).padStart(2, '0')}` })} bg={colors.sand} fg={colors.muted} size={14} px={14} py={8} />
        ) : (
          <Tap
            onPress={() => {
              setLeft(RESEND);
              store.toast(t('A new code is on its way'));
            }}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.coralTint, minHeight: 40, justifyContent: 'center' }}
          >
            <T size={14} w={800} color={colors.coralDark}>
              {t('Resend code')}
            </T>
          </Tap>
        )}
      </View>
    </Screen>
  );
}
