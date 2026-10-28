import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { Notif, notifications } from '../data/mock';
import { GlyphTile, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

// 15 · Notifications — Today / Earlier, typed icons, unread dots, deep links.
export default function Notifications() {
  const { t } = useTranslation();
  const store = useStore();

  const open = (n: Notif) => {
    store.set({ unread: store.unread.filter((id) => id !== n.id) });
    router.push(n.href as never);
  };

  const section = (title: string, list: Notif[], action?: React.ReactNode) => (
    <View style={{ paddingTop: 14, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, minHeight: action ? 44 : undefined }}>
        <T size={13} w={800} color={colors.muted} upper accessibilityRole="header">
          {title}
        </T>
        {action}
      </View>
      <View style={{ gap: 8 }}>
        {list.map((n) => {
          const unread = store.unread.includes(n.id);
          return (
            <Tap
              key={n.id}
              label={`${t(n.title)}. ${t(n.body)}. ${t(n.time)}${unread ? `. ${t('Unread')}` : ''}`}
              onPress={() => open(n)}
              style={{ backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start', opacity: n.today ? 1 : 0.92 }}
            >
              <GlyphTile glyph={n.glyph} bg={n.tint} color={n.ink} />
              <View style={{ flex: 1, gap: 2 }}>
                <T size={15} w={800}>
                  {t(n.title)}
                </T>
                <T size={13} lh={19} w={600} color={colors.muted}>
                  {t(n.body)}
                </T>
                <T size={12} w={700} color={colors.muted}>
                  {t(n.time)}
                </T>
              </View>
              {unread && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral, marginTop: 6 }} />}
            </Tap>
          );
        })}
      </View>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader title={t('Notifications')} />
      {section(
        t('Today'),
        notifications.filter((n) => n.today),
        <Tap onPress={() => store.set({ unread: [] })} disabled={!store.unread.length} style={{ minHeight: 44, paddingHorizontal: 4, justifyContent: 'center', opacity: store.unread.length ? 1 : 0.5 }}>
          <T size={14} w={800} color={colors.coral}>
            {t('Mark all read')}
          </T>
        </Tap>,
      )}
      <View style={{ height: 4 }} />
      {section(t('Earlier'), notifications.filter((n) => !n.today))}
    </Screen>
  );
}
