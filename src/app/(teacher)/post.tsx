import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { activities } from '../../data/mock';
import { Icon } from '../../components/Icon';
import { Field } from '../../components/Field';
import { Button, Card, CheckRow, Grid, T, Tap, Screen, Row } from '../../components/ui';
import { colors } from '../../theme/tokens';

type Tab = 'photos' | 'news' | 'change';
const KINDS = [
  { id: 'resched', label: 'Rescheduled', bg: colors.sunTint, fg: colors.sunInk, border: colors.sun },
  { id: 'repl', label: 'Replacement', bg: colors.skyTint, fg: colors.skyInk, border: colors.photoBlue },
  { id: 'cancel', label: 'Cancelled', bg: colors.coralTint, fg: colors.coralDark, border: colors.photoCoral },
];
const CHANGE_ACTIVITIES = ['swim', 'eng', 'judo'];

// 25 · Share with parents — Photos / Announcement / Class change.
export default function Post() {
  const { t } = useTranslation();
  const store = useStore();
  const [tab, setTab] = useState<Tab>('photos');
  const [photos, setPhotos] = useState<string[]>([colors.photoYellow, colors.photoBlue, colors.photoGreen, colors.photoCoral]);
  const [caption, setCaption] = useState(t('Painting workshop — look at these little artists!'));
  const [tags, setTags] = useState(['Ines', 'Lina', 'Yanis']);
  const [title, setTitle] = useState(t('Bring spare clothes tomorrow'));
  const [body, setBody] = useState(t('We’re doing water play in the garden. Please pack a full change of clothes in a labelled bag.'));
  const [confirm, setConfirm] = useState(true);
  const [act, setAct] = useState('swim');
  const [was, setWas] = useState('Tue 27 · 10:00');
  const [now, setNow] = useState('Thu 29 · 10:00');
  const [kind, setKind] = useState('resched');
  const [why, setWhy] = useState(t('Pool maintenance on Tuesday'));

  const tabs: [Tab, string][] = [
    ['photos', t('Photos')],
    ['news', t('Announcement')],
    ['change', t('Class change')],
  ];
  const cta = { photos: t('Post {{n}} photos', { n: photos.length }), news: t('Send announcement'), change: t('Notify parents of change') }[tab];
  const reach = {
    photos: t('the parents of {{names}}', { names: tags.join(', ') }),
    news: t('all {{n}} families in {{cls}}', { n: 16, cls: 'Les Papillons' }),
    change: t('the {{n}} families enrolled in {{act}}', { n: 9, act: t(activities.find((a) => a.id === act)!.name) }),
  }[tab];

  const addPhoto = () => {
    const pool = [colors.photoLilac, colors.photoSun, '#F7C2B4', '#BFE0F4'];
    setPhotos([...photos, pool[photos.length % pool.length]]);
  };

  return (
    <Screen
      bg={colors.groundTeacher}
      inTabs
      footer={
        <>
          <T size={13} w={700} color={colors.muted} center>
            {t('Sends a notification to {{who}}', { who: reach })}
          </T>
          <Button
            variant="teacher"
            label={cta}
            onPress={() => {
              store.toast(t('Sent — parents have been notified.'));
              router.navigate('/checkin');
            }}
          />
        </>
      }
    >
      <View style={{ paddingHorizontal: 20 }}>
        <T size={13} w={800} color={colors.skyText} upper>
          {t('Teacher mode')}
        </T>
        <T d w={800} size={26} accessibilityRole="header">
          {t('Share with parents')}
        </T>
      </View>

      <View accessibilityRole="tablist" style={{ marginTop: 14, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 999, padding: 4, flexDirection: 'row', gap: 4 }}>
        {tabs.map(([id, label]) => {
          const on = id === tab;
          return (
            <Tap key={id} role="tab" accessibilityState={{ selected: on }} onPress={() => setTab(id)} style={{ flex: 1, minHeight: 44, borderRadius: 999, backgroundColor: on ? colors.skyText : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              <T size={13} w={800} color={on ? '#FFFFFF' : colors.ink} center numberOfLines={1}>
                {label}
              </T>
            </Tap>
          );
        })}
      </View>

      {tab === 'photos' && (
        <Card pad={16} style={{ marginTop: 14, marginHorizontal: 20, gap: 12 }}>
          <Grid cols={3} gap={8}>
            {photos.map((c, i) => (
              <Tap key={i} label={t('Remove photo {{n}}', { n: i + 1 })} onPress={() => setPhotos(photos.filter((_, k) => k !== i))} style={{ height: 96, borderRadius: 16, backgroundColor: c, alignItems: 'flex-end', padding: 6 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="close" size={14} strokeWidth={2.6} />
                </View>
              </Tap>
            ))}
            <Tap label={t('Take a photo')} onPress={addPhoto} style={dashed}>
              <Icon name="camera" size={26} color={colors.skyText} />
            </Tap>
            <Tap label={t('Add from gallery')} onPress={addPhoto} style={dashed}>
              <Icon name="plus" size={26} color={colors.skyText} strokeWidth={2.4} />
            </Tap>
          </Grid>
          <Field teacher label={t('Caption')} value={caption} onChangeText={setCaption} multiline />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <T size={13} w={800} color={colors.muted} style={{ marginEnd: 4 }}>
              {t('Tagged:')}
            </T>
            {tags.map((n) => (
              <Tap key={n} label={t('Untag {{name}}', { name: n })} onPress={() => setTags(tags.filter((x) => x !== n))} style={{ backgroundColor: colors.skyTint, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 }}>
                <T size={13} w={800} color={colors.skyDark}>
                  {n}
                </T>
              </Tap>
            ))}
            <Tap
              onPress={() => {
                const pool = ['Rayan', 'Meriem', 'Sara', 'Anis', 'Nour'];
                const next = pool.find((p) => !tags.includes(p));
                if (next) setTags([...tags, next]);
              }}
              style={{ minHeight: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 2, borderColor: colors.borderTeacher, backgroundColor: '#FFFFFF', justifyContent: 'center' }}
            >
              <T size={13} w={800} color={colors.skyText}>
                + {t('Tag')}
              </T>
            </Tap>
          </View>
          <T size={12} w={700} color={colors.muted}>
            {t('Only parents of tagged children see close-ups. Group photos go to the whole class.')}
          </T>
        </Card>
      )}

      {tab === 'news' && (
        <Card pad={16} style={{ marginTop: 14, marginHorizontal: 20, gap: 10 }}>
          <Field teacher label={t('Title')} value={title} onChangeText={setTitle} style={{ fontSize: 15 }} />
          <Field teacher label={t('Message')} value={body} onChangeText={setBody} multiline style={{ minHeight: 110 }} />
          <CheckRow on={confirm} onChange={setConfirm} color={colors.skyText} label={t('Ask parents to confirm they’ve read it')} />
        </Card>
      )}

      {tab === 'change' && (
        <Card pad={16} style={{ marginTop: 14, marginHorizontal: 20, gap: 10 }}>
          <T size={13} w={800} color={colors.muted}>
            {t('Activity')}
          </T>
          <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CHANGE_ACTIVITIES.map((id) => {
              const on = id === act;
              return (
                <Tap key={id} role="radio" accessibilityState={{ checked: on }} onPress={() => setAct(id)} style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 16, borderWidth: on ? 2.5 : 2, borderColor: on ? colors.skyText : colors.borderTeacher, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
                  <T size={14} w={800}>
                    {t(activities.find((a) => a.id === id)!.name)}
                  </T>
                </Tap>
              );
            })}
          </View>
          <Grid cols={2} gap={10}>
            <Field teacher label={t('Was')} value={was} onChangeText={setWas} strike />
            <Field teacher label={t('New time')} value={now} onChangeText={setNow} active />
          </Grid>
          <View accessibilityRole="radiogroup" accessibilityLabel={t('Kind of change')} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {KINDS.map((k) => {
              const on = k.id === kind;
              return (
                <Tap key={k.id} role="radio" accessibilityState={{ checked: on }} onPress={() => setKind(k.id)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 2, borderColor: on ? k.border : 'transparent', backgroundColor: on ? k.bg : colors.groundTeacher, minHeight: 40, justifyContent: 'center' }}>
                  <T size={13} w={800} color={on ? k.fg : colors.ink}>
                    {t(k.label)}
                  </T>
                </Tap>
              );
            })}
          </View>
          <Field teacher label={t('Reason shown to parents')} value={why} onChangeText={setWhy} />
        </Card>
      )}
    </Screen>
  );
}

const dashed = {
  height: 96,
  borderRadius: 16,
  borderWidth: 2,
  borderStyle: 'dashed',
  borderColor: '#B9C7DA',
  backgroundColor: colors.groundTeacher,
  alignItems: 'center',
  justifyContent: 'center',
} as const;
