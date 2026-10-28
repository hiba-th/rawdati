import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { api, kindergarten, parent } from '../data/mock';
import { ChildAvatar, Logo } from '../components/Art';
import { Icon } from '../components/Icon';
import { Sheet } from '../components/Sheet';
import { Field } from '../components/Field';
import { Button, IconTile, Pill, Screen, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';

// 06 · Choose child — one card per child with live status, add a child by code.
export default function Children() {
  const { t } = useTranslation();
  const store = useStore();
  const [adding, setAdding] = useState(false);
  const [code, setCode] = useState('');

  // Opened from Home/Me to switch child → go back; opened right after sign-in → clear the
  // sign-in screens so Back can't return to them.
  const { switching } = useLocalSearchParams<{ switching?: string }>();
  const open = (id: 'ines' | 'adam') => {
    store.set({ childId: id });
    if (switching && router.canGoBack()) return router.back();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/home');
  };

  return (
    <Screen
      footer={
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Logo size={40} />
          <View style={{ flex: 1 }}>
            <T size={14} w={800}>
              {kindergarten.name}
            </T>
            <T size={12} w={700} color={colors.muted}>
              {kindergarten.place} · {t('Open {{hours}}', { hours: kindergarten.hours })}
            </T>
          </View>
        </View>
      }
    >
      <View style={{ paddingTop: 12, paddingHorizontal: 24, gap: 6 }}>
        <T size={14} w={800} color={colors.coralDark}>
          {t('Sabah el khir, {{name}}', { name: parent.name })}
        </T>
        <T d w={800} size={32} lh={36} accessibilityRole="header">
          {t('Whose day do you want to see?')}
        </T>
      </View>

      <View style={{ paddingTop: 24, paddingHorizontal: 24, gap: 14 }}>
        {api.getChildren().map((c) => {
          const on = c.id === store.childId;
          return (
            <Tap
              key={c.id}
              label={`${c.name}, ${c.present ? t('At kindergarten since {{time}}', { time: c.arrivedAt }) : t('Home today · absence reported')}`}
              onPress={() => open(c.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 28,
                padding: 18,
                flexDirection: 'row',
                gap: 16,
                alignItems: 'center',
                borderWidth: 2.5,
                borderColor: on ? colors.coral : '#FFFFFF',
                boxShadow: on ? `0px 6px 0px ${colors.coralSoft}` : '0px 6px 0px #F1E8DE',
                marginBottom: 6,
              }}
            >
              <ChildAvatar kind={c.avatar} tint={c.tint} />
              <View style={{ flex: 1, gap: 4 }}>
                <T d w={800} size={22} lh={24}>
                  {c.name}
                </T>
                <T size={13} w={700} color={colors.muted}>
                  {t('{{n}} yrs', { n: c.age })} · {c.classLabel}
                </T>
                {c.present ? (
                  <Pill label={t('At kindergarten since {{time}}', { time: c.arrivedAt })} bg={colors.leafTint} fg={colors.leafDark} dot={colors.leaf} />
                ) : (
                  <Pill label={t('Home today · absence reported')} bg={colors.sand} fg={colors.muted} />
                )}
              </View>
              <Icon name="chevron" color={on ? colors.coral : colors.muted} strokeWidth={2.4} />
            </Tap>
          );
        })}

        <Tap
          onPress={() => setAdding(true)}
          style={{ borderWidth: 2.5, borderStyle: 'dashed', borderColor: colors.dashed, borderRadius: 28, minHeight: 84, paddingHorizontal: 18, flexDirection: 'row', gap: 14, alignItems: 'center' }}
        >
          <IconTile icon="plus" bg={colors.coralTint} color={colors.coralDark} size={48} r={16} iconSize={22} strokeWidth={2.4} />
          <View style={{ flex: 1 }}>
            <T size={16} w={800} color={colors.coralDark}>
              {t('Add a child')}
            </T>
            <T size={13} w={600} color={colors.muted}>
              {t('Use the code from your kindergarten')}
            </T>
          </View>
        </Tap>
      </View>

      <Sheet visible={adding} onClose={() => setAdding(false)} title={t('Add a child')}>
        <T size={15} lh={22} w={600} color={colors.muted}>
          {t('Your kindergarten gives each family a code. Type it here to link your child.')}
        </T>
        <Field label={t('Kindergarten code')} value={code} onChangeText={(v) => setCode(v.toUpperCase())} placeholder="RW-XXXX" autoCapitalize="characters" active />
        <Button
          label={t('Link my child')}
          disabled={code.replace(/\W/g, '').length < 4}
          onPress={() => {
            setAdding(false);
            setCode('');
            store.toast(t('Request sent — the kindergarten will confirm.'));
          }}
        />
      </Sheet>
    </Screen>
  );
}
