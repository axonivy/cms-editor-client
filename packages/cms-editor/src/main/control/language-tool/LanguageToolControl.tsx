import { Flex } from '@axonivy/ui-components';
import { DeleteLanguage } from './DeleteLanguage';

type LanguageToolControlProps = {
  deleteSelectedLanguage: () => void;
  hasSelection: boolean;
};

export const LanguageToolControl = ({ deleteSelectedLanguage, hasSelection }: LanguageToolControlProps) => {
  return (
    <Flex gap={2}>
      <DeleteLanguage deleteSelectedLanguage={deleteSelectedLanguage} hasSelection={hasSelection} />
    </Flex>
  );
};
