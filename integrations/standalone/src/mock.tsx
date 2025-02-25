import { ClientContextProvider, CmsEditor, initQueryClient, QueryProvider } from '@axonivy/cms-editor';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { CmsClientMock } from './mock/cms-client-mock';
import { readonlyParam } from './url-helper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found.');
}
const root = ReactDOM.createRoot(rootElement);

const client = new CmsClientMock();
const queryClient = initQueryClient();

const readonly = readonlyParam();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <CmsEditor />
            </HotkeysProvider>
          </ReadonlyProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
