import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { ChildAvatar } from '../components/Art';
import { Icon, IconName } from '../components/Icon';
import { BackButton, Button, GlyphTile, IconTile, RadioDot, Screen, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

type Role = 'parent' | 'teacher';

const ROLES: { id: Role; title: string; body: string; perks: { icon: IconName; label: string }[]; accent: string; lip: string; tint: string }[] = [
  {
    id: 'parent',
    title: 'I’m a parent',
    body: 'Follow my child’s day at kindergarten.',
    perks: [
      { icon: 'sun', label: 'Daily report' },
      { icon: 'image', label: 'Photos' },
      { icon: 'card', label: 'Fees' },
    ],
    accent: colors.coral,
    lip: colors.coralSoft,
    tint: colors.coralTint,
  },
  {
    id: 'teacher',
    title: 'I’m a teacher',
    body: 'Check children in and share their day with parents.',
    perks: [
      { icon: 'checkCircle', label: 'Check-in' },
      { icon: 'clipboard', label: 'Log day' },
      { icon: 'camera', label: 'Post' },
    ],
    accent: colors.skyText,
    lip: '#BFD9EC',
    tint: colors.skyTint,
  },
];

// Choose profile — parent or teacher. Sits between Language and Log in.
export default function ChooseRole() {
  const { t } = useTranslation();
  const store = useStore();
  const [role, setRole] = useState<Role>(store.role);
  const current = ROLES.find((r) => r.id === role)!;

  const next = () => {
    // Already signed in with this profile → go straight in.
    if (store.loggedIn && store.role === role) {
      if (router.canDismiss()) router.dismissAll();
      router.replace(role === 'teacher' ? '/checkin' : '/home');
      return;
    }
    // A different profile needs its own sign-in.
    store.set({ role, loggedIn: false });
    router.push('/login');
  };

  return (
    <Screen bg={role === 'teacher' ? colors.groundTeacher : colors.ground} footer={<Button variant={role === 'teacher' ? 'teacher' : 'primary'} label={t('Continue')} onPress={next} />}>
      <View style={{ paddingHorizontal: 24, gap: 8 }}>
        {router.canGoBack() ? <BackButton fallback="/language" /> : <IconTile icon="user" bg={current.tint} color={current.accent} size={56} r={20} iconSize={28} />}
        <T d w={800} size={32} lh={36} accessibilityRole="header" style={{ marginTop: 10 }}>
          {t('Who are you?')}
        </T>
        <T size={15} lh={22} w={600} color={colors.muted}>
          {t('Choose your profile. You can switch later.')}
        </T>
      </View>

      <View accessibilityRole="radiogroup" accessibilityLabel={t('Profile')} style={{ marginTop: 26, paddingHorizontal: 24, gap: 16 }}>
        {ROLES.map((r) => {
          const on = r.id === role;
          return (
            <Tap
              key={r.id}
              role="radio"
              accessibilityState={{ checked: on }}
              label={`${t(r.title)}. ${t(r.body)}`}
              onPress={() => setRole(r.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 28,
                padding: 18,
                gap: 14,
                borderWidth: 2.5,
                borderColor: on ? r.accent : '#FFFFFF',
                boxShadow: on ? `0px 6px 0px ${r.lip}` : '0px 4px 0px #ECE4DA',
                marginBottom: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                {r.id === 'parent' ? (
                  <ChildAvatar kind="girl" tint={r.tint} size={64} r={22} face={52} />
                ) : (
                  <GlyphTile glyph="S" bg={colors.lilacTint} color={colors.lilacDark} size={64} r={22} fontSize={26} />
                )}
                <View style={{ flex: 1, gap: 2 }}>
                  <T d w={800} size={22} lh={24}>
                    {t(r.title)}
                  </T>
                  <T size={13} lh={18} w={700} color={colors.muted}>
                    {t(r.body)}
                  </T>
                </View>
                <RadioDot on={on} size={26} check color={r.accent} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {r.perks.map((p) => (
                  <View key={p.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: on ? r.tint : colors.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 }}>
                    <Icon name={p.icon} size={16} color={on ? r.accent : colors.muted} strokeWidth={2.2} />
                    <T size={12} w={800} color={on ? r.accent : colors.muted}>
                      {t(p.label)}
                    </T>
                  </View>
                ))}
              </View>
            </Tap>
          );
        })}
      </View>
    </Screen>
  );
}
