import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { dayActivities, meals } from '../../data/mock';
import { HappyFace } from '../../components/Art';
import { Icon } from '../../components/Icon';
import { Card, CircleButton, GlyphTile, Grid, IconTile, MealMeter, Pill, Row, Screen, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';

const DAYS = ['Today, Wed 28 Oct', 'Tue 27 Oct', 'Mon 26 Oct', 'Sun 25 Oct'];

// 08 · Daily report — mood, meals, nap & toilet, activities, teacher note, reminder.
export default function DailyReport() {
  const { t } = useTranslation();
  const child = useChild();
  const store = useStore();
  const [dayIdx, setDayIdx] = useState(0);
  const isToday = dayIdx === 0;
  // latest note the teacher sent today to this child's family (or to every family)
  const newNote = isToday ? store.notes.find((n) => n.to === child.name || n.to === 'all') : undefined;

  return (
    <Screen inTabs>
      <Row style={{ paddingHorizontal: 20, justifyContent: 'space-between' }}>
        <CircleButton icon="back" label={t('Previous day')} onPress={() => setDayIdx((d) => Math.min(DAYS.length - 1, d + 1))} disabled={dayIdx === DAYS.length - 1} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <T d w={800} size={22} lh={24} center accessibilityRole="header">
            {t('{{name}}’s day', { name: child.name })}
          </T>
          <T size={13} w={700} color={colors.muted} center>
            {t(DAYS[dayIdx])}
          </T>
        </View>
        <CircleButton
          icon="chevron"
          label={t('Next day')}
          onPress={() => setDayIdx((d) => Math.max(0, d - 1))}
          disabled={isToday}
          bg={isToday ? colors.sand : '#FFFFFF'}
          color={isToday ? colors.disabled : colors.ink}
        />
      </Row>

      {/* mood */}
      <Row gap={16} style={{ marginTop: 18, marginHorizontal: 20, borderRadius: 28, backgroundColor: colors.sunBright, padding: 18 }}>
        <HappyFace size={72} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={12} w={800} ls={1} color={colors.sunInkDark} upper>
            {t('Mood today')}
          </T>
          <T d w={800} size={24} lh={26}>
            {t('Happy & playful')}
          </T>
          <T size={13} w={700} color={colors.sunInkDark}>
            {t('A little tired after lunch')}
          </T>
        </View>
      </Row>

      {/* meals */}
      <Card style={{ marginTop: 14, marginHorizontal: 20 }}>
        <Row gap={8} style={{ marginBottom: 12 }}>
          <IconTile icon="bowl" bg={colors.sunTint} color={colors.sunInk} size={32} r={12} iconSize={18} strokeWidth={2.2} />
          <T d w={800} size={19} accessibilityRole="header">
            {t('Meals')}
          </T>
        </Row>
        <View style={{ gap: 12 }}>
          {meals.map((m) => {
            // goûter hasn't happened yet today; on past days it was eaten
            const later = m.level === null && isToday;
            return (
              <Row key={m.name}>
                <View style={{ width: 92 }}>
                  <T size={14} w={800}>
                    {t(m.name)}
                  </T>
                  <T size={12} w={700} color={colors.muted}>
                    {m.time}
                  </T>
                </View>
                <T size={13} w={600} color={colors.muted} style={{ flex: 1 }}>
                  {later ? t('Not yet') : m.level === null ? t('Bread and dates') : t(m.food)}
                </T>
                {later ? <Pill label={t('Later')} bg={colors.line} fg={colors.muted} py={3} px={9} /> : <MealMeter level={m.level ?? 3} />}
              </Row>
            );
          })}
        </View>
        <T size={12} w={700} color={colors.muted} style={{ marginTop: 12 }}>
          {t('Squares show how much she ate: none · some · most · all.')}
        </T>
      </Card>

      {/* nap + toilet */}
      <Grid cols={2} gap={12} style={{ marginTop: 14, marginHorizontal: 20 }}>
        <Card pad={16} style={{ gap: 6 }}>
          <IconTile icon="moon" bg={colors.skyTint} color={colors.skyText} size={36} r={12} strokeWidth={2.2} />
          <T size={14} w={800} style={{ marginTop: 4 }}>
            {t('Nap')}
          </T>
          <T d w={800} size={26} lh={28}>
            1h 20
          </T>
          <T size={12} w={700} color={colors.muted}>
            13:05 – 14:25 · {t('slept well')}
          </T>
        </Card>
        <Card pad={16} style={{ gap: 6 }}>
          <IconTile icon="drop" bg={colors.leafTint} color={colors.leaf} size={36} r={12} strokeWidth={2.2} />
          <T size={14} w={800} style={{ marginTop: 4 }}>
            {t('Toilet')}
          </T>
          <T d w={800} size={26} lh={28}>
            {t('{{n}} times', { n: 3 })}
          </T>
          <T size={12} w={700} color={colors.muted}>
            {t('All normal · used the potty')}
          </T>
        </Card>
      </Grid>

      {/* activities */}
      <Card style={{ marginTop: 14, marginHorizontal: 20 }}>
        <T d w={800} size={19} style={{ marginBottom: 12 }} accessibilityRole="header">
          {t('Activities')}
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {dayActivities.map((a) => (
            <Pill key={a.label} label={t(a.label)} bg={a.bg} fg={a.fg} size={13} px={12} py={8} />
          ))}
        </View>
      </Card>

      {/* teacher note */}
      <Card style={{ marginTop: 14, marginHorizontal: 20, gap: 10 }}>
        <Row gap={10}>
          <GlyphTile glyph="S" bg={colors.lilacTint} color={colors.lilacDark} size={40} round fontSize={16} />
          <View>
            <T size={14} w={800}>
              {t('Note from {{who}}', { who: child.teacher })}
            </T>
            <T size={12} w={700} color={colors.muted}>
              {newNote ? `${newNote.time} · ${t('New')}` : '14:40'}
            </T>
          </View>
        </Row>
        <T size={15} lh={22} w={600}>
          {newNote ? newNote.text : t('Ines shared her crayons with Lina today without being asked. She’s proud of her sun painting — ask her about it tonight!')}
        </T>
        <Tap role="link" onPress={() => router.push('/messages')} style={{ alignSelf: 'flex-start', paddingVertical: 8, minHeight: 44, justifyContent: 'center' }}>
          <T size={14} w={800} color={colors.coral}>
            {t('Reply to {{who}}', { who: child.teacher })}
          </T>
        </Tap>
      </Card>

      {/* reminder */}
      {isToday && (
        <Row style={{ marginTop: 14, marginHorizontal: 20, borderRadius: 22, backgroundColor: store.reminderAck ? colors.leafTint : colors.coralTint, paddingVertical: 14, paddingHorizontal: 16 }}>
          <Icon name={store.reminderAck ? 'check' : 'shirt'} size={24} color={store.reminderAck ? colors.leafDark : colors.coralDark} />
          <T size={14} w={700} style={{ flex: 1 }}>
            {t('Please bring')}{' '}
            <T size={14} w={800}>
              {t('spare clothes')}
            </T>{' '}
            {t('tomorrow.')}
          </T>
          {store.reminderAck ? (
            <T size={13} w={800} color={colors.leafDark}>
              {t('Noted ✓')}
            </T>
          ) : (
            <Tap onPress={() => store.set({ reminderAck: true })} style={{ minHeight: 40, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
              <T size={13} w={800} color={colors.coralDark}>
                {t('Got it')}
              </T>
            </Tap>
          )}
        </Row>
      )}
    </Screen>
  );
}
