import { Flex, Separator } from '@axonivy/ui-components';
import { AddContentObject } from './AddContentObject';
import { DeleteContentObject } from './DeleteContentObject';
import { LanguageTool } from './language-tool/LanguageTool';

type MainControlProps = {
  selectRow: (rowId: string) => void;
  deleteContentObject: () => void;
  hasSelection: boolean;
};

export const MainControl = ({ selectRow, deleteContentObject, hasSelection }: MainControlProps) => (
  <Flex gap={2} className='cms-editor-main-control'>
    <LanguageTool />
    <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
    <AddContentObject selectRow={selectRow} />
    <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
    <DeleteContentObject deleteContentObject={deleteContentObject} hasSelection={hasSelection} />
  </Flex>
);
