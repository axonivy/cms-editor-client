import type { CmsEditorDataContext, EditorProps } from '@axonivy/cms-editor-protocol';
import { Flex, PanelMessage, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';

function CmsEditor(props: EditorProps) {
  const [context, setContext] = useState(props.context);
  useEffect(() => {
    setContext(props.context);
  }, [props]);

  const client = useClient();

  const queryKeys = useMemo(() => {
    return {
      data: (context: CmsEditorDataContext) => genQueryKey('data', context)
    };
  }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: async () => await client.data(context),
    structuralSharing: false
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={`An error has occurred: ${error.message}`} />;
  }

  return (
    <>
      <h1>CMS EDITOR</h1>
      <div className='cms-editor-content'>{JSON.stringify(data.data)}</div>
    </>
  );
}

export default CmsEditor;
