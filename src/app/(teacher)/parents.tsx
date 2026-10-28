import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../store/AppStore';
import { isRTL, useLang, useTranslation } from '../../i18n';
import { families } from '../../data/mock';
import { fontFamily } from '../../theme/fonts';
import { Icon } from '../../components/Icon';
import { NoteSheet } from '../../components/NoteSheet';
import { Button, Card, CircleButton, Divider, GlyphTile, Row, Screen, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';

const TINTS = [colors.coralTint, colors.skyTint, colors.sunTint, colors.lilacTint];

// Teacher · Parents — every family in the class, with chat and notes.
export default function Parents() {
  const { t } = useTranslation();
  const lang = useLang();
  const store = useStore();
  const [query, setQuery] = useState('');
  const [noteTo, setNoteTo] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const list = families.filter((f) => !q || f.child.toLowerCase().includes(q) || f.parents.toLowerCase().includes(q));
  const unreadOf = (child: string) => (store.familiesRead.includes(child) ? 0 : families.find((f) => f.child === child)?.unread ?? 0);
  const totalUnread = families.reduce((s, f) => s + unreadOf(f.child), 0);
  const lastNoteFor = (child: string) => store.notes.find((n) => n.to === child || n.to === 'all');

  const openChat = (child: string) => {
    if (!store.familiesRead.includes(child)) store.set({ familiesRead: [...store.familiesRead, child] });
    router.push({ pathname: '/messages', params: { family: child } });
  };

  return (
    <Screen bg={colors.groundTeacher} inTabs>
      <View style={{ paddingHorizontal: 20 }}>
        <T size={13} w={800} color={colors.skyText} upper>
          {t('Teacher mode')}
        </T>
        <T d w={800} size={26} accessibilityRole="header">
          {t('Parents')}
        </T>
        <T size={13} w={700} color={colors.muted}>
          {t('{{n}} families · {{cls}}', { n: families.length, cls: 'Les Papillons' })}
          {totalUnread > 0 ? ` · ${t('{{n}} unread', { n: totalUnread })}` : ''}
        </T>
      </View>

      <View style={{ marginTop: 14, marginHorizontal: 20 }}>
        <Button variant="teacher" icon="clipboard" label={t('Note to all parents')} onPress={() => setNoteTo('all')} />
      </View>

      <Row gap={8} style={{ marginTop: 6, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 999, borderWidth: 2, borderColor: colors.borderTeacher, paddingHorizontal: 14, height: 48 }}>
        <Icon name="user" size={18} color={colors.muted} />
        <TextInput
          accessibilityLabel={t('Search a child or parent')}
          value={query}
          onChangeText={setQuery}
          placeholder={t('Search a child or parent')}
          placeholderTextColor={colors.disabled}
          style={{ flex: 1, height: 44, fontFamily: fontFamily(false, 700, lang), fontSize: 14, color: colors.ink, textAlign: isRTL(lang) ? 'right' : 'left' }}
        />
        {query ? <CircleButton icon="close" label={t('Clear')} size={32} iconSize={14} bg={colors.groundTeacher} onPress={() => setQuery('')} /> : null}
      </Row>

      <Card pad={0} style={{ marginTop: 14, marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 4 }}>
        {list.length === 0 && (
          <T size={14} w={700} color={colors.muted} center style={{ paddingVertical: 24 }}>
            {t('No family matches “{{q}}”.', { q: query })}
          </T>
        )}
        {list.map((f, i) => {
          const unread = unreadOf(f.child);
          const note = lastNoteFor(f.child);
          const preview = note ? `${t('Note')}: ${note.text}` : f.last ? t(f.last) : t('No messages yet');
          return (
            <View key={f.child}>
              {i > 0 && <Divider color={colors.groundTeacher} />}
              <Row gap={12} style={{ paddingVertical: 12 }}>
                <Tap label={t('Open chat with {{parents}}, {{child}}’s parents', { parents: f.parents, child: f.child })} onPress={() => openChat(f.child)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <View>
                    <GlyphTile glyph={f.child[0]} bg={TINTS[families.indexOf(f) % 4]} color={colors.ink} size={46} round />
                    {unread > 0 && (
                      <View style={{ position: 'absolute', top: -2, end: -2, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.coral, borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                        <T size={11} w={800} color="#FFFFFF" center>
                          {unread}
                        </T>
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <T size={15} w={800} numberOfLines={1}>
                      {f.parents}
                    </T>
                    <T size={12} w={700} color={colors.skyText} numberOfLines={1}>
                      {t('{{child}}’s parents', { child: f.child })}
                    </T>
                    <T size={12} w={unread ? 800 : 600} color={unread ? colors.ink : colors.muted} numberOfLines={1}>
                      {preview}
                    </T>
                  </View>
                </Tap>
                <CircleButton icon="clipboard" label={t('Write a note to {{child}}’s parents', { child: f.child })} size={40} iconSize={18} strokeWidth={2} bg={colors.skyTint} color={colors.skyText} onPress={() => setNoteTo(f.child)} />
                <CircleButton icon="chat" label={t('Message {{parents}}', { parents: f.parents })} size={40} iconSize={18} strokeWidth={2} bg={colors.groundTeacher} onPress={() => openChat(f.child)} />
              </Row>
            </View>
          );
        })}
      </Card>

      {store.notes.length > 0 && (
        <View style={{ marginTop: 18, marginHorizontal: 20, gap: 8 }}>
          <T size={13} w={800} color={colors.muted} upper accessibilityRole="header">
            {t('Notes sent today')}
          </T>
          {store.notes.map((n) => (
            <View key={n.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, gap: 4 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <T size={13} w={800} color={colors.skyText}>
                  {n.to === 'all' ? t('All parents') : t('{{child}}’s parents', { child: n.to })}
                </T>
                <T size={12} w={700} color={colors.muted}>
                  {n.time}
                </T>
              </Row>
              <T size={14} lh={20} w={600}>
                {n.text}
              </T>
            </View>
          ))}
        </View>
      )}

      <NoteSheet to={noteTo} onClose={() => setNoteTo(null)} />
    </Screen>
  );
}
