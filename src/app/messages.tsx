import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, ScrollView, ScrollViewInstance, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useChild, useStore } from '../store/AppStore';
import { isRTL, useLang, useTranslation } from '../i18n';
import { families, kindergarten, Message, quickReplies } from '../data/mock';
import { NoteSheet } from '../components/NoteSheet';
import { fontFamily } from '../theme/fonts';
import { BackButton, CircleButton, GlyphTile, PhotoBlock, T, Tap, useTopPad } from '../components/ui';
import { colors } from '../theme/tokens';
import { nowHHMM } from '../utils/format';

// 14 · Chat with teacher — bubbles, photo message, quick replies, composer.
export default function Messages() {
  const { t } = useTranslation();
  const lang = useLang();
  const top = useTopPad();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const child = useChild();
  const [text, setText] = useState('');
  const scroll = useRef<ScrollViewInstance>(null);
  const [noting, setNoting] = useState(false);
  const teacherMode = store.role === 'teacher';
  // Teachers open a chat per family (?family=<child>); Ines's family shares the parent-side conversation.
  const { family: familyParam } = useLocalSearchParams<{ family?: string }>();
  const family = teacherMode ? families.find((f) => f.child === (familyParam ?? 'Ines')) ?? families[0] : null;
  const ownThread = !!family && family.child !== 'Ines';
  const seed: Message[] = family?.last ? [{ id: 'seed', from: 'me', text: family.last, time: '08:40' }] : [];
  const thread = ownThread ? store.threads[family!.child] ?? seed : store.messages;
  const otherName = family ? family.parents : child.teacher;

  const send = (body: string) => {
    if (!body.trim()) return;
    const msg: Message = { id: `s${Date.now()}`, from: teacherMode ? 'teacher' : 'me', text: body.trim(), time: nowHHMM(), status: 'Sent' };
    if (ownThread) store.set({ threads: { ...store.threads, [family!.child]: [...thread, msg] } });
    else store.set({ messages: [...store.messages, msg] });
    setText('');
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.ground }}>
      <View style={{ paddingTop: top, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <BackButton bg={colors.ground} size={44} fallback={teacherMode ? '/parents' : '/home'} />
        <GlyphTile glyph={family ? family.child[0] : 'S'} bg={family ? colors.coralTint : colors.lilacTint} color={family ? colors.coralDark : colors.lilacDark} size={44} round />
        <View style={{ flex: 1, minWidth: 0 }}>
          <T size={16} w={800} accessibilityRole="header" numberOfLines={1}>
            {family ? family.parents : child.teacher}
          </T>
          <T size={12} w={700} color={family ? colors.skyText : colors.leafDark} numberOfLines={1}>
            {family ? t('{{child}}’s parents', { child: family.child }) : t('Online · replies {{hours}}', { hours: kindergarten.hours })}
          </T>
        </View>
        {family && <CircleButton icon="clipboard" label={t('Write a note to {{child}}’s parents', { child: family.child })} size={44} iconSize={20} strokeWidth={2} bg={colors.skyTint} color={colors.skyText} onPress={() => setNoting(true)} />}
        <CircleButton
          icon="call"
          label={family ? t('Call {{parents}}', { parents: family.parents }) : t('Call the kindergarten')}
          size={44}
          iconSize={20}
          strokeWidth={2.2}
          bg={colors.leafTint}
          color={colors.leafDark}
          onPress={() => Linking.openURL(`tel:${family ? family.phone.replace(/s/g, '') : kindergarten.phone}`).catch(() => {})}
        />
      </View>

      <ScrollView
        ref={scroll}
        accessibilityLabel={t('Conversation')}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
      >
        <View style={{ alignSelf: 'center', backgroundColor: colors.line, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999 }}>
          <T size={12} w={800} color={colors.muted}>
            {t('Today')}
          </T>
        </View>
        {thread.length === 0 && (
          <T size={14} w={700} color={colors.muted} center style={{ paddingVertical: 20 }}>
            {t('No messages yet — say hello!')}
          </T>
        )}
        {thread.map((m) => {
          // In teacher mode the roles swap: the parent's messages appear on the other side.
          const mine = teacherMode ? m.from === 'teacher' : m.from === 'me';
          return <Bubble key={m.id} m={m} mine={mine} />;
        })}
      </ScrollView>

      {!teacherMode && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 16, gap: 8 }}>
          {quickReplies.map((q) => (
            <Tap
              key={q.label}
              label={t('Send: {{text}}', { text: t(q.text) })}
              onPress={() => send(t(q.text))}
              style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 2, borderColor: colors.coralSoft, backgroundColor: '#FFFFFF', justifyContent: 'center' }}
            >
              <T size={13} w={800} color={colors.coralDark}>
                {t(q.label)}
              </T>
            </Tap>
          ))}
        </ScrollView>
      )}

      <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 32 + insets.bottom, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <CircleButton icon="camera" label={t('Attach a photo')} strokeWidth={2} onPress={() => store.toast(t('Photo picker opens here'))} />
        <TextInput
          accessibilityLabel={t('Message')}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => send(text)}
          returnKeyType="send"
          placeholder={t('Write to {{who}}…', { who: otherName })}
          placeholderTextColor={colors.disabled}
          style={{
            flex: 1,
            minWidth: 0,
            height: 48,
            borderRadius: 24,
            borderWidth: 2,
            borderColor: colors.border,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            fontFamily: fontFamily(false, 600, lang),
            fontSize: 15,
            color: colors.ink,
            textAlign: isRTL(lang) ? 'right' : 'left',
          }}
        />
        {text.trim() ? (
          <CircleButton icon="send" label={t('Send')} bg={colors.coral} color="#FFFFFF" strokeWidth={2.2} onPress={() => send(text)} />
        ) : (
          <CircleButton icon="mic" label={t('Voice message')} bg={colors.coral} color="#FFFFFF" strokeWidth={2.2} onPress={() => store.toast(t('Hold to record a voice message'))} />
        )}
      </View>
      <NoteSheet to={noting && family ? family.child : null} onClose={() => setNoting(false)} />
    </KeyboardAvoidingView>
  );
}

function Bubble({ m, mine }: { m: Message; mine: boolean }) {
  const { t } = useTranslation();
  const meta = [m.time, m.status ? t(m.status) : null].filter(Boolean).join(' · ');
  return (
    <View
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        backgroundColor: mine ? colors.coral : '#FFFFFF',
        borderRadius: 22,
        borderBottomEndRadius: mine ? 6 : 22,
        borderBottomStartRadius: mine ? 22 : 6,
        padding: m.photo ? 8 : 12,
        paddingHorizontal: m.photo ? 8 : 14,
        gap: 8,
      }}
    >
      {m.photo && <PhotoBlock color={m.photo.color} label={t(m.photo.label)} height={140} r={16} a11y={t('Photo of {{name}} painting', { name: 'Ines' })} />}
      <View style={{ paddingHorizontal: m.photo ? 6 : 0, paddingBottom: m.photo ? 4 : 0 }}>
        <T size={15} lh={21} w={600} color={mine ? '#FFFFFF' : colors.ink}>
          {t(m.text)}
        </T>
        <T size={11} w={700} color={mine ? colors.coralTint : colors.muted} style={{ marginTop: 4 }}>
          {meta}
        </T>
      </View>
    </View>
  );
}
