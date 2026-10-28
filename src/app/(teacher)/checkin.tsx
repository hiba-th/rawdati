import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { absentKids, classKids } from '../../data/mock';
import { CircleButton, GlyphTile, Grid, Row, Screen, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';
import { nowHHMM } from '../../utils/format';

const TINTS = [colors.coralTint, colors.skyTint, colors.sunTint, colors.lilacTint];

// 23 · Teacher check-in — tap a child to mark arrived (parents get an alert), tap again to undo.
export default function CheckIn() {
  const { t } = useTranslation();
  const store = useStore();
  const inn = store.checkins;
  const inCount = Object.keys(inn).length;
  const expected = classKids.length - absentKids.length - inCount;

  const tap = (i: number) => {
    if (absentKids.includes(i)) return;
    const next = { ...inn };
    if (next[i]) delete next[i];
    else {
      next[i] = nowHHMM();
      store.toast(t('{{name}}’s parents were notified', { name: classKids[i] }));
    }
    store.set({ checkins: next });
  };

  return (
    <Screen bg={colors.groundTeacher} inTabs>
      <TeacherHeader title="Les Papillons" />

      <Grid cols={3} gap={10} style={{ marginTop: 16, marginHorizontal: 20 }}>
        <Counter n={inCount} label={t('Arrived')} dark />
        <Counter n={expected} label={t('Expected')} />
        <Counter n={absentKids.length} label={t('Absent')} />
      </Grid>

      <T size={14} w={700} color={colors.muted} style={{ marginTop: 16, marginBottom: 8, marginHorizontal: 20 }}>
        {t('Tap a child when they arrive — their parents are notified straight away.')}
      </T>
      <Grid cols={4} gap={10} style={{ marginHorizontal: 20 }}>
        {classKids.map((name, i) => {
          const time = inn[i];
          const ab = absentKids.includes(i);
          return (
            <Tap
              key={name}
              onPress={() => tap(i)}
              disabled={ab}
              accessibilityState={{ selected: !!time, disabled: ab }}
              label={`${name}, ${ab ? t('absent today') : time ? t('arrived at {{time}}', { time }) : t('not arrived yet')}`}
              style={{ backgroundColor: '#FFFFFF', borderWidth: 2.5, borderColor: time ? colors.leaf : '#FFFFFF', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center', gap: 4, opacity: ab ? 0.55 : 1 }}
            >
              <GlyphTile glyph={time ? '✓' : name[0]} bg={time ? colors.leaf : TINTS[i % 4]} color={time ? '#FFFFFF' : colors.ink} size={46} round />
              <T size={12} w={800} center numberOfLines={1}>
                {name}
              </T>
              <T size={11} w={700} center color={ab ? colors.coralDark : time ? colors.leafDark : colors.muted}>
                {ab ? t('Absent') : time ? time : t('Waiting')}
              </T>
            </Tap>
          );
        })}
      </Grid>
    </Screen>
  );
}

function Counter({ n, label, dark }: { n: number; label: string; dark?: boolean }) {
  return (
    <View style={{ backgroundColor: dark ? colors.leaf : '#FFFFFF', borderRadius: 22, paddingVertical: 12, paddingHorizontal: 14 }}>
      <T d w={800} size={28} lh={30} color={dark ? '#FFFFFF' : colors.ink}>
        {n}
      </T>
      <T size={12} w={800} color={dark ? '#E3F5EA' : colors.muted}>
        {label}
      </T>
    </View>
  );
}

function TeacherHeader({ title, overline }: { title: string; overline?: string }) {
  const { t } = useTranslation();
  const store = useStore();
  return (
    <Row style={{ paddingHorizontal: 20 }}>
      <GlyphTile glyph="S" bg={colors.lilacTint} color={colors.lilacDark} size={48} round fontSize={20} />
      <View style={{ flex: 1 }}>
        <T size={13} w={800} color={colors.skyText} upper>
          {overline ?? t('Teacher mode')}
        </T>
        <T d w={800} size={24} lh={26} accessibilityRole="header">
          {title}
        </T>
      </View>
      <CircleButton
        icon="logout"
        label={t('Switch account')}
        strokeWidth={2}
        onPress={() => {
          store.logOut();
          router.replace('/login');
        }}
      />
    </Row>
  );
}
