import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';
import { FormControl, FormField } from '@/components/ui/form';
import { RHFFormItem } from '@/components/form/RHF/RHFFormItem';
import { FormInformation, useExtensionFormsStore } from '@/stores/forms.store';
import { isEmpty } from 'lodash';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { GET_FORMS_INFO_KEY } from '@/features/conversation-forms/hooks/use-get-forms-names';

interface FormNodeSelectorProps {
  nameField: string;
}

const FormNodeSelector: React.FC<FormNodeSelectorProps> = ({ nameField }) => {
  const { control } = useFormContext();
  const { formsInfo } = useExtensionFormsStore();
  const qrClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const filterData = useMemo(() => {
    return (
      formsInfo?.filter((form) =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    );
  }, [formsInfo, searchTerm]);

  useEffect(() => {
    qrClient.invalidateQueries([GET_FORMS_INFO_KEY]);
  }, [nameField, qrClient]);

  return (
    <FormField
      name={nameField}
      control={control}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <RHFFormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full rounded-[12px]">
                  <SelectValue placeholder="Select a form to display" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-[10001] h-fit w-[var(--radix-select-trigger-width)]">
                {isEmpty(formsInfo) ? (
                  <span className="p-4"> There&apos;s no form</span>
                ) : (
                  <div className="size-full p-2">
                    <SearchInput
                      onChange={(
                        e:
                          | React.ChangeEvent<HTMLInputElement>
                          | React.ChangeEvent<HTMLTextAreaElement>,
                      ) => setSearchTerm(e.target.value)}
                      onClear={() => setSearchTerm('')}
                      placeholder={'Search for Form'}
                    />
                  </div>
                )}
                <div className="max-h-40 w-full overflow-y-auto">
                  {filterData?.map((form: FormInformation) => (
                    <SelectItem key={form._id} value={form._id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </RHFFormItem>
        );
      }}
    />
  );
};

export default FormNodeSelector;
