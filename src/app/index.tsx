import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { Cloud, Logo } from '../components/Art';
import { T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

// 01 · Splash / loading — sunny yellow, hopping dots, then continues on its own.
export default function Splash() {
  const { t } = useTranslation();
  const store = useStore();
  const hops = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = hops.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(v, { toValue: 1, duration: 440, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 660, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ),
    );
    const d = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loops.forEach((l) => l.start());
    d.start();
    return () => {
      loops.forEach((l) => l.stop());
      d.stop();
    };
  }, []);

  const go = () => {
    if (store.loggedIn) router.replace(store.role === 'teacher' ? '/checkin' : '/home');
    else if (store.onboarded) router.replace('/login');
    else router.replace('/onboarding');
  };

  useEffect(() => {
    if (!store.hydrated) return;
    const id = setTimeout(go, 1800);
    return () => clearTimeout(id);
  }, [store.hydrated]);

  const dx = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 14] });
  const dotColors = [colors.coral, colors.sky, colors.leaf];

  return (
    <Tap label={t('Rawdati is loading. Tap to continue')} onPress={go} style={{ flex: 1, backgroundColor: colors.sunBright, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: colors.sunLight, left: -120, top: -90 }} />
      <View style={{ position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.sun, right: -110, bottom: 120 }} />
      <Animated.View style={{ position: 'absolute', right: 40, top: 120, transform: [{ translateX: dx }] }}>
        <Cloud width={120} opacity={0.85} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', left: 36, bottom: 170, transform: [{ translateX: dx }] }}>
        <Cloud width={90} opacity={0.7} />
      </Animated.View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingBottom: 60 }}>
        <View style={{ width: 128, height: 128, borderRadius: 40, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 16px 0px #F0B524' }}>
          <Logo size={84} withDot />
        </View>
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <T d w={800} size={52} lh={56} ls={-1} style={{ fontFamily: 'Baloo2_800ExtraBold' }}>
            rawdati
          </T>
          <T size={26} w={700} color={colors.coralDark} style={{ fontFamily: 'BalooBhaijaan2_700Bold' }}>
            روضتي
          </T>
        </View>
        <T size={16} lh={24} w={700} center style={{ maxWidth: 260 }}>
          {t('Your little one’s day at kindergarten, right in your pocket.')}
        </T>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 130, alignItems: 'center', gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {hops.map((v, i) => (
            <Animated.View
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: dotColors[i],
                transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) }],
              }}
            />
          ))}
        </View>
        <T size={14} w={700}>
          {t('Opening your kindergarten…')}
        </T>
      </View>
      <T size={12} w={700} color={colors.sunInkDark} center style={{ position: 'absolute', left: 0, right: 0, bottom: 44 }}>
        {t('Made with love in Algeria')}
      </T>
    </Tap>
  );
}
