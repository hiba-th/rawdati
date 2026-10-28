import { View } from 'react-native';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme/tokens';
import { useTranslation } from '../i18n';
import { Icon, IconName } from './Icon';
import { T, Tap } from './ui';

export type TabItem = { name: string; label: string; icon: IconName; href?: string };

type Props = BottomTabBarProps & { items: TabItem[]; teacher?: boolean };

/** Fixed bottom bar, 88 tall, white with a 28 top radius; active = tinted pill. */
export function TabBar({ state, navigateToTab, items, teacher }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index]?.name;
  const accent = teacher ? colors.skyText : colors.coral;
  const tint = teacher ? colors.skyTint : colors.coralTint;
  return (
    <View
      accessibilityRole="tablist"
      style={{
        minHeight: 88,
        paddingBottom: Math.max(insets.bottom, 12),
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        flexDirection: 'row',
        justifyContent: 'space-around',
        boxShadow: shadow.tabBar,
      }}
    >
      {items.map((it) => {
        const on = it.name === active;
        const color = on ? accent : colors.muted;
        return (
          <Tap
            key={it.name}
            role="tab"
            accessibilityState={{ selected: on }}
            label={t(it.label)}
            onPress={() => {
              if (it.href) router.push(it.href as never);
              else if (!on) {
                const route = state.routes.find((r) => r.name === it.name);
                if (route) navigateToTab(route.key);
              }
            }}
            style={{ alignItems: 'center', gap: 4, width: teacher ? 76 : 68, minHeight: 44 }}
          >
            <View style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: on ? tint : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={it.icon} size={22} color={color} strokeWidth={on ? 2.2 : 2} />
            </View>
            <T size={11} w={800} color={color} center numberOfLines={1}>
              {t(it.label)}
            </T>
          </Tap>
        );
      })}
    </View>
  );
}
