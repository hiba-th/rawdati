import { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';
import { useTranslation } from '../i18n';
import { CircleButton, T } from './ui';

/** Bottom sheet used for small forms (report an absence, add a child…). */
export function Sheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable accessibilityLabel={t('Close')} onPress={onClose} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(30,35,64,0.45)' }} />
        <View
          style={{
            backgroundColor: colors.ground,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            maxHeight: '88%',
            width: '100%',
            maxWidth: 480,
            alignSelf: 'center',
            paddingBottom: insets.bottom + 24,
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, gap: 12 }}>
            <T d w={800} size={24} style={{ flex: 1 }} accessibilityRole="header">
              {title}
            </T>
            <CircleButton icon="close" label={t('Close')} onPress={onClose} size={44} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
