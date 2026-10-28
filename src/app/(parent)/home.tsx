import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { fees, pickupPeople, timeline } from '../../data/mock';
import { feeTotal } from '../../data/fees';
import { ChildFace } from '../../components/Art';
import { Icon, IconName } from '../../components/Icon';
import { Card, Divider, Grid, IconTile, Pill, Row, Screen, SectionHeader, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';
import { formatDA } from '../../utils/format';

const TILES: { label: string; icon: IconName; bg: string; ink: string; href: string; badge?: boolean }[] = [
  { label: 'Attendance', icon: 'calendarCheck', bg: colors.leafTint, ink: colors.leaf, href: '/attendance' },
  { label: 'Pick-up', icon: 'shield', bg: colors.coralTint, ink: colors.coralDark, href: '/pickup' },
  { label: 'Schedule', icon: 'clock', bg: colors.sunTint, ink: colors.sunInk, href: '/schedule' },
  { label: 'Progress', icon: 'sprout', bg: colors.lilacTint, ink: colors.lilac, href: '/progress' },
  { label: 'Fees', icon: 'card', bg: colors.skyTint, ink: colors.skyText, href: '/fees', badge: true },
  { label: 'News', icon: 'megaphone', bg: colors.coralTint, ink: colors.coralDark, href: '/news' },
];

// 07 · Home — today at a glance.
export default function Home() {
  const { t } = useTranslation();
  const store = useStore();
  const child = useChild();
  const [refreshing, setRefreshing] = useState(false);
  const who = pickupPeople.find((p) => p.id === store.pickup.who)!;
  const unread = store.unread.length;
  const total = feeTotal(store.enrolled);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <Screen inTabs refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.coral} colors={[colors.coral]} />}>
      {/* header */}
      <Row gap={10} style={{ paddingHorizontal: 20 }}>
        <Tap
          label={t('Switch child, current: {{name}}', { name: child.name })}
          onPress={() => router.push('/children')}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 999, paddingVertical: 6, paddingStart: 6, paddingEnd: 14, minHeight: 52 }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: child.tint, alignItems: 'center', justifyContent: 'center' }}>
            <ChildFace kind={child.avatar} size={34} />
          </View>
          <View style={{ flex: 1 }}>
            <T d w={800} size={18} lh={20}>
              {child.name}
            </T>
            <T size={12} w={700} color={colors.muted}>
              {child.className}
            </T>
          </View>
          <Icon name="chevronDown" size={18} strokeWidth={2.4} />
        </Tap>
        <Tap label={t('Messages, 1 unread')} onPress={() => router.push('/messages')} style={round}>
          <Icon name="chat" size={24} />
          <View style={{ position: 'absolute', top: 10, end: 11, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.coral, borderWidth: 2, borderColor: '#FFFFFF' }} />
        </Tap>
        <Tap label={unread ? t('Notifications, {{n}} new', { n: unread }) : t('Notifications')} onPress={() => router.push('/notifications')} style={round}>
          <Icon name="bell" size={24} />
          {unread > 0 && (
            <View style={{ position: 'absolute', top: 6, end: 6, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.coral, borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <T size={11} w={800} color="#FFFFFF" center>
                {unread}
              </T>
            </View>
          )}
        </Tap>
      </Row>

      {/* status hero */}
      {child.present ? (
        <View style={{ marginTop: 18, marginHorizontal: 20, borderRadius: 30, backgroundColor: colors.leaf, padding: 20, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)', right: -50, top: -60 }} />
          <T size={12} w={800} ls={1} color="#CDEBD9" upper>
            {t('Wednesday 28 October')}
          </T>
          <T d w={800} size={28} lh={30} color="#FFFFFF" style={{ marginTop: 6 }} accessibilityRole="header">
            {t('{{name}} is at kindergarten', { name: child.name })}
          </T>
          <T size={14} w={600} color="#E3F5EA" style={{ marginTop: 4 }}>
            {t('Checked in at {{time}} by {{who}} · feeling happy', { time: child.arrivedAt, who: child.teacher })}
          </T>
          <Tap
            onPress={() => router.push('/pickup')}
            style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <Icon name="clock" color="#FFFFFF" />
            <T size={14} w={700} color="#FFFFFF" style={{ flex: 1 }}>
              {t('Pick-up {{time}}', { time: store.pickup.time })} ·{' '}
              <T size={14} w={800} color="#FFFFFF">
                {t(who.role)} ({who.name})
              </T>
            </T>
            <T size={13} w={800} color="#FFFFFF" style={{ textDecorationLine: 'underline' }}>
              {t('Change')}
            </T>
          </Tap>
        </View>
      ) : (
        <View style={{ marginTop: 18, marginHorizontal: 20, borderRadius: 30, backgroundColor: colors.ink, padding: 20 }}>
          <T size={12} w={800} ls={1} color="#C9CBE0" upper>
            {t('Wednesday 28 October')}
          </T>
          <T d w={800} size={28} lh={30} color="#FFFFFF" style={{ marginTop: 6 }}>
            {t('{{name}} is home today', { name: child.name })}
          </T>
          <T size={14} w={600} color="#DADCEB" style={{ marginTop: 4 }}>
            {t('Absence reported · the teacher knows.')}
          </T>
        </View>
      )}

      {/* schedule change */}
      <Tap
        onPress={() => router.push('/schedule')}
        style={{ marginTop: 14, marginHorizontal: 20, borderRadius: 22, backgroundColor: colors.sunTint, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}
      >
        <IconTile icon="swap" bg={colors.sun} color={colors.ink} strokeWidth={2.2} />
        <View style={{ flex: 1 }}>
          <T size={14} w={800}>
            {t('Swimming moved to Thursday')}
          </T>
          <T size={13} w={700} color={colors.sunInkDark}>
            {t('Was Tue 10:00 → now Thu 10:00')}
          </T>
        </View>
        <Icon name="chevron" size={20} strokeWidth={2.4} />
      </Tap>

      {/* timeline */}
      <View style={{ marginTop: 22, marginHorizontal: 20 }}>
        <SectionHeader title={t('Today so far')} action={t('Full report')} onAction={() => router.navigate('/day')} />
        <Card pad={0} style={{ marginTop: 10, paddingVertical: 8, paddingHorizontal: 16 }}>
          {timeline.map((e, i) => (
            <View key={e.title}>
              {i > 0 && <Divider />}
              <Row style={{ paddingVertical: 10 }}>
                <IconTile icon={e.icon} bg={e.tint} color={e.ink} strokeWidth={'stroke' in e ? e.stroke : 2} />
                <View style={{ flex: 1 }}>
                  <T size={15} w={800}>
                    {t(e.title)}
                  </T>
                  {'sub' in e && (
                    <T size={13} w={600} color={colors.muted}>
                      {t(e.sub)}
                    </T>
                  )}
                </View>
                {'live' in e ? (
                  <Pill label={t('Live')} bg={colors.skyTint} fg={colors.skyText} />
                ) : (
                  <T size={13} w={700} color={colors.muted}>
                    {e.time}
                  </T>
                )}
              </Row>
            </View>
          ))}
        </Card>
      </View>

      {/* photos */}
      <View style={{ marginTop: 22 }}>
        <SectionHeader title={t('New photos')} action={t('See all {{n}}', { n: 12 })} onAction={() => router.navigate('/photos')} style={{ paddingHorizontal: 20 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, marginTop: 10 }}>
          {[
            { c: colors.photoYellow, l: 'Painting time' },
            { c: colors.photoBlue, l: 'Garden play' },
          ].map((p) => (
            <Tap key={p.l} label={t(p.l)} onPress={() => router.navigate('/photos')} style={{ width: 140, height: 120, borderRadius: 22, backgroundColor: p.c, justifyContent: 'flex-end', padding: 10 }}>
              <T size={12} w={800}>
                {t(p.l)}
              </T>
            </Tap>
          ))}
          <Tap label={t('9 more photos')} onPress={() => router.navigate('/photos')} style={{ width: 80, height: 120, borderRadius: 22, backgroundColor: colors.photoCoral, alignItems: 'center', justifyContent: 'center' }}>
            <T size={16} w={800}>
              +9
            </T>
          </Tap>
        </ScrollView>
      </View>

      {/* shortcuts */}
      <Grid cols={3} gap={10} style={{ marginTop: 22, marginHorizontal: 20 }}>
        {TILES.map((tile) => (
          <Tap key={tile.label} onPress={() => router.push(tile.href as never)} style={{ backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', gap: 8 }}>
            <IconTile icon={tile.icon} bg={tile.bg} color={tile.ink} size={44} r={16} iconSize={22} />
            <T size={13} w={800} center numberOfLines={1}>
              {t(tile.label)}
            </T>
            {tile.badge && !store.feesPaid && (
              <View style={{ position: 'absolute', top: 10, end: 14, backgroundColor: colors.coral, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 }}>
                <T size={10} w={800} color="#FFFFFF">
                  {t('Due')}
                </T>
              </View>
            )}
          </Tap>
        ))}
      </Grid>

      {/* fee card */}
      {!store.feesPaid && (
        <Tap
          onPress={() => router.push('/checkout')}
          label={t('{{month}} fees, {{amount}}, pay now', { month: t(fees.month), amount: formatDA(total, t('DA')) })}
          style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 24, backgroundColor: colors.ink, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <View style={{ flex: 1 }}>
            <T size={12} w={800} color="#C9CBE0" upper>
              {t('{{month}} fees · due {{date}}', { month: t(fees.month), date: t(fees.dueShort) })}
            </T>
            <T d w={800} size={24} color="#FFFFFF">
              {formatDA(total, t('DA'))}
            </T>
          </View>
          <View style={{ backgroundColor: colors.sun, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18 }}>
            <T size={15} w={800}>
              {t('Pay now')}
            </T>
          </View>
        </Tap>
      )}
    </Screen>
  );
}

const round = { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' } as const;
