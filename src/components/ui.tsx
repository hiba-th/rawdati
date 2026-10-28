import { Children, ReactNode } from 'react';
import {
  AccessibilityRole,
  Pressable,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, space } from '../theme/tokens';
import { fontFamily, Weight } from '../theme/fonts';
import { isRTL, useLang, useTranslation } from '../i18n';
import { Icon, IconName } from './Icon';

/* ---------- Text ---------- */

type TProps = TextProps & {
  size?: number;
  w?: Weight;
  /** display face (Baloo 2) */
  d?: boolean;
  color?: string;
  lh?: number;
  ls?: number;
  center?: boolean;
  upper?: boolean;
  style?: StyleProp<TextStyle>;
};

export function T({ size = 15, w = 700, d = false, color = colors.ink, lh, ls, center, upper, style, ...rest }: TProps) {
  const lang = useLang();
  const ar = lang === 'ar';
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: fontFamily(d, w, lang),
          fontSize: size,
          color,
          // Arabic glyphs sit taller; give them more room and never letter-space them.
          lineHeight: lh ? (ar ? Math.round(lh * 1.25) : lh) : undefined,
          letterSpacing: ar ? 0 : ls,
          textAlign: center ? 'center' : isRTL(lang) ? 'right' : 'left',
          textTransform: upper ? 'uppercase' : 'none',
        },
        style,
      ]}
    />
  );
}

/* ---------- Pressable ---------- */

type TapProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  label?: string;
  role?: AccessibilityRole;
};

export function Tap({ style, label, role = 'button', children, ...rest }: TapProps) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityLabel={label}
      style={({ pressed }) => [style, pressed && !rest.disabled && { opacity: 0.82, transform: [{ scale: 0.985 }] }]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

/* ---------- Buttons ---------- */

type Variant = 'primary' | 'teacher' | 'dark' | 'outline' | 'yellow' | 'white' | 'disabled';

const VARIANTS: Record<Variant, { bg: string; fg: string; lip?: string; border?: string }> = {
  primary: { bg: colors.coral, fg: '#FFFFFF', lip: colors.coralDark },
  teacher: { bg: colors.skyText, fg: '#FFFFFF', lip: colors.skyDark },
  dark: { bg: colors.ink, fg: '#FFFFFF' },
  outline: { bg: '#FFFFFF', fg: colors.coral, border: colors.coral },
  yellow: { bg: colors.sun, fg: colors.ink },
  white: { bg: '#FFFFFF', fg: colors.ink },
  disabled: { bg: colors.disabled, fg: '#FFFFFF', lip: colors.disabledDark },
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  height?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  a11yLabel?: string;
};

export function Button({ label, onPress, variant = 'primary', icon, height = 58, size = 17, style, disabled, a11yLabel }: ButtonProps) {
  const v = VARIANTS[disabled ? 'disabled' : variant];
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      label={a11yLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: v.bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingHorizontal: 22,
          borderWidth: v.border ? 2.5 : 0,
          borderColor: v.border,
          boxShadow: v.lip ? `0px 6px 0px ${v.lip}` : undefined,
          marginBottom: v.lip ? 6 : 0,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={20} color={v.fg} strokeWidth={2.2} />}
      <T size={size} w={800} color={v.fg} center numberOfLines={1}>
        {label}
      </T>
    </Tap>
  );
}

export function CircleButton({
  icon,
  label,
  onPress,
  size = 48,
  bg = '#FFFFFF',
  color = colors.ink,
  iconSize = 22,
  strokeWidth = 2.4,
  disabled,
  children,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  size?: number;
  bg?: string;
  color?: string;
  iconSize?: number;
  strokeWidth?: number;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <Tap
      label={label}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled: !!disabled }}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon name={icon} size={iconSize} color={color} strokeWidth={strokeWidth} />
      {children}
    </Tap>
  );
}

export function goBack(fallback: string = '/home') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback as never);
}

export function BackButton({ fallback, bg, size }: { fallback?: string; bg?: string; size?: number }) {
  const { t } = useTranslation();
  return <CircleButton icon="back" label={t('Back')} bg={bg} size={size} onPress={() => goBack(fallback)} />;
}

/* ---------- Layout ---------- */

export function useTopPad() {
  const insets = useSafeAreaInsets();
  return Math.max(space.screenTop, insets.top + 10);
}

type ScreenProps = {
  children: ReactNode;
  bg?: string;
  footer?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  refreshControl?: ScrollViewProps['refreshControl'];
  /** set when the screen sits above a tab bar (no bottom safe-area needed) */
  inTabs?: boolean;
};

export function Screen({ children, bg = colors.ground, footer, scroll = true, contentStyle, refreshControl, inTabs }: ScreenProps) {
  const top = useTopPad();
  const insets = useSafeAreaInsets();
  const bottom = inTabs ? 0 : insets.bottom;
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {scroll ? (
        <ScrollView
          refreshControl={refreshControl}
          contentContainerStyle={[{ paddingTop: top, paddingBottom: footer ? 16 : 32 + bottom }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingTop: top }, contentStyle]}>{children}</View>
      )}
      {footer && (
        <View style={{ paddingHorizontal: space.screenX, paddingTop: 10, paddingBottom: (inTabs ? 20 : 36) + bottom, gap: 10, backgroundColor: bg }}>
          {footer}
        </View>
      )}
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  fallback,
  titleSize = 26,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  fallback?: string;
  titleSize?: number;
}) {
  return (
    <View style={{ paddingHorizontal: space.screenX, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <BackButton fallback={fallback} />
      <View style={{ flex: 1 }}>
        <T d w={800} size={titleSize} lh={titleSize + 4} accessibilityRole="header" numberOfLines={2}>
          {title}
        </T>
        {subtitle ? (
          <T size={13} w={700} color={colors.muted}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function Grid({ cols, gap = 10, children, style }: { cols: number; gap?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const items = Children.toArray(children);
  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
  return (
    <View style={[{ gap }, style]}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap }}>
          {row.map((cell, c) => (
            <View key={c} style={{ flex: 1, minWidth: 0 }}>
              {cell}
            </View>
          ))}
          {Array.from({ length: cols - row.length }).map((_, i) => (
            <View key={`pad${i}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </View>
  );
}

export function Card({ children, style, pad = space.cardPad, r = radius.card }: { children: ReactNode; style?: StyleProp<ViewStyle>; pad?: number; r?: number }) {
  return <View style={[{ backgroundColor: colors.surface, borderRadius: r, padding: pad }, style]}>{children}</View>;
}

export function Row({ children, gap = 12, style, align = 'center' }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle>; align?: ViewStyle['alignItems'] }) {
  return <View style={[{ flexDirection: 'row', alignItems: align, gap }, style]}>{children}</View>;
}

export function Divider({ color = colors.line }: { color?: string }) {
  return <View style={{ height: 1.5, backgroundColor: color }} />;
}

export function SectionHeader({ title, action, onAction, style }: { title: string; action?: string; onAction?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, style]}>
      <T d w={800} size={22} accessibilityRole="header">
        {title}
      </T>
      {action && (
        <Tap onPress={onAction} role="link" style={{ paddingVertical: 8, minHeight: 44, justifyContent: 'center' }}>
          <T size={14} w={800} color={colors.coral}>
            {action}
          </T>
        </Tap>
      )}
    </View>
  );
}

/* ---------- Small pieces ---------- */

export function IconTile({
  icon,
  bg,
  color,
  size = 40,
  r = 14,
  iconSize = 20,
  strokeWidth = 2,
  fill,
}: {
  icon: IconName;
  bg: string;
  color: string;
  size?: number;
  r?: number;
  iconSize?: number;
  strokeWidth?: number;
  fill?: string;
}) {
  return (
    <View style={{ width: size, height: size, borderRadius: r, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name={icon} size={iconSize} color={color} strokeWidth={strokeWidth} fill={fill} />
    </View>
  );
}

export function GlyphTile({ glyph, bg, color, size = 42, r = 14, fontSize = 18, round }: { glyph: string; bg: string; color: string; size?: number; r?: number; fontSize?: number; round?: boolean }) {
  return (
    <View style={{ width: size, height: size, borderRadius: round ? size / 2 : r, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <T d w={800} size={fontSize} color={color} center>
        {glyph}
      </T>
    </View>
  );
}

export function Pill({
  label,
  bg,
  fg,
  size = 12,
  px = 10,
  py = 4,
  dot,
  style,
}: {
  label: string;
  bg: string;
  fg: string;
  size?: number;
  px?: number;
  py?: number;
  dot?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: bg, paddingHorizontal: px, paddingVertical: py, borderRadius: radius.pill, alignSelf: 'flex-start' }, style]}>
      {dot && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} />}
      <T size={size} w={800} color={fg}>
        {label}
      </T>
    </View>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Tap
      role="switch"
      label={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={{
        width: 52,
        height: 32,
        borderRadius: 16,
        padding: 3,
        backgroundColor: value ? colors.leaf : colors.ringOff,
        flexDirection: 'row',
        justifyContent: value ? 'flex-end' : 'flex-start',
      }}
    >
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0,0,0,0.2)' }} />
    </Tap>
  );
}

export function RadioDot({ on, size = 24, check, color = colors.coral }: { on: boolean; size?: number; check?: boolean; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2.5,
        borderColor: on ? color : colors.ringOff,
        backgroundColor: on ? color : '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {check && on && <Icon name="check" size={14} color="#FFFFFF" strokeWidth={3.2} />}
    </View>
  );
}

export function Checkbox({ on, color = colors.coral }: { on: boolean; color?: string }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: on ? color : colors.ringOff,
        backgroundColor: on ? color : '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {on && <Icon name="check" size={14} color="#FFFFFF" strokeWidth={3.2} />}
    </View>
  );
}

export function CheckRow({ on, onChange, label, color }: { on: boolean; onChange: (v: boolean) => void; label: string; color?: string }) {
  return (
    <Tap role="checkbox" accessibilityState={{ checked: on }} onPress={() => onChange(!on)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 }}>
      <Checkbox on={on} color={color} />
      <T size={14} w={700} style={{ flex: 1 }}>
        {label}
      </T>
    </Tap>
  );
}

const MEAL_LABELS = ['Ate none', 'Ate some', 'Ate most', 'Ate all'];

export function MealMeter({ level }: { level: 1 | 2 | 3 | 4 | 0 }) {
  const { t } = useTranslation();
  return (
    <View accessible accessibilityLabel={t(MEAL_LABELS[Math.max(0, level - 1)])} style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: i <= level ? colors.leaf : '#E3EDE6' }} />
      ))}
    </View>
  );
}

const LEVELS = [
  { label: 'Starting', bg: colors.coralTint, fg: colors.coralDark, bar: colors.coral },
  { label: 'Getting there', bg: colors.sunTint, fg: colors.sunInk, bar: '#E0A800' },
  { label: 'Confident', bg: colors.leafTint, fg: colors.leafDark, bar: colors.leaf },
];

export function LevelBar({ name, level }: { name: string; level: 1 | 2 | 3 }) {
  const { t } = useTranslation();
  const l = LEVELS[level - 1];
  return (
    <View style={{ gap: 6 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <T size={14} w={800} style={{ flex: 1 }}>
          {name}
        </T>
        <Pill label={t(l.label)} bg={l.bg} fg={l.fg} py={3} />
      </Row>
      <View accessible accessibilityRole="image" accessibilityLabel={`${name}: ${t(l.label)}`} style={{ flexDirection: 'row', gap: 4 }}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: i <= level ? l.bar : colors.sand }} />
        ))}
      </View>
    </View>
  );
}

export function InfoNote({ icon = 'info', text, bg = '#FFFFFF' }: { icon?: IconName; text: string; bg?: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <IconTile icon={icon} bg={colors.skyTint} color={colors.skyText} />
      <T size={13} lh={18} w={600} color={colors.muted} style={{ flex: 1 }}>
        {text}
      </T>
    </View>
  );
}

/** Coloured block standing in for a real photo (see HANDOFF §8 placeholders). */
export function PhotoBlock({
  color,
  label,
  height,
  r = 20,
  onPress,
  a11y,
  labelSize = 12,
  children,
  style,
}: {
  color: string;
  label?: string;
  height: number;
  r?: number;
  onPress?: () => void;
  a11y?: string;
  labelSize?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const inner = (
    <>
      {children}
      {label ? (
        <T size={labelSize} w={800}>
          {label}
        </T>
      ) : null}
    </>
  );
  const s: StyleProp<ViewStyle> = [{ height, borderRadius: r, backgroundColor: color, justifyContent: 'flex-end', padding: 10 }, style];
  if (onPress)
    return (
      <Tap label={a11y ?? label} onPress={onPress} style={s}>
        {inner}
      </Tap>
    );
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={a11y ?? label} style={s}>
      {inner}
    </View>
  );
}

export { shadow };
