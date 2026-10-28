import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChild, useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { Photo, photosToday, photosYesterday } from '../../data/mock';
import { Icon } from '../../components/Icon';
import { CircleButton, Grid, PhotoBlock, Row, Screen, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';

type Filter = 'all' | 'me' | 'vid';

// 09 · Photos — filters, grouped by day, featured tile, video tile, full-screen viewer.
export default function Photos() {
  const { t } = useTranslation();
  const child = useChild();
  const store = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [viewer, setViewer] = useState<{ list: Photo[]; index: number } | null>(null);

  const keep = (p: Photo) => (filter === 'all' ? true : filter === 'me' ? p.mine : !!p.video);
  const today = photosToday.filter(keep);
  const yesterday = photosYesterday.filter(keep);
  const chips: [Filter, string][] = [
    ['all', t('All')],
    ['me', t('{{name}} only', { name: child.name })],
    ['vid', t('Videos')],
  ];

  const open = (list: Photo[], index: number) => setViewer({ list, index });

  return (
    <Screen inTabs>
      <Row style={{ paddingHorizontal: 20, justifyContent: 'space-between' }}>
        <T d w={800} size={30} accessibilityRole="header">
          {t('Photos')}
        </T>
        <CircleButton icon="download" label={t('Save photos to phone')} strokeWidth={2.2} onPress={() => store.toast(t('{{n}} photos saved to your phone', { n: today.length }))} />
      </Row>

      <View accessibilityRole="tablist" style={{ paddingTop: 14, paddingHorizontal: 20, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {chips.map(([id, label]) => {
          const on = filter === id;
          return (
            <Tap key={id} role="tab" accessibilityState={{ selected: on }} onPress={() => setFilter(id)} style={{ minHeight: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: on ? colors.ink : '#FFFFFF', justifyContent: 'center' }}>
              <T size={14} w={800} color={on ? '#FFFFFF' : colors.ink}>
                {label}
              </T>
            </Tap>
          );
        })}
      </View>

      {today.length === 0 && yesterday.length === 0 && (
        <View style={{ margin: 20, padding: 28, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', gap: 8 }}>
          <Icon name="image" size={32} color={colors.muted} />
          <T size={15} w={700} color={colors.muted} center>
            {t('No photos here yet.')}
          </T>
        </View>
      )}

      {today.length > 0 && (
        <View style={{ paddingTop: 18, paddingHorizontal: 20 }}>
          <T size={14} w={800} color={colors.muted} style={{ marginBottom: 10 }} upper>
            {t('Today · {{p}} photos, {{v}} video', { p: photosToday.filter((p) => !p.video).length, v: photosToday.filter((p) => p.video).length })}
          </T>
          {filter === 'all' ? <FeaturedGrid photos={today} onOpen={(i) => open(today, i)} /> : <PlainGrid photos={today} onOpen={(i) => open(today, i)} />}
        </View>
      )}

      {yesterday.length > 0 && (
        <View style={{ paddingTop: 22, paddingHorizontal: 20 }}>
          <T size={14} w={800} color={colors.muted} style={{ marginBottom: 10 }} upper>
            {t('Yesterday · {{n}} photos', { n: photosYesterday.length })}
          </T>
          <PlainGrid photos={yesterday} onOpen={(i) => open(yesterday, i)} />
        </View>
      )}

      <Row gap={8} style={{ marginTop: 18, marginHorizontal: 20 }}>
        <Icon name="lock" size={16} color={colors.muted} strokeWidth={2.2} />
        <T size={12} w={700} color={colors.muted} style={{ flex: 1 }}>
          {t('Private to families of {{cls}}. Photos are never public.', { cls: child.className })}
        </T>
      </Row>

      <Viewer state={viewer} onClose={() => setViewer(null)} onIndex={(index) => viewer && setViewer({ ...viewer, index })} />
    </Screen>
  );
}

function Tile({ p, h, onPress, big }: { p: Photo; h: number; onPress: () => void; big?: boolean }) {
  const { t } = useTranslation();
  if (p.video)
    return (
      <Tap label={t('Video: {{name}}, {{d}}', { name: t(p.label ?? ''), d: p.video })} onPress={onPress} style={{ height: h, borderRadius: 20, backgroundColor: p.color, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="play" size={16} color="none" fill={colors.ink} strokeWidth={0} />
        </View>
        <T size={12} w={800}>
          {p.video}
        </T>
      </Tap>
    );
  return <PhotoBlock color={p.color} label={p.label ? t(p.label) : undefined} a11y={t('Photo: {{name}}', { name: p.label ? t(p.label) : '' })} height={h} r={big ? 24 : 20} labelSize={big ? 14 : 12} onPress={onPress} />;
}

function FeaturedGrid({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  const [first, second, third, ...rest] = photos;
  return (
    <View style={{ gap: 8 }}>
      <Row gap={8} align="stretch">
        <View style={{ flex: 2 }}>{first && <Tile p={first} h={228} big onPress={() => onOpen(0)} />}</View>
        <View style={{ flex: 1, gap: 8 }}>
          {second && <Tile p={second} h={110} onPress={() => onOpen(1)} />}
          {third && <Tile p={third} h={110} onPress={() => onOpen(2)} />}
        </View>
      </Row>
      {rest.length > 0 && (
        <Grid cols={3} gap={8}>
          {rest.map((p, i) => (
            <Tile key={p.id} p={p} h={110} onPress={() => onOpen(i + 3)} />
          ))}
        </Grid>
      )}
    </View>
  );
}

function PlainGrid({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  return (
    <Grid cols={3} gap={8}>
      {photos.map((p, i) => (
        <Tile key={p.id} p={p} h={110} onPress={() => onOpen(i)} />
      ))}
    </Grid>
  );
}

function Viewer({ state, onClose, onIndex }: { state: { list: Photo[]; index: number } | null; onClose: () => void; onIndex: (i: number) => void }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const store = useStore();
  if (!state) return null;
  const p = state.list[state.index];
  const n = state.list.length;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(15,17,32,0.96)', paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>
        <Row style={{ paddingHorizontal: 16, justifyContent: 'space-between' }}>
          <CircleButton icon="close" label={t('Close')} onPress={onClose} bg="rgba(255,255,255,0.14)" color="#FFFFFF" />
          <T size={14} w={800} color="#FFFFFF">
            {state.index + 1} / {n}
          </T>
          <CircleButton icon="download" label={t('Save to phone')} onPress={() => store.toast(t('Saved to your phone'))} bg="rgba(255,255,255,0.14)" color="#FFFFFF" />
        </Row>
        <Pressable accessibilityLabel={t('Next photo')} onPress={() => onIndex((state.index + 1) % n)} style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
          <View style={{ aspectRatio: 3 / 4, maxHeight: '100%', alignSelf: 'center', width: '100%', maxWidth: 440, borderRadius: 28, backgroundColor: p.color, alignItems: 'center', justifyContent: 'center' }}>
            {p.video && <Icon name="play" size={56} color="none" fill={colors.ink} strokeWidth={0} />}
            <T d w={800} size={22} center style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
              {p.label ? t(p.label) : t('Photo')}
            </T>
          </View>
        </Pressable>
        <Row style={{ paddingHorizontal: 16, justifyContent: 'space-between' }}>
          <CircleButton icon="back" label={t('Previous photo')} onPress={() => onIndex((state.index - 1 + n) % n)} bg="rgba(255,255,255,0.14)" color="#FFFFFF" />
          <CircleButton icon="chevron" label={t('Next photo')} onPress={() => onIndex((state.index + 1) % n)} bg="rgba(255,255,255,0.14)" color="#FFFFFF" />
        </Row>
      </View>
    </Modal>
  );
}
