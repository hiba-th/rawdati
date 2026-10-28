import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { SchoolDoor } from '../components/Art';
import { Button, CircleButton, InfoNote, T, Tap, goBack } from '../components/ui';
import { colors } from '../theme/tokens';
import { formatPhone } from '../utils/format';

// 04 · Log in — +213 prefix, phone "5XX XX XX XX", Send code; teacher entry link.
export default function Login() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [phone, setPhone] = useState(store.phone);
  const [focused, setFocused] = useState(false);
  const teacher = store.role === 'teacher';
  const digits = phone.replace(/\D/g, '');
  const valid = digits.length === 9 && /^[567]/.test(digits);

  const send = () => {
    store.set({ phone });
    router.push('/verify');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ground }}>
      <View style={{ height: 230 + insets.top, backgroundColor: colors.sunBright, borderBottomLeftRadius: 48, borderBottomRightRadius: 48, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
        <View style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: colors.sunLight, right: -60, top: -40 }} />
        <View style={{ position: 'absolute', start: 16, top: Math.max(48, insets.top + 6) }}>
          <CircleButton icon="back" label={t('Back')} bg="rgba(255,255,255,0.7)" onPress={() => goBack('/role')} />
        </View>
        <SchoolDoor width={160} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ paddingTop: 28, paddingHorizontal: 24, gap: 8 }}>
          <T d w={800} size={32} lh={36} accessibilityRole="header">
            {teacher ? t('Welcome, teacher!') : t('Welcome, maman!')}
          </T>
          <T size={15} lh={22} w={600} color={colors.muted}>
            {teacher ? t('Log in with the phone number your kindergarten registered for you.') : t('Log in with the phone number you gave the kindergarten.')}
          </T>
        </View>

        <View style={{ paddingTop: 22, paddingHorizontal: 24, gap: 10 }}>
          <T size={14} w={800}>
            {t('Phone number')}
          </T>
          {/* Phone numbers always read left-to-right, even in Arabic. */}
          <View style={{ flexDirection: 'row', gap: 10, direction: 'ltr' }}>
            <View style={{ height: 58, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View accessibilityElementsHidden style={{ width: 22, height: 16, borderRadius: 3, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flex: 1, backgroundColor: colors.leaf }} />
                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
              </View>
              <T size={16} w={800} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                +213
              </T>
            </View>
            <TextInput
              accessibilityLabel={t('Phone number')}
              value={phone}
              onChangeText={(v) => setPhone(formatPhone(v))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="phone-pad"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="5XX XX XX XX"
              placeholderTextColor={colors.disabled}
              maxLength={12}
              style={{
                flex: 1,
                minWidth: 0,
                height: 58,
                paddingHorizontal: 16,
                borderRadius: 18,
                backgroundColor: '#FFFFFF',
                borderWidth: 2.5,
                borderColor: focused || phone ? colors.coral : colors.border,
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 18,
                letterSpacing: 1,
                color: colors.ink,
                textAlign: 'left',
              }}
            />
          </View>
          <T size={13} w={600} color={colors.muted}>
            {t('We’ll send you a 6-digit code by SMS.')}
          </T>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 40 + insets.bottom, gap: 16, alignItems: 'center' }}>
        <Button variant={teacher ? 'teacher' : 'primary'} label={t('Send code')} onPress={send} disabled={!valid} style={{ alignSelf: 'stretch' }} />
        <View style={{ alignSelf: 'stretch' }}>
          <InfoNote text={t('Not registered yet? Ask your kindergarten to add your number.')} />
        </View>
        <Tap role="link" onPress={() => router.push('/role')} style={{ paddingVertical: 6, paddingHorizontal: 12, minHeight: 44, justifyContent: 'center' }}>
          <T size={15} w={800} color={teacher ? colors.skyText : colors.coral}>
            {teacher ? t('I’m a parent — change profile') : t('I work at a kindergarten')}
          </T>
        </Tap>
      </View>
    </View>
  );
}
