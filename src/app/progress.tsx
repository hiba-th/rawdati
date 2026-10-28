import { View } from 'react-native';
import { useChild, useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { milestones, skills } from '../data/mock';
import { Button, Card, IconTile, LevelBar, Row, Screen, ScreenHeader, T } from '../components/ui';
import { colors } from '../theme/tokens';

// 13 · Progress — milestones, term skills (3-step level bars), teacher summary, PDF.
export default function Progress() {
  const { t } = useTranslation();
  const child = useChild();
  const store = useStore();

  return (
    <Screen
      footer={
        <Button
          variant="dark"
          icon="download"
          size={16}
          label={t('Download term report (PDF)')}
          onPress={() => store.toast(t('Term report saved to your downloads'))}
        />
      }
    >
      <ScreenHeader title={t('How {{name}} is growing', { name: child.name })} />

      <View style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 28, backgroundColor: colors.lilacTint, padding: 18, gap: 12 }}>
        <T size={12} w={800} ls={1} color={colors.lilacDark} upper>
          {t('New milestones this month')}
        </T>
        {milestones.map((m) => (
          <Row key={m.title} gap={10} style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12 }}>
            <IconTile icon="star" bg={colors.sun} color={colors.ink} fill={colors.ink} iconSize={22} strokeWidth={0} />
            <View style={{ flex: 1 }}>
              <T size={15} w={800}>
                {t(m.title)}
              </T>
              <T size={12} w={700} color={colors.muted}>
                {t(m.meta)}
              </T>
            </View>
          </Row>
        ))}
      </View>

      <Card style={{ marginTop: 16, marginHorizontal: 20, borderRadius: 28 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <T d w={800} size={20} accessibilityRole="header">
            {t('Term 1 skills')}
          </T>
          <T size={12} w={700} color={colors.muted}>
            {t('Updated {{d}}', { d: t('25 Oct') })}
          </T>
        </Row>
        <View style={{ marginTop: 12, gap: 14 }}>
          {skills.map((s) => (
            <LevelBar key={s.name} name={t(s.name)} level={s.level} />
          ))}
        </View>
        <T size={12} w={700} color={colors.muted} style={{ marginTop: 14 }}>
          {t('Levels: Starting · Getting there · Confident. Every child grows at their own pace.')}
        </T>
      </Card>

      <Card style={{ marginTop: 16, marginHorizontal: 20, gap: 8 }}>
        <T size={15} w={800} accessibilityRole="header">
          {t('Teacher’s summary')}
        </T>
        <T size={14} lh={21} w={600} color="#3A3F5C">
          {t('Ines is curious and kind with friends. She loves drawing and songs. At home, you can help her practise holding the pencil and putting on her shoes alone.')}
        </T>
      </Card>
    </Screen>
  );
}
