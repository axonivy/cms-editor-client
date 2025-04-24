import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '../../../utils/hotkeys';
import './AddLanguage.css';
import type { Language } from './language-utils';
import { LanguageBrowser } from './LanguageBrowser';

type AddLanguageProps = {
  languages: Array<Language>;
  addLanguage: (language: Language) => void;
};

export const AddLanguage = ({ languages, addLanguage }: AddLanguageProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const { addLanguage: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => setOpen(true), { scopes: ['global'], keyup: true, enabled: !open });

  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.Plus} aria-label={shortcut.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className='cms-editor-add-language-content'>
        <DialogHeader>
          <DialogTitle>{t('dialog.languageTool.languageBrowser.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('dialog.languageTool.languageBrowser.description')}</DialogDescription>
        <LanguageBrowser languages={languages} addLanguage={addLanguage} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
