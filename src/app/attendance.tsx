import { useState } from 'react';
import { View } from 'react-native';
import { useChild, useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { attendanceLog, DayStatus, octoberAttendance } from '../data/mock';
import { Sheet } from '../components/Sheet';
import { Field } from '../components/Field';
import { Button, Card, CircleButton, Divider, Grid, Pill, Row, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STYLE: Record<DayStatus, { bg: string; fg: string; border?: string }> = {
  present: { bg: colors.leaf, fg: '#FFFFFF' },
  late: { bg: colors.sun, fg: colors.ink },
  absent: { bg: colors.coral, fg: '#FFFFFF' },
  weekend: { bg: colors.line, fg: colors.disabledDark },
  future: { bg: '#FFFFFF', fg: colors.disabled, border: colors.line },
};
const PILL = {
  present: { label: 'Present', bg: colors.leafTint, fg: colors.leafDark },
  late: { label: 'Late', bg: colors.sunTint, fg: colors.sunInk },
  absent: { label: 'Absent', bg: colors.coralTint, fg: colors.coralDark },
};
const REASONS = ['Sick', 'Family reason', 'Appointment', 'Other'];

// 10 · Attendance — today IN/OUT, month calendar, legend, log, report an absence.
export default function Attendance() {
  const { t } = useTranslation();
  const child = useChild();
  const store = useStore();
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [from, setFrom] = useState('Thu 29 Oct');
  const [to, setTo] = useState('Thu 29 Oct');
  const [note, setNote] = useState('');
  const days = octoberAttendance();
  const count = (s: DayStatus) => days.filter((d) => d.status === s).length;
  // October 2026 starts on Thursday → 4 empty cells (Sun–Wed)
  const cells: (typeof days[number] | null)[] = [null, null, null, null, ...days];

  return (
    <Screen footer={<Button variant="outline" icon="calendarX" label={t('Report an absence')} onPress={() => setReporting(true)} />}>
      <ScreenHeader title={t('Attendance')} />

      <Grid cols={2} gap={10} style={{ marginTop: 16, marginHorizontal: 20 }}>
        <View style={{ backgroundColor: colors.leaf, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16 }}>
          <T size={12} w={800} color="#CDEBD9" upper>
            {t('Today · in')}
          </T>
          <T d w={800} size={28} lh={30} color="#FFFFFF">
            {child.arrivedAt ?? '— —'}
          </T>
          <T size={12} w={700} color="#E3F5EA">
            {t('by {{who}}', { who: child.teacher })}
          </T>
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16 }}>
          <T size={12} w={800} color={colors.muted} upper>
            {t('Today · out')}
          </T>
          <T d w={800} size={28} lh={30} color={colors.disabled}>
            — —
          </T>
          <T size={12} w={700} color={colors.muted}>
            {t('Expected {{time}}', { time: store.pickup.time })}
          </T>
        </View>
      </Grid>

      <Card style={{ marginTop: 14, marginHorizontal: 20, borderRadius: 28 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <CircleButton icon="back" label={t('Previous month')} size={44} iconSize={20} bg={colors.ground} onPress={() => store.toast(t('Only this school year’s months are shown.'))} />
          <T d w={800} size={20} accessibilityRole="header">
            {t('October')} 2026
          </T>
          <CircleButton icon="chevron" label={t('Next month')} size={44} iconSize={20} bg={colors.ground} disabled color={colors.disabled} />
        </Row>
        <View style={{ marginTop: 12 }}>
          <Grid cols={7} gap={6}>
            {DOW.map((d, i) => (
              <T key={d} size={12} w={800} center color={i >= 5 ? colors.disabledDark : colors.muted}>
                {t(d)}
              </T>
            ))}
          </Grid>
          <Grid cols={7} gap={6} style={{ marginTop: 6 }}>
            {cells.map((c, i) => {
              if (!c) return <View key={`e${i}`} style={{ height: 38 }} />;
              const s = STYLE[c.status];
              return (
                <View
                  key={c.day}
                  accessible
                  accessibilityLabel={`${c.day} ${t('October')}, ${t(c.status === 'future' ? 'upcoming' : c.status)}${c.today ? `, ${t('today')}` : ''}`}
                  style={{
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: s.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: c.today ? 3 : s.border ? 1.5 : 0,
                    borderColor: c.today ? colors.ink : s.border,
                  }}
                >
                  <T size={14} w={800} color={s.fg} center>
                    {c.day}
                  </T>
                </View>
              );
            })}
          </Grid>
        </View>
        <View style={{ marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {[
            [colors.leaf, `${t('Present')} ${count('present')}`],
            [colors.sun, `${t('Late')} ${count('late')}`],
            [colors.coral, `${t('Absent')} ${count('absent')}`],
            [colors.line, t('Weekend')],
          ].map(([c, l]) => (
            <Row key={l} gap={6}>
              <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: c }} />
              <T size={12} w={700} color={colors.muted}>
                {l}
              </T>
            </Row>
          ))}
        </View>
      </Card>

      <Card pad={0} style={{ marginTop: 14, marginHorizontal: 20, paddingVertical: 6, paddingHorizontal: 16 }}>
        {attendanceLog.map((r, i) => {
          const p = PILL[r.status];
          return (
            <View key={r.day}>
              {i > 0 && <Divider />}
              <Row style={{ paddingVertical: 12 }}>
                <T size={13} w={800} style={{ width: 56 }}>
                  {t(r.day)}
                </T>
                <T size={14} w={700} style={{ flex: 1 }}>
                  {t(r.text)}
                </T>
                <Pill label={t(p.label)} bg={p.bg} fg={p.fg} />
              </Row>
            </View>
          );
        })}
      </Card>

      <Sheet visible={reporting} onClose={() => setReporting(false)} title={t('Report an absence')}>
        <T size={14} w={800}>
          {t('Reason')}
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {REASONS.map((r) => {
            const on = r === reason;
            return (
              <Tap key={r} role="radio" accessibilityState={{ checked: on }} onPress={() => setReason(r)} style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, backgroundColor: on ? colors.ink : '#FFFFFF', justifyContent: 'center' }}>
                <T size={14} w={800} color={on ? '#FFFFFF' : colors.ink}>
                  {t(r)}
                </T>
              </Tap>
            );
          })}
        </View>
        <Grid cols={2} gap={10}>
          <Field label={t('From')} value={t(from)} onChangeText={setFrom} />
          <Field label={t('To')} value={t(to)} onChangeText={setTo} />
        </Grid>
        <Field label={t('Note for the teacher (optional)')} value={note} onChangeText={setNote} multiline placeholder={t('e.g. Fever since last night')} />
        <Button
          label={t('Send to {{who}}', { who: child.teacher })}
          onPress={() => {
            setReporting(false);
            store.toast(t('Absence reported — {{who}} has been told.', { who: child.teacher }));
          }}
        />
      </Sheet>
    </Screen>
  );
}
