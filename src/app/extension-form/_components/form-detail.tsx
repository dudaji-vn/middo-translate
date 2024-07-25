'use client';

import React, { useCallback } from 'react';
import { Typography } from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { RadioGroup, RadioGroupItem } from '@/components/data-entry';
import { z } from 'zod';
import { BaseEntity } from '@/types';
import { Circle, FileText, Send } from 'lucide-react';
import { Button } from '@/components/actions';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
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
import toast from 'react-hot-toast';
import {
  type FormField as TFormField,
  createBusinessFormSchema,
} from '@/app/(main-layout)/(protected)/spaces/[spaceId]/forms/_components/form-creation/schema';
import ThankYou from './thank-you';
import { extensionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { useGetFormHelpdesk } from '@/features/conversation-forms/hooks/use-get-form-helpdesk';
import ClientsLoading from '@/app/(main-layout)/(protected)/spaces/[spaceId]/clients/loading';

const submissionSchema = z.object({
  formId: z.string(),
  submission: z
    .object({})
    .passthrough()
    .refine((val) => {
      console.log('answer val', val);
      return true;
    }),
});

type TSubmission = z.infer<typeof submissionSchema>;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-[#FAFAFA] p-3">
      {children}
    </div>
  );
};
const SelectSingle = ({ name, label, options }: TFormField) => {
  const { control } = useFormContext();
  return (
    <Wrapper>
      <Typography className="!font-semibold">{label}</Typography>
      <FormField
        name={`submission.${name}`}
        control={control}
        render={({ field, fieldState: { invalid } }) => {
          return (
            <RHFFormItem key={field.name}>
              <RadioGroup
                className="flex w-full flex-col gap-4"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {options?.map((option) => {
                  return (
                    <div key={option.value} className="flex flex-col gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="flex flex-none flex-row border-neutral-200 ring-neutral-200 dark:border-neutral-800 dark:ring-neutral-900 "
                        >
                          <Circle
                            className="absolute -inset-[1px] size-4 fill-primary"
                            stroke="white"
                          />
                        </RadioGroupItem>
                        <Typography className="grow text-sm  text-neutral-900">
                          {option.value}
                        </Typography>
                      </div>
                      {option.media && (
                        <Image
                          src={option.media}
                          width={100}
                          height={100}
                          alt={`${option.value} image`}
                        />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>
            </RHFFormItem>
          );
        }}
      />
    </Wrapper>
  );
};
const SelectMultiple = ({ name, label, options }: TFormField) => {
  const { formState, control, setValue } = useFormContext();
  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: `submission.${name}`,
  });

  return (
    <Wrapper>
      <Typography className="!font-semibold">{label}</Typography>
      <FormField
        name={`submission.${name}`}
        control={control}
        render={({ field, fieldState: { invalid } }) => {
          return (
            <RHFFormItem key={field.name}>
              {options?.map((item) => (
                <FormField
                  key={item.value}
                  control={control}
                  name={`submission.${name}`}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-col items-start gap-1 space-x-3"
                      >
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  append(item.value);
                                } else {
                                  const index = fields.findIndex(
                                    (f) => f.id === item.value,
                                  );
                                  remove(index);
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.value}
                          </FormLabel>
                        </div>
                        {item.media && (
                          <Image
                            src={item.media}
                            width={100}
                            height={100}
                            alt={`${item.value} image-select`}
                          />
                        )}
                      </FormItem>
                    );
                  }}
                />
              ))}
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
      <Typography className="">{label}</Typography>

      {dataType === 'long-text' ? (
        <RHFTextAreaField
          name={`submission.${name}`}
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
          name={`submission.${name}`}
          formItemProps={{
            className: 'w-full bg-transparent',
          }}
          inputProps={{
            type,
            required,
            placeholder: placeholder || 'Your answer here',
            className:
              'w-full border-none bg-transparent focus:ring-[1px] focus:ring-primary-300',
          }}
        />
      )}
    </Wrapper>
  );
};

const RenderField = ({ field }: { field: TFormField }) => {
  if (!field?.type) return null;

  if (field.type === 'input') {
    return <Input {...field} />;
  }
  if (field.type === 'radio') {
    return <SelectSingle {...field} />;
  }
  if (field.type === 'checkbox') {
    return <SelectMultiple {...field} />;
  }
  return null;
};

type FormDetail = z.infer<typeof createBusinessFormSchema> & BaseEntity;
const ExtensionForm = ({ formId }: { formId: string }) => {
  const currentUser = useAuthStore((s) => s.user);
  const { data: form, isLoading } = useGetFormHelpdesk({ formId });
  const [isDone, setIsDone] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const formAnswer = useForm<TSubmission>({
    mode: 'onChange',
    defaultValues: {
      formId,
    },
    resolver: zodResolver(submissionSchema),
  });
  const {
    formState: { errors },
  } = formAnswer;

  const handleCloseForm = useCallback(() => {
    setIsDone(true);
  }, []);

  if (!formId) return null;
  if (isLoading)
    return (
      <div className="flex size-full items-center justify-center">
        <ClientsLoading />
      </div>
    );

  if (!form) {
    return null;
  }

  const { formFields, customize, thankyou } = form as FormDetail;
  const themeName = customize?.theme
    ? extensionsCustomThemeOptions.find(
        (t) => t.hex === customize?.theme || t.name === customize.theme,
      )?.name
    : 'Default';
  const bgSrc = `url(${customize?.background})`;

  const onPageChange = (page: number) => {
    const showAll = customize?.layout === 'single';
    const inCorrectPage =
      page === currentPage || page > formFields.length - 1 || page < 0;
    if (showAll || inCorrectPage) {
      return;
    }
    setCurrentPage(page);
  };

  const submit = async (data: TSubmission) => {
    const payload = {
      formId,
      submission: data.submission,
    };
    console.log('payload', payload);

    const isPreviewMode = !!currentUser;
    if (isPreviewMode) {
      handleCloseForm();
      toast.success('Form submitted successfully!');
      return;
    }
    try {
      // TODO: submit form answer
    } catch (error) {
      console.log('error', error);
    }
  };
  console.log('formFieldsERR', errors);

  return (
    <>
      <main
        className={cn(
          'relative h-screen w-full   bg-[url(/test-flow-bg.png)] bg-cover bg-no-repeat p-10 md:p-[5vw]',
          themeName,
        )}
        style={{ backgroundImage: bgSrc }}
      >
        {isDone ? (
          <ThankYou thankyou={thankyou} name={form.name} />
        ) : (
          <div className="flex size-full flex-col rounded-xl bg-white pb-6">
            <div className="flex flex-none flex-row items-center gap-2 rounded-t-xl bg-neutral-50 p-3 text-primary-500-main">
              <FileText className="size-5" />
              <Typography className="text-md  font-semibold text-primary-500-main">
                {form.name}
              </Typography>
            </div>
            <Form {...formAnswer}>
              <div className="flex w-full grow flex-col gap-3 overflow-y-auto p-10">
                {formFields.map((field, index) => {
                  return (
                    <RenderField
                      key={field._id}
                      field={field as unknown as TFormField}
                    />
                  );
                })}
              </div>
            </Form>
            <div className="flex flex-none items-center justify-center py-4">
              <form onSubmit={formAnswer.handleSubmit(submit)}>
                <Button
                  endIcon={<Send />}
                  color="primary"
                  variant="default"
                  type="submit"
                  shape={'square'}
                >
                  {'Submit'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ExtensionForm;
