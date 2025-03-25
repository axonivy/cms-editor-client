import type { MapStringString } from '@axonivy/cms-editor-protocol';
import {
  BasicField,
  Button,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';

type CmsValueFieldProps = {
  values: MapStringString;
  setValues: Dispatch<SetStateAction<MapStringString>>;
  languageTag: string;
  disabled?: boolean;
  message?: MessageData;
};

export const CmsValueField = ({ values, setValues, languageTag, disabled, message }: CmsValueFieldProps) => {
  const { t } = useTranslation();
  const { languageDisplayName } = useAppContext();

  const value = values[languageTag];
  const isValuePresent = value !== undefined;

  const deleteValue = () => {
    setValues(values => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [languageTag]: _, ...newValues } = { ...values };
      return newValues;
    });
  };

  const setValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues(values => ({
      ...values,
      [languageTag]: event.target.value
    }));
  };

  const readonly = useReadonly();

  return (
    <BasicField
      label={languageDisplayName.of(languageTag)}
      control={
        readonly ? null : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button icon={IvyIcons.Trash} onClick={deleteValue} disabled={disabled || !isValuePresent} aria-label={t('value.delete')} />
              </TooltipTrigger>
              <TooltipContent>{t('value.delete')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      className='cms-editor-value-field'
      message={message}
    >
      <Textarea
        value={isValuePresent ? value : ''}
        placeholder={isValuePresent ? undefined : t('value.noValue')}
        onChange={setValue}
        disabled={disabled}
      />
    </BasicField>
  );
};
