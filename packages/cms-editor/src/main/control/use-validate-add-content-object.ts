import type { MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateAddContentObject = (name: string, namespace: string) => {
  const { t } = useTranslation();

  const nameValidationMessage = useMemo<MessageData | undefined>(() => {}, [t]);
  const namespaceValidationMessage = useMemo<MessageData | undefined>(() => {}, [t]);

  return { nameValidationMessage, namespaceValidationMessage };
};
