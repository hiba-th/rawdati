// Sample data from the design handoff (§8). All names are sample data.
// Screens read through `api` below so a real backend can replace this file later.
import { colors } from '../theme/tokens';

export type ChildId = 'ines' | 'adam';

export type Child = {
  id: ChildId;
  name: string;
  fullName: string;
  age: number;
  className: string;
  classLabel: string;
  teacher: string;
  avatar: 'girl' | 'boy';
  tint: string;
  present: boolean;
  arrivedAt?: string;
};

export const kindergarten = {
  name: 'Rawda Les Petits Génies',
  place: 'Chéraga, Alger',
  hours: '07:30–17:00',
  phone: '+213000000000', // placeholder — replace with the real number
  rip: '007 99999 [KINDERGARTEN RIP]',
};

export const children: Child[] = [
  {
    id: 'ines',
    name: 'Ines',
    fullName: 'Ines Benali',
    age: 4,
    className: 'Les Papillons',
    classLabel: 'Les Papillons',
    teacher: 'Mlle Sarah',
    avatar: 'girl',
    tint: colors.coralTint,
    present: true,
    arrivedAt: '08:12',
  },
  {
    id: 'adam',
    name: 'Adam',
    fullName: 'Adam Benali',
    age: 2,
    className: 'Les Poussins',
    classLabel: 'Les Poussins (crèche)',
    teacher: 'Mme Yasmine',
    avatar: 'boy',
    tint: colors.skyTint,
    present: false,
  },
];

export const parent = { name: 'Amel', role: 'maman' };

export type PickupPerson = { id: string; role: string; name: string; init: string; tint: string };
export const pickupPeople: PickupPerson[] = [
  { id: 'mama', role: 'Maman', name: 'Amel', init: 'A', tint: colors.coralTint },
  { id: 'papa', role: 'Papa', name: 'Karim', init: 'K', tint: colors.skyTint },
  { id: 'nana', role: 'Grandma', name: 'Fatiha', init: 'F', tint: colors.lilacTint },
];
export const pickupTimes = ['12:00', '15:00', '16:30', '17:00'];

export const timeline = [
  { icon: 'check', tint: colors.leafTint, ink: colors.leaf, title: 'Arrived', time: '08:12', stroke: 2.4 },
  { icon: 'bowl', tint: colors.sunTint, ink: colors.sunInk, title: 'Snack · ate well', sub: 'Milk and msemen', time: '09:30' },
  { icon: 'brush', tint: colors.lilacTint, ink: colors.lilac, title: 'Painting workshop', sub: 'She painted a big sun', time: '10:30' },
  { icon: 'moon', tint: colors.skyTint, ink: colors.skyText, title: 'Napping now', sub: 'Fell asleep at 13:05', live: true },
] as const;

export const meals = [
  { name: 'Snack', time: '09:30', food: 'Milk, msemen', level: 3 as const },
  { name: 'Lunch', time: '12:00', food: 'Chicken couscous, orange', level: 4 as const },
  { name: 'Goûter', time: '15:30', food: 'Not yet', level: null },
];

export const dayActivities = [
  { label: 'Painting', bg: colors.lilacTint, fg: colors.lilacDark },
  { label: 'Songs & rhymes', bg: colors.skyTint, fg: colors.skyInk },
  { label: 'Garden play', bg: colors.leafTint, fg: colors.leafDark },
  { label: 'Letters: أ ب ت', bg: colors.sunTint, fg: colors.sunInk },
];

export type Photo = { id: string; color: string; label?: string; video?: string; mine?: boolean };
export const photosToday: Photo[] = [
  { id: 'p1', color: colors.photoYellow, label: 'Painting time', mine: true },
  { id: 'p2', color: colors.photoBlue, label: 'Garden', mine: true },
  { id: 'v1', color: colors.photoCoral, label: 'Singing', video: '0:38' },
  { id: 'p3', color: colors.photoGreen, label: 'Lunch' },
  { id: 'p4', color: colors.photoLilac, label: 'Story', mine: true },
  { id: 'p5', color: colors.photoSun, label: 'Blocks' },
];
export const photosYesterday: Photo[] = ['#F7C2B4', '#BFE0F4', '#FFE3A1', '#C6EBD3', '#DCD2F5', '#F7C2B4'].map((color, i) => ({
  id: `y${i}`,
  color,
  mine: i % 2 === 0,
}));

export type DayStatus = 'present' | 'late' | 'absent' | 'weekend' | 'future';
// October 2026 starts on a Thursday. Algeria's weekend is Friday + Saturday.
export function octoberAttendance(): { day: number; status: DayStatus; today: boolean }[] {
  const late = [6, 21];
  const absent = [14];
  const out = [];
  for (let d = 1; d <= 31; d++) {
    const dow = (4 + d - 1) % 7; // 0 = Sunday
    let status: DayStatus;
    if (dow === 5 || dow === 6) status = 'weekend';
    else if (d > 28) status = 'future';
    else if (absent.includes(d)) status = 'absent';
    else if (late.includes(d)) status = 'late';
    else status = 'present';
    out.push({ day: d, status, today: d === 28 });
  }
  return out;
}

export const attendanceLog = [
  { day: 'Tue 27', text: 'In 08:05 · Out 16:34', status: 'present' as const },
  { day: 'Wed 21', text: 'In 09:20 · Out 16:30', status: 'late' as const },
  { day: 'Wed 14', text: 'Fever — reported by you', status: 'absent' as const },
];

export type Slot = { time: string; title: string; sub: string; dot: string; tag?: { label: string; kind: 'moved' | 'repl' | 'cancel' } };
const baseSlots: Slot[] = [
  { time: '08:00', title: 'Welcome & free play', sub: 'Main room', dot: colors.leaf },
  { time: '09:30', title: 'Snack', sub: 'Dining room', dot: colors.sun },
  { time: '10:00', title: 'Arabic letters & songs', sub: 'Mlle Sarah', dot: colors.lilac },
  { time: '12:00', title: 'Lunch', sub: 'Dining room', dot: colors.sun },
  { time: '13:00', title: 'Nap time', sub: 'Quiet room', dot: colors.sky },
];
export const weekDays = [
  { dow: 'Sun', n: 25 },
  { dow: 'Mon', n: 26 },
  { dow: 'Tue', n: 27 },
  { dow: 'Wed', n: 28 },
  { dow: 'Thu', n: 29 },
];
const changes: Record<number, Slot> = {
  2: { time: '10:00', title: 'Swimming', sub: 'Moved to Thursday 10:00', dot: colors.sky, tag: { label: 'Moved', kind: 'cancel' } },
  3: { time: '10:00', title: 'Music with Mr Yanis', sub: 'Replaces English — Mme Lila is away', dot: colors.lilac, tag: { label: 'Replacement', kind: 'repl' } },
  4: { time: '10:00', title: 'Swimming', sub: 'Moved from Tuesday · bring swimsuit & towel', dot: colors.sky, tag: { label: 'New time', kind: 'moved' } },
};
export function slotsFor(dayIndex: number): Slot[] {
  const c = changes[dayIndex];
  return c ? [baseSlots[0], baseSlots[1], c, baseSlots[3], baseSlots[4]] : baseSlots;
}
export const changedDays = Object.keys(changes).map(Number);

export const milestones = [
  { title: 'Writes her first name', meta: '22 Oct · Mlle Sarah' },
  { title: 'Counts to 10 in Arabic & French', meta: '15 Oct · Mlle Sarah' },
];
export const skills: { name: string; level: 1 | 2 | 3 }[] = [
  { name: 'Language & speaking', level: 3 },
  { name: 'Fine motor (pencil, scissors)', level: 2 },
  { name: 'Big movements', level: 3 },
  { name: 'Friends & feelings', level: 3 },
  { name: 'Numbers & shapes', level: 2 },
  { name: 'Doing it myself', level: 1 },
];

export type Message = { id: string; from: 'teacher' | 'me'; text: string; time: string; photo?: { color: string; label: string }; status?: string };
export const conversation: Message[] = [
  { id: 'm1', from: 'teacher', text: 'Good morning! Ines arrived happy. She’s asking for her blue cardigan — is it in her bag?', time: '08:20' },
  { id: 'm2', from: 'me', text: 'Yes, front pocket. Thank you! She coughed a bit last night, please keep an eye on her.', time: '08:31', status: 'Seen' },
  { id: 'm3', from: 'teacher', text: 'No cough at all today. Look at her masterpiece!', time: '11:05', photo: { color: colors.photoYellow, label: 'Photo · Painting' } },
];
export const quickReplies = [
  { label: 'Running late', text: 'We’re running 15 minutes late this morning.' },
  { label: 'Absent today', text: 'Ines will be absent today. Thank you!' },
  { label: 'Medicine note', text: 'Ines needs her syrup at 12:00 — the bottle is in her bag.' },
];

export type Notif = { id: string; href: string; glyph: string; tint: string; ink: string; title: string; body: string; time: string; today: boolean };
export const notifications: Notif[] = [
  { id: 'n1', href: '/photos', glyph: '6', tint: colors.sunTint, ink: colors.sunInk, title: '6 new photos', body: 'Mlle Sarah shared photos from the painting workshop.', time: '11:05', today: true },
  { id: 'n2', href: '/schedule', glyph: '↻', tint: colors.sunTint, ink: colors.sunInk, title: 'Swimming moved', body: 'Tuesday’s swimming is now on Thursday at 10:00.', time: '09:40', today: true },
  { id: 'n3', href: '/schedule', glyph: '⇄', tint: colors.skyTint, ink: colors.skyInk, title: 'Replacement activity', body: 'Music with Mr Yanis replaces English today.', time: '08:45', today: true },
  { id: 'n4', href: '/attendance', glyph: '✓', tint: colors.leafTint, ink: colors.leafDark, title: 'Ines arrived', body: 'Checked in at 08:12 by Mlle Sarah.', time: '08:12', today: true },
  { id: 'n5', href: '/fees', glyph: 'DA', tint: colors.coralTint, ink: colors.coralDark, title: 'December fees ready', body: '15 000 DA due by 5 December.', time: 'Mon 26 Oct', today: false },
  { id: 'n6', href: '/news', glyph: '!', tint: colors.lilacTint, ink: colors.lilacDark, title: 'Holiday: 1 November', body: 'Kindergarten closed for Revolution Day.', time: 'Sun 25 Oct', today: false },
  { id: 'n7', href: '/receipts', glyph: '✓', tint: colors.leafTint, ink: colors.leafDark, title: 'Payment received', body: 'November fees — receipt #RW-1042.', time: '2 Oct', today: false },
];
// n4 is already read in the design
export const initiallyUnread = ['n1', 'n2', 'n3'];

export type Activity = { id: string; name: string; when: string; price: number; left: number; glyph: string; tint: string; ink: string };
export const activities: Activity[] = [
  { id: 'swim', name: 'Swimming', when: 'Thursday 10:00 · with coach Nadia', price: 3000, left: 2, glyph: '≈', tint: colors.skyTint, ink: colors.skyInk },
  { id: 'quran', name: 'Quran & nasheed', when: 'Wednesday 14:00 · Mme Houria', price: 2000, left: 3, glyph: 'ق', tint: colors.leafTint, ink: colors.leafDark },
  { id: 'eng', name: 'English through songs', when: 'Monday 14:30 · Mme Lila', price: 2500, left: 6, glyph: 'A', tint: colors.lilacTint, ink: colors.lilacDark },
  { id: 'chef', name: 'Little chefs', when: 'Sunday 14:00 · baking & tasting', price: 2000, left: 0, glyph: '◡', tint: colors.sunTint, ink: colors.sunInk },
  { id: 'judo', name: 'Baby judo', when: 'Tuesday 15:00 · Sensei Rachid', price: 3000, left: 4, glyph: '◎', tint: colors.coralTint, ink: colors.coralDark },
];

export const fees = {
  month: 'December',
  due: 'Saturday 5 December',
  dueShort: '5 Dec',
  lines: [
    { label: 'Kindergarten (monthly)', amount: 10000 },
    { label: 'Canteen', amount: 2000 },
  ],
};
export const feeHistory = [
  { month: 'November', meta: 'Paid 2 Nov · Edahabia', amount: 15000 },
  { month: 'October', meta: 'Paid 3 Oct · Cash at reception', amount: 12000 },
  { month: 'September + registration', meta: 'Paid 6 Sep · BaridiMob', amount: 20000 },
];
export const receipts = [
  { title: 'December fees', meta: '#RW-1088 · 28 Oct · Edahabia', amount: 15000 },
  { title: 'November fees', meta: '#RW-1042 · 2 Oct · Edahabia', amount: 15000 },
  { title: 'October fees', meta: '#RW-0987 · 3 Oct · Cash', amount: 12000 },
  { title: 'September + registration', meta: '#RW-0911 · 6 Sep · BaridiMob', amount: 20000 },
];

export type PayMethodId = 'edahabia' | 'cib' | 'baridimob' | 'cash';
export const payMethods: { id: PayMethodId; name: string; sub: string; short: string; chip: string; chipInk: string; hint: string; cta: string }[] = [
  { id: 'edahabia', name: 'Edahabia card', sub: 'Algérie Poste gold card', short: 'GOLD', chip: colors.sun, chipInk: colors.ink, hint: 'You’ll enter your Edahabia card number and the SMS code from Algérie Poste on the secure payment page.', cta: 'Pay {{amount}} with Edahabia' },
  { id: 'cib', name: 'CIB card', sub: 'Any Algerian bank card', short: 'CIB', chip: colors.sky, chipInk: '#FFFFFF', hint: 'You’ll be sent to the secure interbank payment page to enter your CIB card and confirm.', cta: 'Pay {{amount}} with CIB' },
  { id: 'baridimob', name: 'BaridiMob transfer', sub: 'Send to the kindergarten’s RIP', short: 'MOB', chip: colors.leaf, chipInk: '#FFFFFF', hint: 'Transfer to RIP {{rip}} with reference RW-INES-12, then upload your proof. We confirm within 24 h.', cta: 'Copy RIP & upload proof' },
  { id: 'cash', name: 'Cash at reception', sub: 'Pay in person, get a digital receipt', short: 'DA', chip: colors.line, chipInk: colors.ink, hint: 'Show code RW-4821 at reception. The receipt appears in the app as soon as the staff confirms.', cta: 'Get my cash code' },
];

export const classKids = ['Ines', 'Lina', 'Yanis', 'Rayan', 'Meriem', 'Amir', 'Sara', 'Anis', 'Nour', 'Adel', 'Malak', 'Ilyes', 'Hiba', 'Wassim', 'Aya', 'Ryad'];
export const absentKids = [5, 13];
export const initialCheckins: Record<number, string> = { 0: '08:12', 1: '08:05', 2: '07:58', 3: '08:20', 4: '08:01', 6: '08:15', 7: '07:50', 8: '08:10', 10: '08:22', 11: '08:03', 12: '08:18', 14: '08:09' };

export type Family = { child: string; parents: string; phone: string; unread: number; last?: string };
// One family per child in Les Papillons (sample data).
export const families: Family[] = [
  { child: 'Ines', parents: 'Amel & Karim', phone: '0555 12 34 56', unread: 1, last: 'Yes, front pocket. Thank you! She coughed a bit last night, please keep an eye on her.' },
  { child: 'Lina', parents: 'Sabrina & Nadir', phone: '0661 20 45 78', unread: 0, last: 'Thank you for the photos!' },
  { child: 'Yanis', parents: 'Meriem & Sofiane', phone: '0770 88 12 03', unread: 2, last: 'Yanis will be picked up at 15:00 today.' },
  { child: 'Rayan', parents: 'Lamia & Walid', phone: '0550 41 19 62', unread: 0 },
  { child: 'Meriem', parents: 'Houda & Samir', phone: '0698 07 33 21', unread: 0 },
  { child: 'Amir', parents: 'Nawel & Farid', phone: '0662 54 90 17', unread: 1, last: 'Amir has a fever, he stays home today.' },
  { child: 'Sara', parents: 'Imane & Hakim', phone: '0771 36 28 44', unread: 0 },
  { child: 'Anis', parents: 'Kahina & Mourad', phone: '0557 63 72 05', unread: 0 },
  { child: 'Nour', parents: 'Asma & Tarek', phone: '0665 19 84 30', unread: 0 },
  { child: 'Adel', parents: 'Siham & Nabil', phone: '0774 02 51 96', unread: 0 },
  { child: 'Malak', parents: 'Wafa & Riad', phone: '0559 47 06 81', unread: 0 },
  { child: 'Ilyes', parents: 'Nadia & Karim', phone: '0697 85 23 14', unread: 0 },
  { child: 'Hiba', parents: 'Souad & Yacine', phone: '0663 30 67 52', unread: 0 },
  { child: 'Wassim', parents: 'Leila & Omar', phone: '0775 12 98 40', unread: 0 },
  { child: 'Aya', parents: 'Rania & Bilal', phone: '0551 76 44 09', unread: 0 },
  { child: 'Ryad', parents: 'Dalila & Amine', phone: '0664 58 31 27', unread: 0 },
];

/** A note the teacher sends to one family (child name) or to the whole class ('all'). */
export type TeacherNote = { id: string; to: string; text: string; time: string };

export const noteTemplates = [
  'Great day today!',
  'Please bring spare clothes tomorrow.',
  'Please pack more diapers.',
  'Ate very well today.',
  'A little tired today, nothing to worry about.',
];

export const logTypes = [
  { id: 'meal', label: 'Meal', glyph: '◡', question: 'How much did they eat?', opts: ['None', 'Some', 'Most', 'All'] },
  { id: 'nap', label: 'Nap', glyph: '☾', question: 'Nap', opts: ['Started', 'Woke up', 'Short', 'No nap'] },
  { id: 'toilet', label: 'Toilet', glyph: '◦', question: 'Toilet', opts: ['Potty', 'Diaper', 'Accident', 'Changed'] },
  { id: 'mood', label: 'Mood', glyph: '☺', question: 'Mood', opts: ['Happy', 'Calm', 'Tired', 'Upset'] },
  { id: 'act', label: 'Activity', glyph: '✶', question: 'Activity', opts: ['Painting', 'Songs', 'Garden', 'Letters'] },
];

// Thin data-access layer: swap these for API calls when the backend exists.
export const api = {
  getChildren: () => children,
  getChild: (id: ChildId) => children.find((c) => c.id === id) ?? children[0],
};
