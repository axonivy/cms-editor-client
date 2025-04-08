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
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';

type CmsValueFieldProps = {
  values: MapStringString;
  updateValue: (languageTag: string, value: string) => void;
  deleteValue: (languageTag: string) => void;
  languageTag: string;
  disabled?: boolean;
  disabledDelete?: boolean;
  message?: MessageData;
};

export const CmsValueField = ({ values, updateValue, deleteValue, languageTag, disabled, disabledDelete, message }: CmsValueFieldProps) => {
  const { t } = useTranslation();
  const { languageDisplayName } = useAppContext();

  const value = values[languageTag];
  const isValuePresent = value !== undefined;

  const readonly = useReadonly();

  return (
    <BasicField
      label={languageDisplayName.of(languageTag)}
      control={
        readonly ? null : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  icon={IvyIcons.Trash}
                  onClick={() => deleteValue(languageTag)}
                  disabled={disabled || disabledDelete || !isValuePresent}
                  aria-label={t('value.delete')}
                />
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
        onChange={event => updateValue(languageTag, event.target.value)}
        disabled={disabled}
      />
    </BasicField>
  );
};
