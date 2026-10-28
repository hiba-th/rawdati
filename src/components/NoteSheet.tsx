import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStore } from '../store/AppStore';
import { useTranslation } from '../i18n';
import { families, noteTemplates } from '../data/mock';
import { colors } from '../theme/tokens';
import { nowHHMM } from '../utils/format';
import { Field } from './Field';
import { Sheet } from './Sheet';
import { Button, T, Tap } from './ui';

/** Teacher writes a note to one family (`to` = child name) or to every family (`to` = 'all'). */
export function NoteSheet({ to, onClose }: { to: string | null; onClose: () => void }) {
  const { t } = useTranslation();
  const store = useStore();
  const [text, setText] = useState('');

  useEffect(() => {
    if (to) setText('');
  }, [to]);

  const family = families.find((f) => f.child === to);
  const recipient = to === 'all' ? t('All parents of {{cls}}', { cls: 'Les Papillons' }) : family ? t('{{parents}} · {{child}}’s parents', { parents: family.parents, child: family.child }) : '';

  const send = () => {
    store.set({ notes: [{ id: `n${Date.now()}`, to: to!, text: text.trim(), time: nowHHMM() }, ...store.notes] });
    store.toast(to === 'all' ? t('Note sent to all {{n}} families', { n: families.length }) : t('Note sent to {{child}}’s parents', { child: to }));
    onClose();
  };

  return (
    <Sheet visible={!!to} onClose={onClose} title={t('Note to parents')}>
      <View style={{ backgroundColor: colors.skyTint, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 }}>
        <T size={12} w={800} color={colors.skyText} upper>
          {t('To')}
        </T>
        <T size={15} w={800}>
          {recipient}
        </T>
      </View>
      <T size={13} w={800} color={colors.muted}>
        {t('Quick notes')}
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {noteTemplates.map((n) => (
          <Tap key={n} onPress={() => setText(t(n))} style={{ minHeight: 40, paddingHorizontal: 12, borderRadius: 999, borderWidth: 2, borderColor: colors.borderTeacher, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
            <T size={13} w={800} color={colors.skyDark}>
              {t(n)}
            </T>
          </Tap>
        ))}
      </View>
      <Field teacher active label={t('Your note')} value={text} onChangeText={setText} multiline placeholder={t('Write something for the parents…')} style={{ minHeight: 110 }} />
      <T size={12} w={700} color={colors.muted}>
        {t('Parents get a notification and see the note in their daily report.')}
      </T>
      <Button variant="teacher" label={t('Send note')} disabled={!text.trim()} onPress={send} />
    </Sheet>
  );
}
