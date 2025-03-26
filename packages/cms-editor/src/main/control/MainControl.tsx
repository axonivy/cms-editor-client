import { Flex } from '@axonivy/ui-components';
import { AddContentObject } from './AddContentObject';

type MainControlProps = {
  selectRow: (rowId: string) => void;
};

export const MainControl = ({ selectRow }: MainControlProps) => (
  <Flex gap={2} className='cms-editor-main-control'>
    <AddContentObject selectRow={selectRow} />
  </Flex>
);
