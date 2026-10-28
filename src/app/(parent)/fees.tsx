import { View } from 'react-native';
import { router } from 'expo-router';
import { useChild, useStore } from '../../store/AppStore';
import { useTranslation } from '../../i18n';
import { feeHistory, fees } from '../../data/mock';
import { feeLines, feeTotal } from '../../data/fees';
import { Icon } from '../../components/Icon';
import { Card, Divider, IconTile, Pill, Row, Screen, T, Tap } from '../../components/ui';
import { colors } from '../../theme/tokens';
import { formatDA } from '../../utils/format';

// 18 · Fees — dark summary card with Pay, history linking to receipts.
export default function Fees() {
  const { t } = useTranslation();
  const store = useStore();
  const child = useChild();
  const DA = t('DA');
  const total = feeTotal(store.enrolled);
  const history = store.feesPaid ? [{ month: fees.month, meta: 'Paid 28 Oct · Edahabia', amount: total }, ...feeHistory] : feeHistory;

  return (
    <Screen inTabs>
      <Row style={{ paddingHorizontal: 20, justifyContent: 'space-between' }}>
        <T d w={800} size={30} accessibilityRole="header">
          {t('Fees')}
        </T>
        <Tap onPress={() => router.push('/receipts')} style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="receipt" size={18} strokeWidth={2.2} />
          <T size={14} w={800}>
            {t('Receipts')}
          </T>
        </Tap>
      </Row>

      <View style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 30, backgroundColor: colors.ink, padding: 20, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: colors.sun, opacity: 0.18, right: -40, top: -50 }} />
        <T size={12} w={800} ls={1} color="#C9CBE0" upper>
          {t(fees.month)} · {child.name}
        </T>
        <T d w={800} size={40} lh={44} color="#FFFFFF" style={{ marginTop: 4 }}>
          {formatDA(total, DA)}
        </T>
        {store.feesPaid ? (
          <Pill label={t('Paid ✓')} bg={colors.leafTint} fg={colors.leafDark} style={{ marginTop: 6 }} />
        ) : (
          <Pill label={t('Due by {{date}}', { date: t(fees.due) })} bg={colors.sun} fg={colors.ink} style={{ marginTop: 6 }} />
        )}
        <View style={{ marginTop: 16, gap: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.14)', paddingTop: 14 }}>
          {feeLines(store.enrolled).map((l) => (
            <Row key={l.label} style={{ justifyContent: 'space-between' }}>
              <T size={14} w={700} color="#DADCEB">
                {t(l.label)}
              </T>
              <T size={14} w={700} color="#FFFFFF">
                {formatDA(l.amount, DA)}
              </T>
            </Row>
          ))}
        </View>
        {!store.feesPaid && (
          <Tap onPress={() => router.push('/checkout')} style={{ marginTop: 18, height: 56, borderRadius: 28, backgroundColor: colors.sun, alignItems: 'center', justifyContent: 'center' }}>
            <T size={17} w={800}>
              {t('Pay {{amount}}', { amount: formatDA(total, DA) })}
            </T>
          </Tap>
        )}
      </View>

      <View style={{ marginTop: 22, marginHorizontal: 20 }}>
        <T d w={800} size={20} style={{ marginBottom: 10 }} accessibilityRole="header">
          {t('History')}
        </T>
        <Card pad={0} style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
          {history.map((h, i) => (
            <View key={h.month + i}>
              {i > 0 && <Divider />}
              <Tap onPress={() => router.push('/receipts')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
                <IconTile icon="check" bg={colors.leafTint} color={colors.leafDark} strokeWidth={2.6} />
                <View style={{ flex: 1 }}>
                  <T size={15} w={800}>
                    {t(h.month)}
                  </T>
                  <T size={12} w={700} color={colors.muted}>
                    {t(h.meta)}
                  </T>
                </View>
                <T size={15} w={800}>
                  {formatDA(h.amount, DA)}
                </T>
              </Tap>
            </View>
          ))}
        </Card>
      </View>

      <Tap onPress={() => router.push('/activities')} style={{ marginTop: 14, marginHorizontal: 20, borderRadius: 22, backgroundColor: colors.lilacTint, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <T size={14} w={700} style={{ flex: 1 }}>
          {t('Manage extra activities that are added to your monthly fees')}
        </T>
        <Icon name="chevron" size={20} strokeWidth={2.4} />
      </Tap>
    </Screen>
  );
}
