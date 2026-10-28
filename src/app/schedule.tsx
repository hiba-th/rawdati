import { useState } from 'react';
import { View } from 'react-native';
import { useChild } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { changedDays, slotsFor, weekDays } from '../data/mock';
import { Icon } from '../components/Icon';
import { Grid, Pill, Row, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

const TAG = {
  moved: { bg: colors.sunTint, fg: colors.sunInk, border: colors.sun },
  repl: { bg: colors.skyTint, fg: colors.skyInk, border: colors.photoBlue },
  cancel: { bg: colors.coralTint, fg: colors.coralDark, border: colors.photoCoral },
};

// 12 · Schedule & changes — Sun–Thu picker, timeline slots with Moved / Replacement / New time tags.
export default function Schedule() {
  const { t } = useTranslation();
  const child = useChild();
  const [day, setDay] = useState(3); // Wednesday 28 = today

  return (
    <Screen>
      <ScreenHeader title={t('Schedule')} subtitle={`${child.className} · ${t('week of {{d}}', { d: t('25 Oct') })}`} />

      <Row gap={10} style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 20, backgroundColor: colors.sunTint, paddingVertical: 12, paddingHorizontal: 14 }}>
        <Icon name="swap" color={colors.sunInk} strokeWidth={2.2} />
        <T size={14} w={700} style={{ flex: 1 }}>
          {t('{{n}} changes this week — tap a day to see them.', { n: 2 })}
        </T>
      </Row>

      <View accessibilityRole="tablist" accessibilityLabel={t('Day')} style={{ marginTop: 14, marginHorizontal: 20 }}>
        <Grid cols={5} gap={8}>
          {weekDays.map((d, i) => {
            const on = i === day;
            const changed = changedDays.includes(i);
            return (
              <Tap
                key={d.n}
                role="tab"
                accessibilityState={{ selected: on }}
                label={`${t(d.dow)} ${d.n}${changed ? `, ${t('has changes')}` : ''}`}
                onPress={() => setDay(i)}
                style={{ height: 76, borderRadius: 22, backgroundColor: on ? colors.coral : '#FFFFFF', alignItems: 'center', justifyContent: 'center', gap: 2 }}
              >
                <T size={12} w={800} color={on ? '#FFFFFF' : colors.ink} center>
                  {t(d.dow)}
                </T>
                <T d w={800} size={22} lh={24} color={on ? '#FFFFFF' : colors.ink} center>
                  {d.n}
                </T>
                {changed && <View style={{ position: 'absolute', top: 8, end: 10, width: 11, height: 11, borderRadius: 6, backgroundColor: colors.sun, borderWidth: 2, borderColor: '#FFFFFF' }} />}
              </Tap>
            );
          })}
        </Grid>
      </View>

      <View style={{ marginTop: 16, marginHorizontal: 20, gap: 10 }}>
        {slotsFor(day).map((s) => {
          const tag = s.tag ? TAG[s.tag.kind] : null;
          return (
            <Row key={s.time + s.title} gap={12} align="flex-start">
              <T size={13} w={800} color={colors.muted} style={{ width: 50, paddingTop: 14 }}>
                {s.time}
              </T>
              <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, gap: 4, borderWidth: 2.5, borderColor: tag ? tag.border : '#FFFFFF' }}>
                <Row gap={8}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.dot }} />
                  <T size={15} w={800} style={{ flex: 1 }}>
                    {t(s.title)}
                  </T>
                  {s.tag && tag && <Pill label={t(s.tag.label)} bg={tag.bg} fg={tag.fg} size={11} px={9} py={3} />}
                </Row>
                <T size={13} w={600} color={colors.muted}>
                  {t(s.sub)}
                </T>
              </View>
            </Row>
          );
        })}
      </View>
    </Screen>
  );
}
