'use client';

import React, { useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { RadioGroup, RadioGroupItem } from '@/components/data-entry';
import { get } from 'lodash';
import { z } from 'zod';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { RHFFormItem } from '@/components/form/RHF/RHFFormItem';
import Image from 'next/image';
import { Checkbox } from '@/components/form/checkbox';
import { type FormField as TFormField } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/forms/_components/form-creation/schema';

const answerSchema = z.object({
  formId: z.string(),
  answer: z.object({}).passthrough(),
});

type TSubmission = z.infer<typeof answerSchema>;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-[#FAFAFA] p-3">
      {children}
    </div>
  );
};
const SelectSingle = ({ name, label, options }: TFormField) => {
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();

  const errorMessage = String(get(errors, `answer.${name}.message`));
  const currentValue = watch(`answer.${name}`);
  const hasSpecialOption = useMemo(() => {
    const hasOther =
      options?.some((option) => option.type === 'other') &&
      currentValue === 'other';
    if (!hasOther) {
      setValue(`answer.${name}-other`, undefined);
    }
    return hasOther;
  }, [options, currentValue, setValue, name]);

  return (
    <Wrapper>
      <Typography className="!font-semibold">{label}</Typography>
      <FormField
        name={`answer.${name}`}
        control={control}
        render={({ field, fieldState: { invalid } }) => {
          return (
            <RHFFormItem key={field.name}>
              <FormControl key={field.name}>
                <RadioGroup
                  key={field.name}
                  className="flex w-full flex-col gap-4"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {options?.map((option) => {
                    return (
                      <>
                        <FormItem
                          className="flex flex-col items-start"
                          key={option.value}
                        >
                          <div className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="flex cursor-pointer flex-col gap-3 font-normal">
                              {option.value}
                              {option.media && (
                                <Image
                                  src={option.media}
                                  width={120}
                                  height={120}
                                  alt={`${option.value} image-radio`}
                                />
                              )}
                            </FormLabel>
                          </div>
                          {hasSpecialOption && option.type === 'other' && (
                            <div className="w-full px-2">
                              <RHFInputField
                                name={`answer.${name}-other`}
                                formItemProps={{
                                  className: 'w-full',
                                }}
                                inputProps={{
                                  placeholder: 'Other answer',
                                  required: currentValue === 'other',
                                  className:
                                    'w-full border-neutral-50 bg-transparent focus:ring-[1px] focus:ring-primary-300',
                                }}
                              />
                            </div>
                          )}
                        </FormItem>
                      </>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </RHFFormItem>
          );
        }}
      />
    </Wrapper>
  );
};
const SelectMultiple = ({ name, label, options }: TFormField) => {
  const { control, setValue, watch } = useFormContext();
  const fieldName = `answer.${name}`;

  const append = (value: any) => {
    setValue(fieldName, [...fields, value]);
  };

  const fields = watch(fieldName) || [];

  return (
    <Wrapper>
      <Typography className="!font-semibold">{label}</Typography>
      <FormField
        name={`answer.${name}`}
        control={control}
        render={({ field, fieldState: { invalid } }) => {
          return (
            <RHFFormItem key={field.name}>
              {options?.map((item) => {
                const selected = fields.find((f: any) => f === item.value);
                return (
                  <FormItem
                    key={item.value}
                    className="flex flex-col items-start gap-1 space-x-3"
                  >
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={!!selected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              append(item.value);
                            } else {
                              setValue(
                                fieldName,
                                fields.filter((f: any) => f !== item.value),
                              );
                              if (item.type === 'other') {
                                setValue(`answer.${name}-other`, undefined);
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="flex cursor-pointer flex-col gap-3 font-normal">
                        {item.value}
                        {item.media && (
                          <Image
                            src={item.media}
                            width={120}
                            height={120}
                            alt={`${item.value} image-select`}
                          />
                        )}
                      </FormLabel>
                    </div>
                    {selected && item.type === 'other' && (
                      <div className="w-full pr-4">
                        <RHFInputField
                          name={`answer.${name}-other`}
                          formItemProps={{
                            className: 'w-full',
                          }}
                          inputProps={{
                            placeholder: 'Other answer',
                            required: selected,
                            className:
                              'w-full border-neutral-50  bg-transparent focus:ring-[1px] focus:ring-primary-300',
                          }}
                        />
                      </div>
                    )}
                  </FormItem>
                );
              })}
            </RHFFormItem>
          );
        }}
      />
    </Wrapper>
  );
};

const Input = ({
  name,
  label,
  type,
  required,
  dataType,
  placeholder,
}: TFormField) => {
  return (
    <Wrapper>
      <Typography className="font-semibold">{label}</Typography>
      {dataType === 'long-text' ? (
        <RHFTextAreaField
          name={`answer.${name}`}
          formItemProps={{
            className: 'w-full border-none !bg-transparent p-0',
          }}
          areaProps={{
            className: 'border-none h-28 !bg-transparent p-0',
          }}
          textareaProps={{
            placeholder: placeholder || 'Your answer here',
            className:
              'w-full border-none !bg-transparent focus:ring-[1px] focus:ring-primary-300 p-3 rounded-[12px]',
          }}
        />
      ) : (
        <RHFInputField
          name={`answer.${name}`}
          formItemProps={{
            className: 'w-full bg-transparent',
          }}
          inputProps={{
            type,
            placeholder: placeholder || 'Your answer here',
            className:
              'w-full border-none bg-transparent focus:ring-[1px] focus:ring-primary-300',
          }}
        />
      )}
    </Wrapper>
  );
};

export { SelectSingle, SelectMultiple, Input };
