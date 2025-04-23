import {
  BasicField,
  BasicSelect,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../protocol/use-meta';
import { useKnownHotkeys } from '../../utils/hotkeys';

export const LanguageTool = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeDialog();
    }
  };

  const { defaultLanguageTag, setDefaultLanguageTag, languageDisplayName } = useAppContext();
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLanguageTag);

  const initializeDialog = () => {
    setDefaultLanguage(defaultLanguageTag);
  };

  const languages = useMeta('meta/supportedLocales', null, []).data;
  const languageItems = useMemo(
    () =>
      languages
        .map(language => ({ value: language, label: languageDisplayName.of(language) ?? language }))
        .sort((option1, option2) => option1.label.localeCompare(option2.label)),
    [languageDisplayName, languages]
  );

  const save = () => {
    setDefaultLanguageTag(defaultLanguage);
    setOpen(false);
  };

  const { languageTool: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const enter = useHotkeys(['Enter'], () => save(), { scopes: ['global'], enabled: open, enableOnFormTags: true });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.WsStart} aria-label={shortcut.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog.languageTool.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('dialog.languageTool.description')}</DialogDescription>
        <Flex direction='column' gap={3} ref={enter} tabIndex={-1}>
          <BasicField label={t('dialog.languageTool.label.defaultLanguage')}>
            <BasicSelect value={defaultLanguage} onValueChange={setDefaultLanguage} items={languageItems} />
          </BasicField>
        </Flex>
        <DialogFooter>
          <Button variant='primary' size='large' aria-label={t('common.label.save')} onClick={save}>
            {t('common.label.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
