import type { ContentObject } from '@axonivy/cms-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { type Table } from '@tanstack/react-table';
import { AddContentObject } from './AddContentObject';

type MainControlProps = {
  table: Table<ContentObject>;
};

export const MainControl = ({ table }: MainControlProps) => {
  return (
    <Flex gap={2} className='cms-editor-main-control'>
      <AddContentObject table={table} />
    </Flex>
  );
};
