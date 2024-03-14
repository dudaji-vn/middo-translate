'use client';

import type { DetailedHTMLProps, ReactNode, TextareaHTMLAttributes } from 'react';

import { useFormContext } from 'react-hook-form';
import { RHFFormItem } from '../RHFFormItem';
import { FormControl, FormField } from '@/components/ui/form';
import { cn } from '@/utils/cn';

export type TRHFTextAreaFieldProps = {
  name: string;
  description?: string | ReactNode;
  formLabel?: string | ReactNode;
  textareaProps?: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export default function RHFInputField({
  name,
  description = '',
  formLabel = '',
  textareaProps = {},
  formItemProps = {},
  formLabelProps = {},
  formMessageProps = {},
  descriptionProps = {},
  ...rest
}: TRHFTextAreaFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { invalid } }) => {
        const combinedInputProps: React.HTMLAttributes<HTMLTextAreaElement> = {
          ...field,
          ...textareaProps,
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
              <div
                className={
                  'flex flex-1 rounded-xl border border-neutral-100 bg-white p-3'
                }
              >
                <textarea
                  {...combinedInputProps}
                  className={cn(
                    'max-h-[160px] flex-1 resize-none outline-none',
                    textareaProps?.className,
                  )}
                />
              </div>
            </FormControl>
          </RHFFormItem>
        );
      }}
      {...rest}
    />
  );
}
