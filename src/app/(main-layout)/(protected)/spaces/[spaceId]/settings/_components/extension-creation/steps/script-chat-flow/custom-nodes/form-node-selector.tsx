import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
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

interface FormNodeSelectorProps {
  nameField: string;
}

const FormNodeSelector: React.FC<FormNodeSelectorProps> = ({ nameField }) => {
  const { control } = useFormContext();
  const { formsInfo } = useExtensionFormsStore();
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
              <SelectContent className="z-[10001]">
                {formsInfo?.map((form: FormInformation) => (
                  <SelectItem key={form._id} value={form._id}>
                    {form.name}
                  </SelectItem>
                ))}
                {isEmpty(formsInfo) && (
                  <span className="p-4"> There&apos;s no form</span>
                )}
              </SelectContent>
            </Select>
          </RHFFormItem>
        );
      }}
    />
  );
};

export default FormNodeSelector;
