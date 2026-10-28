import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { pickupPeople, pickupTimes } from '../data/mock';
import { PickupQR } from '../components/Art';
import { Icon } from '../components/Icon';
import { Sheet } from '../components/Sheet';
import { Field } from '../components/Field';
import { Button, Card, Grid, Row, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

// 11 · Pick-up — approved person, time, daily QR + code, summary, confirm.
export default function Pickup() {
  const { t } = useTranslation();
  const store = useStore();
  const child = useChild();
  const [who, setWho] = useState(store.pickup.who);
  const [time, setTime] = useState(store.pickup.time);
  const [other, setOther] = useState<{ name: string; phone: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', phone: '' });

  const person = pickupPeople.find((p) => p.id === who);
  const summary = who === 'other' && other ? `${other.name} · ${time}` : person ? t('{{role}} ({{name}}) at {{time}}', { role: t(person.role), name: person.name, time }) : '';

  return (
    <Screen
      footer={
        <>
          <T size={13} w={700} color={colors.muted} center>
            {t('{{who}} will see:', { who: child.teacher })}{' '}
            <T size={13} w={800}>
              {summary}
            </T>
          </T>
          <Button
            label={t('Confirm pick-up')}
            onPress={() => {
              if (who !== 'other') store.set({ pickup: { who, time } });
              store.toast(t('Pick-up confirmed — {{who}} has been told.', { who: child.teacher }));
              router.back();
            }}
          />
        </>
      }
    >
      <ScreenHeader title={t('Who’s picking up {{name}}?', { name: child.name })} />

      <View accessibilityRole="radiogroup" accessibilityLabel={t('Person picking up')} style={{ marginTop: 18, marginHorizontal: 20 }}>
        <Grid cols={3} gap={10}>
          {pickupPeople.map((p) => {
            const on = p.id === who;
            return (
              <Tap
                key={p.id}
                role="radio"
                accessibilityState={{ checked: on }}
                label={`${t(p.role)}, ${p.name}`}
                onPress={() => setWho(p.id)}
                style={{ backgroundColor: '#FFFFFF', borderWidth: 2.5, borderColor: on ? colors.coral : '#FFFFFF', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 6, alignItems: 'center', gap: 6 }}
              >
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: p.tint, alignItems: 'center', justifyContent: 'center' }}>
                  <T d w={800} size={20} center>
                    {p.init}
                  </T>
                </View>
                <T size={14} w={800} center>
                  {t(p.role)}
                </T>
                <T size={12} w={700} color={colors.muted} center>
                  {p.name}
                </T>
              </Tap>
            );
          })}
        </Grid>
      </View>

      <Tap
        onPress={() => setAdding(true)}
        style={{
          marginTop: 10,
          marginHorizontal: 20,
          minHeight: 48,
          borderRadius: 18,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: who === 'other' ? colors.coral : colors.dashed,
          backgroundColor: who === 'other' ? colors.coralTint : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Icon name={who === 'other' ? 'check' : 'plus'} size={18} color={colors.coral} strokeWidth={2.4} />
        <T size={14} w={800} color={colors.coral}>
          {who === 'other' && other ? t('Just this once: {{name}}', { name: other.name }) : t('Someone else, just this once')}
        </T>
      </Tap>

      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <T size={15} w={800} style={{ marginBottom: 10 }}>
          {t('Pick-up time')}
        </T>
        <View accessibilityRole="radiogroup" accessibilityLabel={t('Pick-up time')} style={{ flexDirection: 'row', gap: 8 }}>
          {pickupTimes.map((tm) => {
            const on = tm === time;
            return (
              <Tap key={tm} role="radio" accessibilityState={{ checked: on }} onPress={() => setTime(tm)} style={{ flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: on ? colors.ink : '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                <T size={15} w={800} color={on ? '#FFFFFF' : colors.ink} center>
                  {tm}
                </T>
              </Tap>
            );
          })}
        </View>
      </View>

      <Card style={{ marginTop: 20, marginHorizontal: 20, borderRadius: 28, flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <View accessible accessibilityRole="image" accessibilityLabel={t('Pick-up QR code')} style={{ width: 112, height: 112, borderRadius: 16, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
          <PickupQR size={112} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <T size={12} w={800} color={colors.muted} upper>
            {t('Today’s pick-up code')}
          </T>
          <T d w={800} size={34} lh={36} ls={4} style={{ fontFamily: 'Baloo2_800ExtraBold' }}>
            4821
          </T>
          <T size={13} w={600} color={colors.muted}>
            {t('Show this at the gate. It changes every day.')}
          </T>
        </View>
      </Card>

      <Sheet visible={adding} onClose={() => setAdding(false)} title={t('Someone else, just this once')}>
        <T size={14} lh={21} w={600} color={colors.muted}>
          {t('They must show ID and today’s code at the gate.')}
        </T>
        <Field label={t('Full name')} value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} active />
        <Field label={t('Phone number')} value={draft.phone} onChangeText={(phone) => setDraft({ ...draft, phone })} keyboardType="phone-pad" />
        <Button
          label={t('Add for today')}
          disabled={draft.name.trim().length < 2}
          onPress={() => {
            setOther(draft);
            setWho('other');
            setAdding(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}
