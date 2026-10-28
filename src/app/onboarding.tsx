import { useRef, useState } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useIsRTL, useTranslation } from '../i18n';
import { Logo } from '../components/Art';
import { Icon } from '../components/Icon';
import { Button, GlyphTile, Grid, Pill, Row, T, Tap, useTopPad } from '../components/ui';
import { colors } from '../theme/tokens';
import { formatDA } from '../utils/format';

const STEPS = [
  {
    title: 'Their whole day, from home',
    body: 'Meals, naps, mood and little wins — the teacher logs it and you see it as it happens.',
    tint: colors.skyTint,
  },
  {
    title: 'Know they’re safe',
    body: 'A live alert when your child arrives and leaves, and only the people you approve can pick them up.',
    tint: colors.leafTint,
  },
  {
    title: 'Photos, chats & fees',
    body: 'Smiles from the classroom, a direct line to the teacher, and fees paid with Edahabia, CIB or BaridiMob.',
    tint: colors.sunTint,
  },
];

// 02 · Onboarding — 3 swipeable steps, animated dots, Skip / Next / Let's start.
export default function Onboarding() {
  const { t } = useTranslation();
  const rtl = useIsRTL();
  const top = useTopPad();
  const { set } = useStore();
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  stepRef.current = step;

  const finish = () => {
    set({ onboarded: true });
    router.replace('/language');
  };
  const goTo = (s: number) => setStep(Math.max(0, Math.min(2, s)));

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        const forward = rtl ? g.dx > 40 : g.dx < -40;
        const backward = rtl ? g.dx < -40 : g.dx > 40;
        if (forward) goTo(stepRef.current + 1);
        else if (backward) goTo(stepRef.current - 1);
      },
    }),
  ).current;

  const s = STEPS[step];

  return (
    <View style={{ flex: 1, backgroundColor: colors.ground }} {...pan.panHandlers}>
      <Row style={{ paddingTop: top, paddingHorizontal: 24, justifyContent: 'space-between' }}>
        <Row gap={8}>
          <Logo size={28} hole={colors.ground} />
          <T d w={800} size={22} style={{ fontFamily: 'Baloo2_800ExtraBold' }}>
            rawdati
          </T>
        </Row>
        <Tap onPress={finish} style={{ paddingVertical: 12, paddingHorizontal: 4 }}>
          <T size={15} w={800} color={colors.muted}>
            {t('Skip')}
          </T>
        </Tap>
      </Row>

      <View style={{ marginTop: 16, marginHorizontal: 24, height: 390, borderRadius: 36, backgroundColor: s.tint, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.45)', right: -60, top: -60 }} />
        <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.35)', left: -40, bottom: -30 }} />
        {step === 0 && <IllustrationDay />}
        {step === 1 && <IllustrationSafe />}
        {step === 2 && <IllustrationPhotos />}
      </View>

      <View style={{ marginTop: 30, marginHorizontal: 28, gap: 10, flex: 1 }}>
        <T d w={800} size={34} lh={38} accessibilityRole="header">
          {t(s.title)}
        </T>
        <T size={16} lh={24} w={600} color={colors.muted}>
          {t(s.body)}
        </T>
      </View>

      <Row style={{ marginHorizontal: 28, marginBottom: 48, justifyContent: 'space-between' }}>
        <Row gap={6} style={{}}>
          <View accessible accessibilityLabel={t('Step {{n}} of 3', { n: step + 1 })} style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <Tap key={i} label={t('Step {{n}} of 3', { n: i + 1 })} onPress={() => goTo(i)} style={{ paddingVertical: 17 }}>
                <View style={{ height: 10, borderRadius: 5, width: i === step ? 30 : 10, backgroundColor: i === step ? colors.coral : colors.coralSoft }} />
              </Tap>
            ))}
          </View>
        </Row>
        {step < 2 ? (
          <Tap
            onPress={() => goTo(step + 1)}
            style={{
              height: 58,
              paddingHorizontal: 30,
              borderRadius: 29,
              backgroundColor: colors.coral,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0px 6px 0px ${colors.coralDark}`,
            }}
          >
            <T size={17} w={800} color="#FFFFFF">
              {t('Next')}
            </T>
            <Icon name="arrowRight" size={20} color="#FFFFFF" strokeWidth={2.4} />
          </Tap>
        ) : (
          <Button label={t('Let’s start')} onPress={finish} style={{ paddingHorizontal: 30, marginBottom: 0 }} />
        )}
      </Row>
    </View>
  );
}

function MiniStat({ label, value, bg, ink }: { label: string; value: string; bg: string; ink: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 16, padding: 10, gap: 2 }}>
      <T size={11} w={800} color={ink}>
        {label}
      </T>
      <T d w={800} size={16} numberOfLines={1}>
        {value}
      </T>
    </View>
  );
}

function IllustrationDay() {
  const { t } = useTranslation();
  return (
    <>
      <View style={{ position: 'absolute', left: 26, right: 26, top: 48, backgroundColor: '#FFFFFF', borderRadius: 26, padding: 18, gap: 14, boxShadow: '0px 12px 0px rgba(47,127,184,0.18)' }}>
        <Row gap={10}>
          <GlyphTile glyph="I" bg={colors.coralTint} color={colors.coralDark} size={44} round />
          <View>
            <T size={15} w={800}>
              {t('{{name}}’s day', { name: 'Ines' })}
            </T>
            <T size={12} w={700} color={colors.muted}>
              {t('Today')} · Les Papillons
            </T>
          </View>
        </Row>
        <Grid cols={3} gap={8}>
          <MiniStat label={t('Lunch')} value={t('Ate all')} bg={colors.sunTint} ink={colors.sunInk} />
          <MiniStat label={t('Nap')} value="1h 20" bg={colors.skyTint} ink={colors.skyText} />
          <MiniStat label={t('Mood')} value={t('Happy')} bg={colors.leafTint} ink={colors.leaf} />
        </Grid>
      </View>
      <Row gap={10} style={{ position: 'absolute', left: 64, right: 26, top: 240, backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16 }}>
        <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.lilacTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="star" size={20} color={colors.lilac} />
        </View>
        <T size={13} w={700} style={{ flex: 1 }}>
          “{t('Ines painted a big sun today!')}”
        </T>
      </Row>
    </>
  );
}

function IllustrationSafe() {
  const { t } = useTranslation();
  return (
    <View style={{ position: 'absolute', left: 26, right: 26, top: 50, gap: 14 }}>
      <Row style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, boxShadow: '0px 12px 0px rgba(42,127,80,0.18)' }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={28} color="#FFFFFF" strokeWidth={2.6} />
        </View>
        <View style={{ flex: 1 }}>
          <T d w={800} size={19}>
            {t('{{name}} arrived', { name: 'Ines' })} · 08:12
          </T>
          <T size={13} w={700} color={colors.muted}>
            {t('Checked in by {{who}}', { who: 'Mlle Sarah' })}
          </T>
        </View>
      </Row>
      <Row style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginStart: 30 }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.coralTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="user" size={26} color={colors.coralDark} />
        </View>
        <View style={{ flex: 1 }}>
          <T d w={800} size={19}>
            {t('Picked up')} · 16:30
          </T>
          <T size={13} w={700} color={colors.muted}>
            {t('By Papa — approved person')}
          </T>
        </View>
      </Row>
    </View>
  );
}

function IllustrationPhotos() {
  const { t } = useTranslation();
  return (
    <>
      <View style={{ position: 'absolute', left: 26, right: 26, top: 44 }}>
        <Grid cols={3} gap={8}>
          {[colors.photoYellow, colors.photoBlue, colors.photoCoral].map((c) => (
            <View key={c} style={{ height: 96, borderRadius: 20, backgroundColor: c }} />
          ))}
        </Grid>
      </View>
      <View style={{ position: 'absolute', left: 26, right: 70, top: 162, backgroundColor: '#FFFFFF', borderRadius: 20, borderBottomLeftRadius: 6, paddingVertical: 12, paddingHorizontal: 14 }}>
        <T size={14} w={700}>
          {t('Ines is a little tired today, nothing to worry about.')}
        </T>
      </View>
      <Row style={{ position: 'absolute', left: 60, right: 26, top: 250, backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, justifyContent: 'space-between', boxShadow: '0px 12px 0px rgba(200,70,43,0.15)' }}>
        <View>
          <T size={12} w={800} color={colors.muted}>
            {t('November fees')}
          </T>
          <T d w={800} size={22}>
            {formatDA(15000, t('DA'))}
          </T>
        </View>
        <Pill label={t('Paid')} bg={colors.leafTint} fg={colors.leaf} px={12} py={6} />
      </Row>
    </>
  );
}
