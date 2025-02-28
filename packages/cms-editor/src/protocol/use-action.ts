import type { CmsActionArgs } from '@axonivy/cms-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../protocol/ClientContextProvider';

export function useAction(actionId: CmsActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: CmsActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
