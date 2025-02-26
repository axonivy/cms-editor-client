import type { Client, CmsData, CmsEditorDataContext, RequestTypes } from '@axonivy/cms-editor-protocol';
import { BaseRpcClient, createMessageConnection, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';

export class ClientJsonRpc extends BaseRpcClient implements Client {
  data(context: CmsEditorDataContext): Promise<CmsData> {
    return this.sendRequest('data', context);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-cms-lsp');
  }

  public static async startClient(connection: Connection): Promise<ClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<ClientJsonRpc> {
    const client = new ClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
