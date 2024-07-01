'use client';

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React from 'react';

export type TRHFFormItemProps = {
  children: React.ReactNode;
  formLabel?: React.ReactNode;
  description?: React.ReactNode;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement> & {
    render?: (props: any) => React.ReactNode;
  };
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

function RHFFormItem({
  children,
  formLabel,
  description,
  formItemProps,
  formLabelProps,
  descriptionProps,
  formMessageProps,
}: TRHFFormItemProps) {
  return (
    <FormItem className="space-y-2" {...formItemProps}>
      {formLabel && (
        <FormLabel
          className="inline-block text-[1rem] font-normal text-neutral-900 dark:text-neutral-50"
          {...formLabelProps}
        >
          {formLabel}
        </FormLabel>
      )}
      {children}
      {description && (
        <FormDescription
          className="font-thin text-gray-500"
          {...descriptionProps}
        >
          {description}
        </FormDescription>
      )}
      <FormMessage
        className="text-normal text-left font-normal text-red-500"
        {...formMessageProps}
      />
    </FormItem>
  );
}

export default RHFFormItem;
