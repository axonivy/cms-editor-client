import type { CmsEditorDataContext, EditorProps } from '@axonivy/cms-editor-protocol';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import './CmsEditor.css';
import { AppProvider } from './context/AppContext';
import { MainContent } from './main/MainContent';
import { MainToolbar } from './main/MainToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';

function CmsEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);

  const [context, setContext] = useState(props.context);
  useEffect(() => {
    setContext(props.context);
  }, [props]);
  const [selectedContentObject, setSelectedContentObject] = useState<number>();

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
    <AppProvider value={{ contentObjects: data.data, selectedContentObject, setSelectedContentObject, detail, setDetail }}>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50} className='cms-editor-main-panel'>
          <Flex direction='column' className='cms-editor-panel-content'>
            <MainToolbar title='CMS Editor main title' />
            <MainContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10} className='cms-editor-detail-panel'>
              <Flex direction='column' className='cms-editor-panel-content'>
                <SidebarHeader icon={IvyIcons.PenEdit} title='CMS Editor detail title' />
                <div>detail</div>
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default CmsEditor;
