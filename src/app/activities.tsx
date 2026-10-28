import { View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { activities } from '../data/mock';
import { GlyphTile, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';
import { formatDA } from '../utils/format';

// 17 · Extra activities — Enrol / Enrolled / Waitlist, sticky monthly total.
export default function Activities() {
  const { t } = useTranslation();
  const store = useStore();
  const child = useChild();
  const DA = t('DA');
  const total = activities.filter((a) => store.enrolled[a.id]).reduce((s, a) => s + a.price, 0);

  return (
    <Screen
      footer={
        <View style={{ backgroundColor: colors.ink, borderRadius: 26, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T size={12} w={800} color="#C9CBE0" upper>
              {t('Added to monthly fees')}
            </T>
            <T d w={800} size={22} color="#FFFFFF">
              +{t('{{amount}} / month', { amount: formatDA(total, DA) })}
            </T>
          </View>
          <Tap role="link" onPress={() => router.push('/fees')} style={{ backgroundColor: colors.sun, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 16 }}>
            <T size={14} w={800}>
              {t('View fees')}
            </T>
          </Tap>
        </View>
      }
    >
      <ScreenHeader title={t('Extra activities')} subtitle={t('For {{name}} · ages 3–5', { name: child.name })} />

      <View style={{ marginTop: 16, marginHorizontal: 20, gap: 12 }}>
        {activities.map((a) => {
          const sel = !!store.enrolled[a.id];
          const full = a.left === 0 && !sel;
          const waiting = full && store.enrolled[`wait:${a.id}`];
          const spots = full ? (waiting ? t('On the waitlist') : t('Full — join waitlist')) : sel ? t('Enrolled') : t('{{n}} places left', { n: a.left });
          const spotsInk = full ? colors.coralDark : sel ? colors.leafDark : colors.muted;
          const cta = sel ? t('Enrolled') : full ? (waiting ? t('Waiting') : t('Waitlist')) : t('Enrol');
          const toggle = () => {
            if (full) store.set({ enrolled: { ...store.enrolled, [`wait:${a.id}`]: !waiting } });
            else store.set({ enrolled: { ...store.enrolled, [a.id]: !sel } });
          };
          return (
            <View key={a.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 26, padding: 14, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              <GlyphTile glyph={a.glyph} bg={a.tint} color={a.ink} size={64} r={20} fontSize={26} />
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <T size={16} w={800}>
                  {t(a.name)}
                </T>
                <T size={13} w={700} color={colors.muted}>
                  {t(a.when)}
                </T>
                <T size={13} w={800}>
                  {formatDA(a.price, DA)}/{t('mo')}{' '}
                  <T size={13} w={700} color={spotsInk}>
                    · {spots}
                  </T>
                </T>
              </View>
              <Tap
                onPress={toggle}
                accessibilityState={{ selected: sel || !!waiting }}
                label={(sel ? t('Leave {{name}}', { name: t(a.name) }) : t('Enrol in {{name}}', { name: t(a.name) })) as string}
                style={{
                  minWidth: 88,
                  minHeight: 44,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  borderWidth: full && !waiting ? 2 : 0,
                  borderColor: '#E3D8CC',
                  backgroundColor: sel || waiting ? colors.leafTint : full ? '#FFFFFF' : colors.coral,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <T size={14} w={800} center color={sel || waiting ? colors.leafDark : full ? colors.ink : '#FFFFFF'}>
                  {cta}
                </T>
              </Tap>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
