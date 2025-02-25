import { ClientContextProvider, ClientJsonRpc, CmsEditor, initQueryClient, QueryProvider } from '@axonivy/cms-editor';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import { Flex, HotkeysProvider, ReadonlyProvider, Spinner, ThemeProvider, toast, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { readonlyParam, themeParam, webSocketBaseParam } from './url-helper';

export async function start(): Promise<void> {
  const server = webSocketBaseParam();
  const theme = themeParam();
  const readonly = readonlyParam();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found.');
  }
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await ClientJsonRpc.startClient(connection);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryProvider client={queryClient}>
              <ReadonlyProvider readonly={readonly}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <CmsEditor />
                </HotkeysProvider>
              </ReadonlyProvider>
            </QueryProvider>
          </ClientContextProvider>
          <Toaster closeButton={true} position='bottom-left' />
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: ClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<ClientJsonRpc>(ClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
