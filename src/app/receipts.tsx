import { useState } from 'react';
import { View } from 'react-native';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { receipts } from '../data/mock';
import { Button, Checkbox, Divider, Row, Screen, ScreenHeader, T, Tap } from '../components/ui';
import { colors } from '../theme/tokens';
import { formatDA } from '../utils/format';

const YEARS = ['2026–2027', '2025–2026'];

// 21 · Receipts — school year, total paid, select several and download one PDF.
export default function Receipts() {
  const { t } = useTranslation();
  const store = useStore();
  const DA = t('DA');
  const [year, setYear] = useState(0);
  const [sel, setSel] = useState<Record<number, boolean>>({ 0: true });
  const list = year === 0 ? receipts : [];
  const count = list.filter((_, i) => sel[i]).length;
  const all = list.length > 0 && count === list.length;
  const total = list.reduce((s, r) => s + r.amount, 0);

  const label = count === 0 ? t('Select receipts to download') : count === 1 ? t('Download 1 receipt (PDF)') : t('Download {{n}} receipts (one PDF)', { n: count });

  return (
    <Screen footer={<Button icon="download" label={label} disabled={count === 0} onPress={() => store.toast(t('{{n}} receipt(s) saved as one PDF', { n: count }))} />}>
      <ScreenHeader
        title={t('Receipts')}
        fallback="/fees"
        right={
          <Tap
            label={t('School year {{y}}, change', { y: YEARS[year] })}
            onPress={() => {
              setYear((y) => (y + 1) % YEARS.length);
              setSel({});
            }}
            style={{ backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, minHeight: 44, justifyContent: 'center' }}
          >
            <T size={13} w={800}>
              {YEARS[year]}
            </T>
          </Tap>
        }
      />

      <Row style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 26, backgroundColor: colors.sunTint, paddingVertical: 16, paddingHorizontal: 18, justifyContent: 'space-between' }}>
        <View>
          <T size={12} w={800} color={colors.sunInkDark} upper>
            {t('Paid this school year')}
          </T>
          <T d w={800} size={28} lh={30}>
            {formatDA(total, DA)}
          </T>
        </View>
        <T size={13} w={800} color={colors.sunInkDark}>
          {t('{{n}} receipts', { n: list.length })}
        </T>
      </Row>

      <Row style={{ marginTop: 18, marginBottom: 8, marginHorizontal: 20, justifyContent: 'space-between' }}>
        <T size={15} w={800} accessibilityRole="header">
          {t('All receipts')}
        </T>
        {list.length > 0 && (
          <Tap
            onPress={() => {
              const n: Record<number, boolean> = {};
              if (!all) list.forEach((_, i) => (n[i] = true));
              setSel(n);
            }}
            style={{ minHeight: 44, paddingHorizontal: 4, justifyContent: 'center' }}
          >
            <T size={14} w={800} color={colors.coral}>
              {all ? t('Clear') : t('Select all')}
            </T>
          </Tap>
        )}
      </Row>

      <View style={{ marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 26, paddingVertical: 4, paddingHorizontal: 14 }}>
        {list.length === 0 && (
          <T size={14} w={700} color={colors.muted} center style={{ paddingVertical: 24 }}>
            {t('No receipts for this school year yet.')}
          </T>
        )}
        {list.map((r, i) => (
          <View key={r.meta}>
            {i > 0 && <Divider />}
            <Tap role="checkbox" accessibilityState={{ checked: !!sel[i] }} label={`${t(r.title)}, ${formatDA(r.amount, DA)}`} onPress={() => setSel({ ...sel, [i]: !sel[i] })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
              <Checkbox on={!!sel[i]} />
              <View style={{ flex: 1 }}>
                <T size={15} w={800}>
                  {t(r.title)}
                </T>
                <T size={12} w={700} color={colors.muted}>
                  {t(r.meta)}
                </T>
              </View>
              <T size={15} w={800}>
                {formatDA(r.amount, DA)}
              </T>
            </Tap>
          </View>
        ))}
      </View>
    </Screen>
  );
}
