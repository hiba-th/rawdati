import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { View } from 'react-native';
import { colors } from '../theme/tokens';

/** The arched-doorway logo with a sun dot (viewBox 0 0 40 40). */
export function Logo({ size = 40, hole = '#FFFFFF', withDot }: { size?: number; hole?: string; withDot?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M6 36V20a14 14 0 0 1 28 0v16z" fill={colors.coral} />
      <Path d="M15 36v-9a5 5 0 0 1 10 0v9z" fill={hole} />
      <Circle cx="33" cy="7" r="5" fill={colors.sun} />
      {withDot && <Circle cx="20" cy="15" r="2.6" fill="#FFFFFF" />}
    </Svg>
  );
}

/** Illustrated child face used for the avatars (viewBox 0 0 48 48). */
export function ChildFace({ kind, size = 60 }: { kind: 'girl' | 'boy'; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {kind === 'girl' ? (
        <>
          <Circle cx="9" cy="22" r="5.5" fill="#3B2A22" />
          <Circle cx="39" cy="22" r="5.5" fill="#3B2A22" />
          <Circle cx="24" cy="27" r="15" fill="#F3C6A5" />
          <Path d="M9 25a15 15 0 0 1 30 0c-4-6-9-8-15-8s-11 2-15 8z" fill="#3B2A22" />
        </>
      ) : (
        <>
          <Circle cx="24" cy="27" r="15" fill="#E8B48F" />
          <Path d="M9 24a15 15 0 0 1 30 0c-3-3-7-5-10-5l-2 3-2-3c-5 0-12 2-16 5z" fill="#2B1D16" />
        </>
      )}
      <Circle cx="19" cy="28" r="1.8" fill={colors.ink} />
      <Circle cx="29" cy="28" r="1.8" fill={colors.ink} />
      <Path d="M20 33c2.5 2.5 5.5 2.5 8 0" stroke={colors.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {kind === 'girl' && (
        <>
          <Circle cx="16" cy="32" r="2" fill="#F59C86" opacity={0.6} />
          <Circle cx="32" cy="32" r="2" fill="#F59C86" opacity={0.6} />
        </>
      )}
    </Svg>
  );
}

export function ChildAvatar({ kind, tint, size = 72, r = 24, face = 60 }: { kind: 'girl' | 'boy'; tint: string; size?: number; r?: number; face?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: r, backgroundColor: tint, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <ChildFace kind={kind} size={face} />
    </View>
  );
}

export function Cloud({ width, opacity }: { width: number; opacity: number }) {
  return (
    <Svg width={width} height={(width * 50) / 120} viewBox="0 0 120 50">
      <Path d="M20 45h80a18 18 0 0 0-6-35 24 24 0 0 0-44-2A18 18 0 0 0 20 45z" fill="#FFFFFF" opacity={opacity} />
    </Svg>
  );
}

/** Big kindergarten doorway on the login hero (viewBox 0 0 160 110). */
export function SchoolDoor({ width = 160 }: { width?: number }) {
  return (
    <Svg width={width} height={(width * 110) / 160} viewBox="0 0 160 110">
      <Path d="M20 110V60a60 60 0 0 1 120 0v50z" fill={colors.coral} />
      <Path d="M62 110V80a18 18 0 0 1 36 0v30z" fill={colors.ground} />
      <Circle cx="80" cy="40" r="9" fill={colors.ground} />
      <Rect x="32" y="66" width="20" height="18" rx="5" fill={colors.sunTint} />
      <Rect x="108" y="66" width="20" height="18" rx="5" fill={colors.sunTint} />
    </Svg>
  );
}

export function HappyFace({ size = 72 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="22" fill="#FFFFFF" />
      <Circle cx="17" cy="20" r="2.6" fill={colors.ink} />
      <Circle cx="31" cy="20" r="2.6" fill={colors.ink} />
      <Path d="M14 28c5 7 15 7 20 0" stroke={colors.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** Deterministic 9×9 pick-up QR-style pattern from the design (placeholder for a real QR). */
export function PickupQR({ size = 112, seed = 7 }: { size?: number; seed?: number }) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const finder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
  const cells: boolean[] = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) cells.push(finder(r, c) ? !((r === 1 || r === 7) && (c === 1 || c === 7)) : rnd() > 0.5);
  const cell = 10;
  return (
    <Svg width={size - 20} height={size - 20} viewBox="0 0 90 90">
      {cells.map((on, i) =>
        on ? <Rect key={i} x={(i % 9) * cell} y={Math.floor(i / 9) * cell} width={cell - 1} height={cell - 1} rx={1} fill={colors.ink} /> : null,
      )}
    </Svg>
  );
}
