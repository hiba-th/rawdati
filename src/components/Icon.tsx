import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useIsRTL } from '../i18n';

// Icon paths copied from the design files (24×24, stroke 2, round caps/joins).
const ICONS = {
  back: <Path d="m15 6-6 6 6 6" />,
  chevron: <Path d="m9 6 6 6-6 6" />,
  chevronDown: <Path d="m6 9 6 6 6-6" />,
  arrowRight: <Path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <Path d="m6 12 4 4 8-9" />,
  plus: <Path d="M12 5v14M5 12h14" />,
  chat: <Path d="M4 5h16v11H9l-5 4z" />,
  chatLines: (
    <>
      <Path d="M4 5h16v11H9l-5 4z" />
      <Path d="M9 10h6" />
    </>
  ),
  bell: (
    <>
      <Path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <Path d="M10 21h4" />
    </>
  ),
  clock: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </>
  ),
  swap: <Path d="M4 9h13l-3-3M20 15H7l3 3" />,
  bowl: (
    <>
      <Path d="M5 11h14a7 7 0 0 1-14 0z" />
      <Path d="M9 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4" />
    </>
  ),
  brush: <Path d="M4 20c4 0 5-3 5-5l8-8a2 2 0 0 0-3-3l-8 8c-2 0-5 1-5 5" />,
  moon: <Path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z" />,
  drop: <Path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  calendarCheck: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="3" />
      <Path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" />
    </>
  ),
  calendarX: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="3" />
      <Path d="M3 10h18M8 3v4M16 3v4M10 14l4 4M14 14l-4 4" />
    </>
  ),
  shield: (
    <>
      <Path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />
      <Path d="m9 12 2 2 4-4" />
    </>
  ),
  sprout: <Path d="M12 21V11M12 11c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />,
  card: (
    <>
      <Rect x="3" y="6" width="18" height="13" rx="3" />
      <Path d="M3 10h18M7 15h3" />
    </>
  ),
  megaphone: (
    <>
      <Path d="M3 10v4h4l8 5V5L7 10z" />
      <Path d="M19 9a4 4 0 0 1 0 6" />
    </>
  ),
  home: <Path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  sun: (
    <>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
    </>
  ),
  image: (
    <>
      <Rect x="3" y="4" width="18" height="16" rx="3" />
      <Circle cx="9" cy="10" r="2" />
      <Path d="m21 17-5-5-9 8" />
    </>
  ),
  user: (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  info: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 11v5M12 8h.01" />
    </>
  ),
  phone: (
    <>
      <Rect x="6" y="2.5" width="12" height="19" rx="3" />
      <Path d="M10.5 18h3" />
    </>
  ),
  call: <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  download: <Path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  share: (
    <>
      <Circle cx="18" cy="5" r="2.5" />
      <Circle cx="6" cy="12" r="2.5" />
      <Circle cx="18" cy="19" r="2.5" />
      <Path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
    </>
  ),
  lock: (
    <>
      <Rect x="5" y="11" width="14" height="10" rx="2" />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  receipt: (
    <>
      <Path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <Path d="M9 8h6M9 12h6" />
    </>
  ),
  camera: (
    <>
      <Path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <Circle cx="12" cy="13" r="3.5" />
    </>
  ),
  mic: (
    <>
      <Rect x="9" y="3" width="6" height="11" rx="3" />
      <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  star: <Path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2 8 12.7 4 8.8 9.5 8z" />,
  shirt: <Path d="M8 3h8l1 4-3 1v13H10V8L7 7z" />,
  heart: <Path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  checkCircle: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="m8 12 3 3 5-6" />
    </>
  ),
  clipboard: (
    <>
      <Path d="M6 3h12v18H6z" />
      <Path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  logout: <Path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" />,
  close: <Path d="M6 6l12 12M18 6 6 18" />,
  send: <Path d="M4 12 20 4l-6 16-3-7z" />,
  play: <Path d="M8 5v14l11-7z" />,
  pin: <Path d="M15 3l6 6-3 1-4 4 1 5-2 2-4-5-5 5-1-1 5-5-5-4 2-2 5 1 4-4z" />,
} as const;

export type IconName = keyof typeof ICONS;

// Icons that point in a reading direction and must mirror in RTL.
const DIRECTIONAL: IconName[] = ['back', 'chevron', 'arrowRight', 'send'];

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
};

export function Icon({ name, size = 22, color = '#1E2340', strokeWidth = 2, fill = 'none' }: Props) {
  const rtl = useIsRTL();
  const flip = rtl && DIRECTIONAL.includes(name);
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? { transform: [{ scaleX: -1 }] } : undefined}
    >
      {ICONS[name]}
    </Svg>
  );
}
