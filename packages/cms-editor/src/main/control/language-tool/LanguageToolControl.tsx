import { Flex, Separator } from '@axonivy/ui-components';
import { AddLanguage } from './AddLanguage';
import { DeleteLanguage } from './DeleteLanguage';
import type { Language } from './language-utils';

type LanguageToolControlProps = {
  languages: Array<Language>;
  addLanguage: (language: Language) => void;
  deleteSelectedLanguage: () => void;
  hasSelection: boolean;
};

export const LanguageToolControl = ({ languages, addLanguage, deleteSelectedLanguage, hasSelection }: LanguageToolControlProps) => {
  return (
    <Flex gap={2}>
      <AddLanguage languages={languages} addLanguage={addLanguage} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <DeleteLanguage deleteSelectedLanguage={deleteSelectedLanguage} hasSelection={hasSelection} />
    </Flex>
  );
};
