import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ChildId, initialCheckins, initiallyUnread, Message, conversation } from '../data/mock';
import i18n, { Lang, setLanguage } from '../i18n';
import { T } from '../components/ui';
import { colors } from '../theme/tokens';

type Persisted = {
  onboarded: boolean;
  loggedIn: boolean;
  role: 'parent' | 'teacher';
  lang: Lang | null;
  childId: ChildId;
  notifPrefs: Record<string, boolean>;
};

const DEFAULTS: Persisted = {
  onboarded: false,
  loggedIn: false,
  role: 'parent',
  lang: null,
  childId: 'ines',
  notifPrefs: { arr: true, rep: true, pho: true, fee: false },
};

type Session = {
  phone: string;
  pickup: { who: string; time: string };
  enrolled: Record<string, boolean>;
  unread: string[];
  messages: Message[];
  rsvp: 'y' | 'n' | null;
  signed: boolean;
  liked: boolean;
  reminderAck: boolean;
  feesPaid: boolean;
  checkins: Record<number, string>;
};

type Store = Persisted &
  Session & {
    hydrated: boolean;
    set: (patch: Partial<Persisted & Session>) => void;
    chooseLanguage: (l: Lang) => void;
    logOut: () => void;
    toast: (msg: string) => void;
  };

const Ctx = createContext<Store | null>(null);
const KEY = 'rawdati:v1';

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session>({
    phone: '555 12 34 56',
    pickup: { who: 'papa', time: '16:30' },
    enrolled: { swim: true },
    unread: initiallyUnread,
    messages: conversation,
    rsvp: null,
    signed: false,
    liked: false,
    reminderAck: false,
    feesPaid: false,
    checkins: initialCheckins,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = { ...DEFAULTS, ...JSON.parse(raw) } as Persisted;
        setPersisted(saved);
        if (saved.lang) return setLanguage(saved.lang);
      })
      .catch(() => {})
      .finally(() => {
        setLanguage(i18n.language as Lang);
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(KEY, JSON.stringify(persisted)).catch(() => {});
  }, [persisted, hydrated]);

  const toast = useCallback(
    (msg: string) => {
      setToastMsg(msg);
      if (timer.current) clearTimeout(timer.current);
      Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToastMsg(null));
      }, 2200);
    },
    [fade],
  );

  const value = useMemo<Store>(() => {
    const set = (patch: Partial<Persisted & Session>) => {
      const p: Partial<Persisted> = {};
      const s: Partial<Session> = {};
      for (const k of Object.keys(patch) as (keyof (Persisted & Session))[]) {
        if (k in DEFAULTS) (p as Record<string, unknown>)[k] = patch[k];
        else (s as Record<string, unknown>)[k] = patch[k];
      }
      if (Object.keys(p).length) setPersisted((prev) => ({ ...prev, ...p }));
      if (Object.keys(s).length) setSession((prev) => ({ ...prev, ...s }));
    };
    return {
      ...persisted,
      ...session,
      hydrated,
      set,
      toast,
      chooseLanguage: (l) => {
        setLanguage(l);
        set({ lang: l });
      },
      logOut: () => set({ loggedIn: false, role: 'parent' }),
    };
  }, [persisted, session, hydrated, toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {toastMsg && (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={{ position: 'absolute', left: 20, right: 20, bottom: 110, alignItems: 'center', opacity: fade }}
        >
          <View style={{ backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, maxWidth: 360 }}>
            <T size={14} w={800} color="#FFFFFF" center>
              {toastMsg}
            </T>
          </View>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside AppStoreProvider');
  return s;
}

export function useChild() {
  const { childId } = useStore();
  return api.getChild(childId);
}
