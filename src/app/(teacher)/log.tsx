import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { absentKids, classKids, logTypes } from '../../data/mock';
import { Field } from '../../components/Field';
import { Button, Card, Grid, Row, Screen, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';
import { nowHHMM } from '../../utils/format';

const KIDS = classKids.filter((_, i) => !absentKids.includes(i));

// 24 · Log the day — type tabs, multi-select children, options per type, note, save.
export default function LogDay() {
  const { t } = useTranslation();
  const store = useStore();
  const [type, setType] = useState('meal');
  const [opt, setOpt] = useState(3);
  const [sel, setSel] = useState<Record<string, boolean>>({ Ines: true, Lina: true, Meriem: true });
  const [note, setNote] = useState('');
  const q = logTypes.find((x) => x.id === type)!;
  const count = KIDS.filter((k) => sel[k]).length;
  const all = count === KIDS.length;

  const save = () => {
    store.toast(t('Saved for {{n}} children — parents can see it now.', { n: count }));
    setNote('');
    router.navigate('/checkin');
  };

  return (
    <Screen bg={colors.groundTeacher} inTabs footer={<Button variant="teacher" label={t('Save for {{n}} children', { n: count })} onPress={save} disabled={count === 0} />}>
      <View style={{ paddingHorizontal: 20 }}>
        <T size={13} w={800} color={colors.skyText} upper>
          {t('Teacher mode')} · {nowHHMM()}
        </T>
        <T d w={800} size={26} accessibilityRole="header">
          {t('Log for the class')}
        </T>
      </View>

      <View accessibilityRole="tablist" accessibilityLabel={t('What to log')} style={{ marginTop: 14, marginHorizontal: 20 }}>
        <Grid cols={5} gap={8}>
          {logTypes.map((x) => {
            const on = x.id === type;
            return (
              <Tap
                key={x.id}
                role="tab"
                accessibilityState={{ selected: on }}
                label={t(x.label)}
                onPress={() => {
                  setType(x.id);
                  setOpt(0);
                }}
                style={{ height: 72, borderRadius: 20, backgroundColor: on ? colors.skyText : '#FFFFFF', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              >
                <T d size={20} lh={22} w={800} color={on ? '#FFFFFF' : colors.ink} center style={{ fontFamily: 'Baloo2_800ExtraBold' }}>
                  {x.glyph}
                </T>
                <T size={12} w={800} color={on ? '#FFFFFF' : colors.ink} center numberOfLines={1}>
                  {t(x.label)}
                </T>
              </Tap>
            );
          })}
        </Grid>
      </View>

      <Card pad={16} style={{ marginTop: 16, marginHorizontal: 20 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <T size={15} w={800}>
            {t('Children · {{n}} selected', { n: count })}
          </T>
          <Tap
            onPress={() => {
              const n: Record<string, boolean> = {};
              if (!all) KIDS.forEach((k) => (n[k] = true));
              setSel(n);
            }}
            style={{ minHeight: 40, justifyContent: 'center' }}
          >
            <T size={13} w={800} color={colors.skyText}>
              {all ? t('Clear') : t('Whole class')}
            </T>
          </Tap>
        </Row>
        <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {KIDS.map((k) => {
            const on = !!sel[k];
            return (
              <Tap
                key={k}
                role="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => setSel({ ...sel, [k]: !on })}
                style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 2, borderColor: on ? colors.skyText : colors.borderTeacher, backgroundColor: on ? colors.skyTint : '#FFFFFF', justifyContent: 'center' }}
              >
                <T size={13} w={800} color={on ? colors.skyDark : colors.ink}>
                  {k}
                </T>
              </Tap>
            );
          })}
        </View>
      </Card>

      <Card pad={16} style={{ marginTop: 12, marginHorizontal: 20 }}>
        <T size={15} w={800} style={{ marginBottom: 10 }}>
          {t(q.question)}
        </T>
        <View accessibilityRole="radiogroup" accessibilityLabel={t(q.question)}>
          <Grid cols={4} gap={8}>
            {q.opts.map((o, i) => {
              const on = i === opt;
              return (
                <Tap key={o} role="radio" accessibilityState={{ checked: on }} onPress={() => setOpt(i)} style={{ minHeight: 52, borderRadius: 16, backgroundColor: on ? colors.leaf : colors.groundTeacher, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                  <T size={13} w={800} color={on ? '#FFFFFF' : colors.ink} center>
                    {t(o)}
                  </T>
                </Tap>
              );
            })}
          </Grid>
        </View>
        <View style={{ marginTop: 14 }}>
          <Field teacher label={t('Note for parents (optional)')} value={note} onChangeText={setNote} multiline placeholder={t('e.g. Chicken couscous and an orange')} />
        </View>
      </Card>
    </Screen>
  );
}
