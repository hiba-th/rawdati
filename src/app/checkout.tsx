import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { fees, kindergarten, PayMethodId, payMethods } from '../data/mock';
import { feeTotal } from '../data/fees';
import { Icon } from '../components/Icon';
import { Button, RadioDot, Row, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';
import { formatDA } from '../utils/format';

// 19 · Pay — Edahabia / CIB / BaridiMob / cash. Help text and button change with the method.
// Card payments will open the bank's secure page (WebView); card data is never stored here.
export default function Checkout() {
  const { t } = useTranslation();
  const store = useStore();
  const child = useChild();
  const [method, setMethod] = useState<PayMethodId>('edahabia');
  const amount = formatDA(feeTotal(store.enrolled), t('DA'));
  const m = payMethods.find((x) => x.id === method)!;

  const pay = () => {
    if (method === 'edahabia' || method === 'cib') {
      // Real integration: open the SATIM/Algérie Poste secure payment page, then confirm via the backend.
      store.set({ feesPaid: true });
      router.replace('/payment-done');
    } else if (method === 'baridimob') {
      store.toast(t('RIP copied — upload your proof once the transfer is done.'));
    } else {
      store.toast(t('Your cash code is RW-4821'));
    }
  };

  return (
    <Screen
      footer={
        <>
          <Row gap={8} style={{ justifyContent: 'center' }}>
            <Icon name="lock" size={16} color={colors.muted} strokeWidth={2.2} />
            <T size={12} w={700} color={colors.muted}>
              {t('Secure payment · card details never stored by Rawdati')}
            </T>
          </Row>
          <Button label={t(m.cta, { amount })} onPress={pay} />
        </>
      }
    >
      <ScreenHeader title={t('Pay {{month}} fees', { month: t(fees.month) })} fallback="/fees" />

      <Row style={{ marginTop: 16, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 24, paddingVertical: 16, paddingHorizontal: 18, justifyContent: 'space-between' }}>
        <View>
          <T size={13} w={700} color={colors.muted}>
            {child.name} · {child.className}
          </T>
          <T d w={800} size={28} lh={30}>
            {amount}
          </T>
        </View>
        <Tap role="link" onPress={() => router.push('/fees')} style={{ paddingVertical: 10, minHeight: 44, justifyContent: 'center' }}>
          <T size={14} w={800} color={colors.coral}>
            {t('Details')}
          </T>
        </Tap>
      </Row>

      <T size={15} w={800} style={{ marginTop: 22, marginBottom: 10, marginHorizontal: 20 }}>
        {t('How would you like to pay?')}
      </T>
      <View accessibilityRole="radiogroup" accessibilityLabel={t('Payment method')} style={{ paddingHorizontal: 20, gap: 10 }}>
        {payMethods.map((x) => {
          const on = x.id === method;
          return (
            <Tap
              key={x.id}
              role="radio"
              accessibilityState={{ checked: on }}
              label={`${t(x.name)}, ${t(x.sub)}`}
              onPress={() => setMethod(x.id)}
              style={{ minHeight: 72, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 2.5, borderColor: on ? colors.coral : '#FFFFFF', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <View style={{ width: 48, height: 34, borderRadius: 8, backgroundColor: x.chip, alignItems: 'center', justifyContent: 'center' }}>
                <T size={10} w={800} color={x.chipInk} center style={{ fontFamily: 'Nunito_800ExtraBold' }}>
                  {x.short}
                </T>
              </View>
              <View style={{ flex: 1 }}>
                <T size={16} w={800}>
                  {t(x.name)}
                </T>
                <T size={12} w={700} color={colors.muted}>
                  {t(x.sub)}
                </T>
              </View>
              <RadioDot on={on} />
            </Tap>
          );
        })}
      </View>

      <View style={{ marginTop: 14, marginHorizontal: 20, borderRadius: 20, backgroundColor: colors.skyTint, paddingVertical: 14, paddingHorizontal: 16 }}>
        <T size={13} lh={19} w={700} color="#1E3A52">
          {t(m.hint, { rip: kindergarten.rip })}
        </T>
      </View>
    </Screen>
  );
}
