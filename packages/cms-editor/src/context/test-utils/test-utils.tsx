import type { Client } from '@axonivy/cms-editor-protocol';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, type RenderHookOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ClientContextProvider } from '../../protocol/ClientContextProvider';
import { QueryProvider } from '../../query/QueryProvider';

type ContextHelperProps = {
  clientContext?: {
    client?: Partial<Client>;
  };
};

const ContextHelper = ({ clientContext, children }: ContextHelperProps & { children: ReactNode }) => {
  const client = (clientContext?.client ?? {}) as Client;

  return (
    <ClientContextProvider client={client}>
      <QueryProvider client={new QueryClient()}>{children}</QueryProvider>
    </ClientContextProvider>
  );
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
