import type { CmsEditorDataContext, ContentObject, EditorProps } from '@axonivy/cms-editor-protocol';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import './CmsEditor.css';
import { AppProvider } from './context/AppContext';
import { DetailContent } from './detail/DetailContent';
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

  const contentObjects = data.data;
  const contentObject = selectedContentObject !== undefined ? contentObjects[selectedContentObject] : undefined;
  const { mainTitle, detailTitle } = toolbarTitles(context.pmv, contentObject);

  return (
    <AppProvider value={{ context, contentObjects, selectedContentObject, setSelectedContentObject, detail, setDetail }}>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50} className='cms-editor-main-panel'>
          <Flex direction='column' className='cms-editor-panel-content'>
            <MainToolbar title={mainTitle} />
            <MainContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10} className='cms-editor-detail-panel'>
              <Flex direction='column' className='cms-editor-panel-content'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} className='cms-editor-detail-toolbar' />
                <DetailContent key={contentObject?.uri} />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default CmsEditor;

export const toolbarTitles = (pmv: string, contentObject?: ContentObject) => {
  const mainTitle = `CMS - ${pmv}`;
  let detailTitle = mainTitle;
  if (contentObject) {
    const lastSlashIndex = contentObject.uri.lastIndexOf('/');
    detailTitle += ` - ${contentObject.uri.substring(lastSlashIndex + 1)}`;
  }
  return { mainTitle, detailTitle };
};
