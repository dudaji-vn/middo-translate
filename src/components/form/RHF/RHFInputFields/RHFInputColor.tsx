'use client';

import type { ReactNode } from 'react';

import { useFormContext } from 'react-hook-form';
import { RHFFormItem } from '../RHFFormItem';
import { FormControl, FormField } from '@/components/ui/form';
import { Input, InputProps } from '@/components/data-entry';
import React from 'react';

export type TRHFInputColorProps = {
    name: string;
    description?: string | ReactNode;
    formLabel?: string | ReactNode;
    inputProps?: React.HTMLAttributes<HTMLInputElement>;
    formItemProps?: React.HTMLAttributes<HTMLDivElement>;
    formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
    formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
    descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export default function RHFInputColor({
    name,
    description = '',
    formLabel = '',
    inputProps = {},
    formItemProps = {},
    ...rest
}: TRHFInputColorProps) {
    const { control } = useFormContext();
    return (
        <FormField
            name={name}
            control={control}
            render={({ field, fieldState: { invalid } }) => {
                const combinedInputProps = {
                    ...field,
                    ...inputProps,
                    isError: invalid,
                };
                return (
                    <RHFFormItem
                        formLabel={formLabel}
                        description={description}
                        formItemProps={formItemProps}
                    >
                        <FormControl>
                            <input {...combinedInputProps} type='color'  />
                        </FormControl>
                    </RHFFormItem>
                );
            }}
            {...rest}
        />
    );
}
