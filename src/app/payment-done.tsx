import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { fees, kindergarten } from '../data/mock';
import { feeTotal } from '../data/fees';
import { Icon } from '../components/Icon';
import { Button, Grid, Row, Screen, T } from '../components/ui';
import { colors } from '../theme/tokens';
import { formatDA } from '../utils/format';

const CONFETTI = [
  { left: '15%', top: 40, w: 14, h: 14, r: 4, c: colors.sun, rot: '20deg' },
  { left: '77%', top: 26, w: 12, h: 12, r: 6, c: colors.coral, rot: '0deg' },
  { left: '82%', top: 140, w: 16, h: 8, r: 4, c: colors.sky, rot: '-30deg' },
  { left: '10%', top: 160, w: 10, h: 10, r: 5, c: colors.lilac, rot: '0deg' },
] as const;

// 20 · Payment done — success check with confetti and the receipt card.
export default function PaymentDone() {
  const { t } = useTranslation();
  const store = useStore();
  const child = useChild();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
  }, []);

  const confetti = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(confetti, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  const rows: [string, string][] = [
    [t('For'), `${t('{{month}} fees', { month: t(fees.month) })} · ${child.name}`],
    [t('Paid with'), `${t('Edahabia')} •••• 4821`],
    [t('Date'), '28 Oct 2026 · 14:52'],
    [t('To'), kindergarten.name],
  ];

  return (
    <Screen
      bg={colors.leafTint}
      footer={
        <>
          <Grid cols={2} gap={10}>
            <Button variant="white" icon="download" label="PDF" height={54} size={15} onPress={() => store.toast(t('Receipt saved as PDF'))} />
            <Button variant="white" icon="share" label={t('Share')} height={54} size={15} onPress={() => store.toast(t('Share sheet opens here'))} />
          </Grid>
          <Button variant="dark" label={t('Back to home')} onPress={() => router.replace('/home')} />
        </>
      }
    >
      {CONFETTI.map((c, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: c.left,
            top: 60 + c.top,
            width: c.w,
            height: c.h,
            borderRadius: c.r,
            backgroundColor: c.c,
            opacity: confetti,
            transform: [{ rotate: c.rot }, { translateY: confetti.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
          }}
        />
      ))}

      <View style={{ paddingTop: 52, alignItems: 'center', gap: 12 }}>
        <Animated.View style={{ transform: [{ scale: pop }] }}>
          <View style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center', boxShadow: `0px 10px 0px ${colors.leafDark}` }}>
            <Icon name="check" size={58} color="#FFFFFF" strokeWidth={2.8} />
          </View>
        </Animated.View>
        <T d w={800} size={32} center style={{ marginTop: 12 }} accessibilityRole="header">
          {t('Payment received!')}
        </T>
        <T size={15} w={600} color="#3A4A40" center style={{ maxWidth: 280 }}>
          {t('Thank you. The kindergarten has been notified and your receipt is saved.')}
        </T>
      </View>

      <View style={{ marginTop: 24, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <T size={12} w={800} ls={1} color={colors.muted} upper>
            {t('Receipt')}
          </T>
          <T size={13} w={800}>
            #RW-1088
          </T>
        </Row>
        <T d w={800} size={34} lh={36}>
          {formatDA(feeTotal(store.enrolled), t('DA'))}
        </T>
        <View style={{ borderTopWidth: 2, borderStyle: 'dashed', borderTopColor: colors.border, paddingTop: 12, gap: 8 }}>
          {rows.map(([k, v]) => (
            <Row key={k} style={{ justifyContent: 'space-between' }} gap={10}>
              <T size={14} w={700} color={colors.muted}>
                {k}
              </T>
              <T size={14} w={700} style={{ flexShrink: 1, textAlign: 'right' }}>
                {v}
              </T>
            </Row>
          ))}
        </View>
      </View>
    </Screen>
  );
}
