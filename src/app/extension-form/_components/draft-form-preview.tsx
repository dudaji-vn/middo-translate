'use client';

import React, { useCallback, useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { z } from 'zod';
import { BaseEntity } from '@/types';
import { FileText, Send, X } from 'lucide-react';
import { Button } from '@/components/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';
import {
  type FormField as TFormField,
  createBusinessFormSchema,
} from '@/app/(main-layout)/(protected)/spaces/[spaceId]/forms/_components/form-creation/schema';
import ThankYou from './thank-you';
import { extensionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { Input, SelectMultiple, SelectSingle } from './form-fields';
import { isEmpty } from 'lodash';

const answerSchema = z.object({
  formId: z.string().optional(),
  answer: z.object({}).passthrough(),
});

type TSubmission = z.infer<typeof answerSchema>;

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

export type FormDetail = z.infer<typeof createBusinessFormSchema> & BaseEntity;
const DraftFormPreview = ({
  form,
  onClose = () => {},
}: {
  form: {
    formFields: TFormField[];
    thankyou: any;
    customize: any;
    name: string;
  };
  onClose?: () => void;
}) => {
  const [isDone, setIsDone] = React.useState(false);

  const requiredFields = useMemo(() => {
    return form?.formFields
      .filter((f: any) => f.required)
      .map((f: any) => f.name);
  }, [form]);

  const formAnswer = useForm<TSubmission>({
    mode: 'onBlur',
    defaultValues: {},
    resolver: zodResolver(
      answerSchema.superRefine((data, ctx) => {
        const answer = data.answer;
        if (!answer) {
          return false;
        }
        const missingField = requiredFields.find(
          (field: any) => !answer[field] || isEmpty(answer[field]),
        );
        if (!missingField) return true;
        ctx.addIssue({
          message: `This answer is required!`,
          code: z.ZodIssueCode.unrecognized_keys,
          path: ['answer', missingField],
          keys: ['answer', missingField],
        });
        return false;
      }),
    ),
  });
  const {
    formState: { errors },
    trigger,
  } = formAnswer;

  const goToThankyou = useCallback(() => {
    setIsDone(true);
  }, []);

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

  const submit = () => {
    trigger().then((res) => {
      console.log('res', res);
      if (!res) {
        return;
      }
      goToThankyou();
      toast.success('Form submitted successfully!');
      return;
    });
  };

  const onCloseForm = () => {
    onClose();
  };
  console.log('form', errors);
  return (
    <>
      <main
        className={cn(
          'relative h-screen w-full   bg-[url(/test-flow-bg.png)] bg-cover bg-no-repeat p-10 md:p-[5vw]',
          themeName,
        )}
        style={{ backgroundImage: bgSrc }}
      >
        <Button.Icon
          onClick={onCloseForm}
          className="absolute right-1 top-1"
          variant={'ghost'}
          size={'sm'}
          color={'default'}
        >
          <X />
        </Button.Icon>
        {isDone ? (
          <ThankYou thankyou={thankyou} name={form.name} />
        ) : (
          <form
            onSubmit={formAnswer.handleSubmit(submit)}
            className="flex size-full flex-col gap-5 rounded-xl bg-white"
          >
            <Form {...formAnswer}>
              <div className="flex flex-none flex-row items-center gap-2 rounded-t-xl bg-neutral-50 p-3 text-primary-500-main">
                <FileText className="size-5" />
                <Typography className="text-md  font-semibold text-primary-500-main">
                  {form.name}
                </Typography>
              </div>
              <div className="flex w-full grow flex-col gap-3 overflow-y-auto px-10">
                {formFields.map((field, index) => {
                  return (
                    <RenderField
                      key={field.name}
                      field={field as unknown as TFormField}
                    />
                  );
                })}
              </div>
              <div className="flex flex-none items-center justify-center pb-5">
                <Button
                  endIcon={<Send />}
                  color="primary"
                  variant="default"
                  type="submit"
                  shape={'square'}
                  onClick={submit}
                >
                  {'Submit'}
                </Button>
              </div>
            </Form>
          </form>
        )}
      </main>
    </>
  );
};

export default DraftFormPreview;
