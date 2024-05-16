import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../data-entry';

import { SelectProps } from '@radix-ui/react-select';
import { AlertCircleIcon } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';

interface InputSelectLanguageProps {
  className?: string;
  register?: any;
  errors?: any;
  setValue?: any;
  field?: string;
  trigger?: any;
  defaultValue?: string;
  labelProps?: React.HtmlHTMLAttributes<HTMLLabelElement>;
  selectProps?: SelectProps;
}
interface InputSelect {
  value: string;
  title: string;
}
export const InputSelectLanguage = ({
  labelProps,
  selectProps,
  ...props
}: InputSelectLanguageProps) => {
  const id = useId();
  const [valueSelect, setValueSelect] = useState<InputSelect>({
    value: '',
    title: '',
  });
  const { errors, className, setValue, field, trigger, defaultValue } = props;
  const { t } = useTranslation('common');
  const languageOptions = useMemo(() => {
    return SUPPORTED_LANGUAGES.map((language) => {
      return {
        value: language.code,
        title: language.name,
      };
    });
  }, []);

  const handleSelectChange = useCallback(
    (value: any) => {
      let itemSelected = languageOptions?.find(
        (item: any) => item.value === value,
      );
      setValue(field, value);
      trigger(field);
      setValueSelect(itemSelected as InputSelect);
    },
    [field, languageOptions, setValue, trigger],
  );

  useEffect(() => {
    if (defaultValue) {
      handleSelectChange(defaultValue);
    }
  }, [defaultValue, handleSelectChange]);

  return (
    <div className={className}>
      <label className="mb-2 inline-block" htmlFor={id} {...labelProps}>
        {t('COMMON.LANGUAGE')}
      </label>
      <Select onValueChange={handleSelectChange} {...selectProps}>
        <SelectTrigger className="flex w-full rounded-xl px-5">
          {!valueSelect?.value && (
            <span className="opacity-60">
              {t('COMMON.LANGUAGE_PLACEHOLDER')}
            </span>
          )}
          {valueSelect?.value && (
            <>
              <CircleFlag
                countryCode={LANGUAGE_CODES_MAP[
                  valueSelect.value as keyof typeof LANGUAGE_CODES_MAP
                ].toLowerCase()}
                className="mr-2 inline-block h-5 w-5 overflow-hidden rounded-full"
              />
              <span className="flex-1 text-left">
                {t('LANGUAGE.' + valueSelect.title)}
              </span>
            </>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {languageOptions?.length > 0 &&
            languageOptions?.map((option: any) => {
              return (
                <SelectItem
                  value={option.value}
                  key={option.value}
                  className=""
                >
                  <CircleFlag
                    countryCode={LANGUAGE_CODES_MAP[
                      option.value as keyof typeof LANGUAGE_CODES_MAP
                    ].toLowerCase()}
                    className="mr-2 inline-block h-5 w-5 overflow-hidden rounded-full"
                  />
                  <span>{t('LANGUAGE.' + option.title)}</span>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
      {errors && (
        <div className="mt-2 flex items-center gap-2 pl-5 text-error ">
          <AlertCircleIcon className="h-7 w-5 min-w-[20px] " />
          {(errors?.message?.message as string) || (errors?.message as string)}
        </div>
      )}
    </div>
  );
};
