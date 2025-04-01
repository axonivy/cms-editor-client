import type { Client, CmsEditorDataContext, ContentObject } from '@axonivy/cms-editor-protocol';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { QueryClient } from '@tanstack/react-query';
import { render, renderHook, type RenderHookOptions, type RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ClientContextProvider } from '../../protocol/ClientContextProvider';
import { QueryProvider } from '../../query/QueryProvider';
import { AppProvider } from '../AppContext';

type ContextHelperProps = {
  readonlyContext?: {
    readonly?: boolean;
  };
  clientContext?: {
    client?: Partial<Client>;
  };
  appContext?: {
    context?: CmsEditorDataContext;
    contentObjects?: Array<ContentObject>;
    selectedContentObject?: number;
    setSelectedContentObject?: (index?: number) => void;
    detail?: boolean;
    setDetail?: (visible: boolean) => void;
    defaultLanguageTag?: string;
    languageDisplayName?: Intl.DisplayNames;
  };
};

const ContextHelper = ({ readonlyContext, clientContext, appContext, children }: ContextHelperProps & { children: ReactNode }) => {
  const readonly = readonlyContext?.readonly !== undefined ? readonlyContext.readonly : false;

  const client = (clientContext?.client ?? {}) as Client;

  const aContext = {
    context: appContext?.context ?? ({} as CmsEditorDataContext),
    contentObjects: appContext?.contentObjects ?? [],
    selectedContentObject: appContext?.selectedContentObject,
    setSelectedContentObject: appContext?.setSelectedContentObject ?? (() => {}),
    detail: appContext?.detail !== undefined ? appContext.detail : true,
    setDetail: appContext?.setDetail ?? (() => {}),
    defaultLanguageTag: appContext?.defaultLanguageTag ?? '',
    languageDisplayName: appContext?.languageDisplayName ?? ({} as Intl.DisplayNames)
  };

  return (
    <ReadonlyProvider readonly={readonly}>
      <ClientContextProvider client={client}>
        <QueryProvider client={new QueryClient()}>
          <AppProvider value={aContext}>{children}</AppProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ReadonlyProvider>
  );
};

export const customRender = (ui: React.ReactElement, options?: RenderOptions & { wrapperProps: ContextHelperProps }) => {
  return render(ui, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};
