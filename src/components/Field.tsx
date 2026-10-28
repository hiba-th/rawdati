import { TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/tokens';
import { fontFamily } from '../theme/fonts';
import { isRTL, useLang } from '../i18n';
import { T } from './ui';

type Props = TextInputProps & { label?: string; teacher?: boolean; active?: boolean; strike?: boolean };

/** Labelled text input matching the design (radius 16, 2px border). */
export function Field({ label, teacher, active, strike, multiline, style, ...rest }: Props) {
  const lang = useLang();
  const border = active ? (teacher ? colors.skyText : colors.coral) : teacher ? colors.borderTeacher : colors.border;
  return (
    <View style={{ gap: 6 }}>
      {label && (
        <T size={13} w={800} color={colors.muted}>
          {label}
        </T>
      )}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.disabled}
        multiline={multiline}
        style={[
          {
            minHeight: multiline ? 76 : 50,
            borderRadius: 16,
            borderWidth: active ? 2.5 : 2,
            borderColor: border,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 12,
            paddingVertical: multiline ? 12 : 0,
            fontFamily: fontFamily(false, multiline ? 600 : 700, lang),
            fontSize: 14,
            color: strike ? colors.muted : colors.ink,
            textDecorationLine: strike ? 'line-through' : 'none',
            textAlignVertical: multiline ? 'top' : 'center',
            textAlign: isRTL(lang) ? 'right' : 'left',
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}
