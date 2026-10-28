// Design tokens from design/rawdati-handoff/design-tokens.json
export const colors = {
  ink: '#1E2340',
  muted: '#5E6380',
  ground: '#FFF8F1',
  groundTeacher: '#F2F5FA',
  surface: '#FFFFFF',
  line: '#F4ECE3',
  border: '#EFE4D8',
  borderTeacher: '#E2E7EF',
  coral: '#C8462B',
  coralDark: '#9C3420',
  coralTint: '#FFE6DE',
  coralSoft: '#F2CFC4',
  sun: '#FFC93C',
  sunBright: '#FFD45C',
  sunLight: '#FFE08A',
  sunTint: '#FFF3CC',
  sunInk: '#6B5310',
  sunInkDark: '#5A4A12',
  leaf: '#2A7F50',
  leafDark: '#1F6A42',
  leafTint: '#DFF3E7',
  sky: '#2F7FB8',
  skyText: '#276A9A',
  skyInk: '#225E89',
  skyDark: '#1C4F74',
  skyTint: '#E1F0FA',
  lilac: '#6A4FB3',
  lilacDark: '#563D9E',
  lilacTint: '#EEE8FB',
  disabled: '#A39C93',
  disabledDark: '#8A8478',
  sand: '#F1E8DE',
  ringOff: '#C9C3D6',
  dashed: '#E3C9BC',
  // photo placeholder fills
  photoYellow: '#FFC93C',
  photoBlue: '#8CC4EA',
  photoCoral: '#F59C86',
  photoGreen: '#A9D9B9',
  photoLilac: '#CDBEF0',
  photoSun: '#FFE08A',
} as const;

export const status = {
  present: colors.leaf,
  late: colors.sun,
  absent: colors.coral,
  weekend: colors.line,
} as const;

export const radius = { card: 26, hero: 30, tile: 20, iconTile: 14, input: 18, pill: 999 } as const;
export const space = { screenX: 20, screenTop: 52, cardPad: 18, gap: 12, gapLarge: 16 } as const;

export const shadow = {
  buttonLip: `0px 6px 0px ${colors.coralDark}`,
  buttonLipTeacher: `0px 6px 0px ${colors.skyDark}`,
  cardLipSelected: `0px 6px 0px ${colors.coralSoft}`,
  cardLip: '0px 4px 0px #F1E8DE',
  tabBar: '0px -4px 20px rgba(30,35,64,0.06)',
} as const;

export type ColorName = keyof typeof colors;
