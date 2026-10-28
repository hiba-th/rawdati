import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../../store/AppStore';
import { useLang, useTranslation } from '../../i18n';
import { activities, pickupPeople } from '../../data/mock';
import { ChildAvatar } from '../../components/Art';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import { Field } from '../../components/Field';
import { Button, Card, Divider, Pill, Row, Screen, T, Tap, Toggle } from '../../components/ui';
import { colors } from '../../theme/tokens';

const LANG_NAMES = { ar: 'العربية', fr: 'Français', en: 'English', tzm: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' } as const;

const TOGGLES: [string, string][] = [
  ['arr', 'Arrival & pick-up'],
  ['rep', 'Daily report'],
  ['pho', 'New photos'],
  ['fee', 'Fee reminders'],
];

// 22 · Child profile & settings.
export default function Me() {
  const { t } = useTranslation();
  const lang = useLang();
  const store = useStore();
  const child = useChild();
  const [editing, setEditing] = useState(false);
  const [health, setHealth] = useState({ allergies: 'Peanuts — severe', medication: 'None', doctor: '[DOCTOR NAME · PHONE]', contacts: 'Amel, Karim' });
  const [draft, setDraft] = useState(health);
  const enrolled = activities.filter((a) => store.enrolled[a.id]).map((a) => t(a.name));

  // Changing profile signs out: a teacher account logs in with its own number.
  const changeProfile = () => {
    store.logOut();
    router.replace('/role');
  };

  const links: { label: string; value?: string; href?: string; onPress?: () => void }[] = [
    { label: 'Approved pick-up people', value: String(pickupPeople.length), href: '/pickup' },
    { label: 'Extra activities', value: enrolled.join(', ') || t('None'), href: '/activities' },
    { label: 'Language', value: LANG_NAMES[lang], href: '/language' },
    { label: 'Change profile', value: t('Parent'), onPress: changeProfile },
    { label: 'Help & contact the kindergarten', href: '/messages' },
  ];

  const rows: [string, keyof typeof health][] = [
    ['Medication', 'medication'],
    ['Family doctor', 'doctor'],
    ['Emergency contacts', 'contacts'],
  ];

  return (
    <Screen inTabs>
      <Row gap={14} style={{ marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 30, padding: 18 }}>
        <ChildAvatar kind={child.avatar} tint={child.tint} />
        <View style={{ flex: 1 }}>
          <T d w={800} size={24} lh={26} accessibilityRole="header">
            {child.fullName}
          </T>
          <T size={13} w={700} color={colors.muted}>
            {t('{{n}} yrs', { n: child.age })} · {child.className} · {child.teacher}
          </T>
        </View>
        <Tap onPress={() => router.push({ pathname: '/children', params: { switching: '1' } })} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.ground, justifyContent: 'center' }}>
          <T size={13} w={800}>
            {t('Switch')}
          </T>
        </Tap>
      </Row>

      <Card pad={0} style={{ marginTop: 14, marginHorizontal: 20, paddingVertical: 16, paddingHorizontal: 18, gap: 12 }}>
        <T d w={800} size={19} accessibilityRole="header">
          {t('Health & safety')}
        </T>
        <Row style={{ justifyContent: 'space-between' }}>
          <T size={14} w={700} color={colors.muted}>
            {t('Allergies')}
          </T>
          <Pill label={t(health.allergies)} bg={colors.coralTint} fg={colors.coralDark} size={13} px={12} py={5} />
        </Row>
        {rows.map(([label, key]) => (
          <Row key={key} style={{ justifyContent: 'space-between' }}>
            <T size={14} w={700} color={colors.muted}>
              {t(label)}
            </T>
            <T size={14} w={800} style={{ flexShrink: 1, textAlign: 'right' }}>
              {t(health[key])}
            </T>
          </Row>
        ))}
        <Tap
          onPress={() => {
            setDraft(health);
            setEditing(true);
          }}
          style={{ alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: 16, borderRadius: 999, borderWidth: 2, borderColor: colors.coralSoft, backgroundColor: '#FFFFFF', justifyContent: 'center' }}
        >
          <T size={14} w={800} color={colors.coralDark}>
            {t('Edit health info')}
          </T>
        </Tap>
      </Card>

      <Card pad={0} style={{ marginTop: 14, marginHorizontal: 20, paddingVertical: 4, paddingHorizontal: 16 }}>
        {links.map((l, i) => (
          <View key={l.label}>
            {i > 0 && <Divider />}
            <Tap role={l.onPress ? 'button' : 'link'} onPress={l.onPress ?? (() => router.push(l.href as never))} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 }}>
              <T size={15} w={800} style={{ flex: 1 }}>
                {t(l.label)}
              </T>
              {l.value && (
                <T size={13} w={800} color={colors.muted} numberOfLines={1} style={{ maxWidth: 120 }}>
                  {l.value}
                </T>
              )}
              <Icon name="chevron" size={18} strokeWidth={2.4} />
            </Tap>
          </View>
        ))}
      </Card>

      <Card pad={0} style={{ marginTop: 14, marginHorizontal: 20, paddingVertical: 8, paddingHorizontal: 16 }}>
        <T d w={800} size={19} style={{ marginTop: 8, marginBottom: 4 }} accessibilityRole="header">
          {t('Notify me about')}
        </T>
        {TOGGLES.map(([id, label]) => (
          <Row key={id} style={{ minHeight: 52 }}>
            <T size={15} w={700} style={{ flex: 1 }}>
              {t(label)}
            </T>
            <Toggle label={t(label)} value={!!store.notifPrefs[id]} onChange={(v) => store.set({ notifPrefs: { ...store.notifPrefs, [id]: v } })} />
          </Row>
        ))}
      </Card>

      <Tap
        onPress={() => {
          store.logOut();
          router.replace('/login');
        }}
        style={{ marginTop: 14, marginHorizontal: 20, minHeight: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
      >
        <T size={15} w={800} color={colors.coralDark}>
          {t('Log out')}
        </T>
      </Tap>

      <Sheet visible={editing} onClose={() => setEditing(false)} title={t('Health & safety')}>
        <Field label={t('Allergies')} value={t(draft.allergies)} onChangeText={(v) => setDraft({ ...draft, allergies: v })} />
        <Field label={t('Medication')} value={t(draft.medication)} onChangeText={(v) => setDraft({ ...draft, medication: v })} />
        <Field label={t('Family doctor')} value={draft.doctor} onChangeText={(v) => setDraft({ ...draft, doctor: v })} />
        <Field label={t('Emergency contacts')} value={draft.contacts} onChangeText={(v) => setDraft({ ...draft, contacts: v })} />
        <Button
          label={t('Save')}
          onPress={() => {
            setHealth(draft);
            setEditing(false);
            store.toast(t('Saved — the kindergarten can see the update.'));
          }}
        />
      </Sheet>
    </Screen>
  );
}
