'use client';

import type { ReactNode } from 'react';

import { useFormContext } from 'react-hook-form';
import { RHFFormItem } from '../RHFFormItem';
import { FormControl, FormField } from '@/components/ui/form';
import { InputFieldProps } from '../../Input-field';
import { Input } from '@/components/data-entry';
import { AlertCircleIcon } from 'lucide-react';

export type TRHFInputFieldProps = {
  name: string;
  description?: string | ReactNode;
  formLabel?: string | ReactNode;
  inputProps?: InputFieldProps;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export default function RHFInputField({
  name,
  description = '',
  formLabel = '',
  inputProps = {},
  formItemProps = {},
  formLabelProps = {},
  formMessageProps = {},
  descriptionProps = {},
  ...rest
}: TRHFInputFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { invalid } }) => {
        const combinedInputProps: InputFieldProps = {
          ...field,
          ...inputProps,
          ...(invalid ? { className: 'border-red-500' } : {}),
        };
        return (
          <RHFFormItem
            formLabel={formLabel}
            description={description}
            formItemProps={formItemProps}
            formLabelProps={formLabelProps}
            descriptionProps={descriptionProps}
            formMessageProps={formMessageProps}
          >
            <FormControl>
              <Input
                {...combinedInputProps}
              />
            </FormControl>
          </RHFFormItem>
        );
      }}
      {...rest}
    />
  );
}
