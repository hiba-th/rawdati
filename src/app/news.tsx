import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { kindergarten } from '../data/mock';
import { Logo } from '../components/Art';
import { Icon } from '../components/Icon';
import { Card, Grid, PhotoBlock, Row, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

// 16 · News & events — pinned notice, RSVP, permission slip, kindergarten post.
export default function News() {
  const { t } = useTranslation();
  const store = useStore();
  const off = colors.line;

  return (
    <Screen>
      <ScreenHeader title={t('News & events')} />

      <View style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 26, backgroundColor: colors.coral, padding: 18, gap: 6 }}>
        <Row gap={6}>
          <Icon name="pin" size={14} color="none" fill={colors.coralTint} strokeWidth={0} />
          <T size={12} w={800} ls={1} color={colors.coralTint} upper>
            {t('Pinned')}
          </T>
        </Row>
        <T d w={800} size={22} lh={26} color="#FFFFFF" accessibilityRole="header">
          {t('Closed Sunday 1 November')}
        </T>
        <T size={14} lh={20} w={600} color="#FFF1EC">
          {t('Happy Revolution Day! The kindergarten reopens Monday 2 November at 07:30.')}
        </T>
      </View>

      <Card style={{ marginTop: 16, marginHorizontal: 20, gap: 12 }}>
        <EventHead month="NOV" day={12} bg={colors.skyTint} fg={colors.skyInk} title={t('Parents’ meeting')} sub={t('Thursday · 17:30 · Main room')} />
        <View accessibilityRole="radiogroup" accessibilityLabel={t('Will you come?')}>
          <Grid cols={2} gap={8}>
            <Tap role="radio" accessibilityState={{ checked: store.rsvp === 'y' }} onPress={() => store.set({ rsvp: 'y' })} style={{ minHeight: 46, borderRadius: 16, backgroundColor: store.rsvp === 'y' ? colors.leaf : off, alignItems: 'center', justifyContent: 'center' }}>
              <T size={14} w={800} color={store.rsvp === 'y' ? '#FFFFFF' : colors.ink} center>
                {t('I’ll be there')}
              </T>
            </Tap>
            <Tap role="radio" accessibilityState={{ checked: store.rsvp === 'n' }} onPress={() => store.set({ rsvp: 'n' })} style={{ minHeight: 46, borderRadius: 16, backgroundColor: store.rsvp === 'n' ? colors.ink : off, alignItems: 'center', justifyContent: 'center' }}>
              <T size={14} w={800} color={store.rsvp === 'n' ? '#FFFFFF' : colors.ink} center>
                {t('Can’t come')}
              </T>
            </Tap>
          </Grid>
        </View>
      </Card>

      <Card style={{ marginTop: 12, marginHorizontal: 20, gap: 12 }}>
        <EventHead month="NOV" day={15} bg={colors.leafTint} fg={colors.leafDark} title={t('Outing to the Jardin d’Essai')} sub={t('Sunday · 09:00–12:00 · by bus')} />
        <Row gap={10} style={{ backgroundColor: store.signed ? colors.leafTint : colors.sunTint, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12 }}>
          <T size={13} w={700} style={{ flex: 1 }}>
            {store.signed ? t('Thank you — permission given.') : t('Your permission is needed')}
          </T>
          {store.signed ? (
            <T size={13} w={800} color={colors.leafDark}>
              {t('Signed ✓')}
            </T>
          ) : (
            <Tap onPress={() => store.set({ signed: true })} style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.ink, justifyContent: 'center' }}>
              <T size={13} w={800} color="#FFFFFF">
                {t('Sign permission')}
              </T>
            </Tap>
          )}
        </Row>
      </Card>

      <Card pad={16} style={{ marginTop: 12, marginHorizontal: 20, gap: 10 }}>
        <Row gap={10}>
          <Logo size={40} />
          <View>
            <T size={14} w={800}>
              {kindergarten.name}
            </T>
            <T size={12} w={700} color={colors.muted}>
              {t('Yesterday · all classes')}
            </T>
          </View>
        </Row>
        <T size={15} lh={21} w={600}>
          {t('Our little gardeners planted mint and tomatoes this week. Ask your child to tell you all about it!')}
        </T>
        <Row gap={6} align="stretch">
          <View style={{ flex: 2 }}>
            <PhotoBlock color={colors.photoGreen} height={130} r={16} a11y={t('Photo of the garden')} />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <PhotoBlock color={colors.photoSun} height={62} r={14} a11y={t('Photo')} />
            <View style={{ height: 62, borderRadius: 14, backgroundColor: colors.photoBlue, alignItems: 'center', justifyContent: 'center' }}>
              <T size={14} w={800}>
                +4
              </T>
            </View>
          </View>
        </Row>
        <Row gap={8}>
          <Tap
            role="button"
            accessibilityState={{ selected: store.liked }}
            label={t('Like, {{n}} likes', { n: store.liked ? 25 : 24 })}
            onPress={() => store.set({ liked: !store.liked })}
            style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, backgroundColor: store.liked ? colors.coralTint : off, flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Icon name="heart" size={16} color={colors.coralDark} fill={store.liked ? colors.coral : 'none'} />
            <T size={13} w={800} color={colors.coralDark}>
              {store.liked ? 25 : 24}
            </T>
          </Tap>
          <Tap role="link" onPress={() => router.push('/messages')} style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, backgroundColor: off, justifyContent: 'center' }}>
            <T size={13} w={800}>
              {t('Ask a question')}
            </T>
          </Tap>
        </Row>
      </Card>
    </Screen>
  );
}

function EventHead({ month, day, bg, fg, title, sub }: { month: string; day: number; bg: string; fg: string; title: string; sub: string }) {
  const { t } = useTranslation();
  return (
    <Row gap={14}>
      <View style={{ width: 58, height: 62, borderRadius: 18, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <T size={11} w={800} color={fg} center>
          {t(month)}
        </T>
        <T d w={800} size={24} lh={26} color={fg} center>
          {day}
        </T>
      </View>
      <View style={{ flex: 1 }}>
        <T size={16} w={800} accessibilityRole="header">
          {title}
        </T>
        <T size={13} w={700} color={colors.muted}>
          {sub}
        </T>
      </View>
    </Row>
  );
}
