'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
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
import { useGetFormHelpdesk } from '@/features/conversation-forms/hooks/use-get-form-helpdesk';
import ClientsLoading from '@/app/(main-layout)/(protected)/spaces/[spaceId]/clients/loading';
import {
  removeFormDraftData,
  useHelpdeskFormDraft,
} from '@/stores/helpdesk.store';
import { announceToParent } from '@/utils/iframe-util';
import { submitFormAnswer } from '@/services/extension.service';
import { Input, SelectMultiple, SelectSingle } from './form-fields';
import { isEmpty } from 'lodash';

const answerSchema = z.object({
  formId: z.string(),
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
const ExtensionForm = ({
  formId,
  guestId,
  onClose = (done: boolean) => {},
  messageId,
  previewMode = false,
}: {
  formId?: string;
  guestId?: string;
  roomId?: string;
  messageId?: string;
  onClose?: (done: boolean) => void;
  previewMode?: boolean;
}) => {
  const { data: form, isLoading } = useGetFormHelpdesk({
    formId,
    userId: guestId,
  });
  const [isDone, setIsDone] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);

  const temporaryData = useHelpdeskFormDraft(guestId || '');
  const requiredFields = useMemo(() => {
    return form?.formFields
      .filter((f: any) => f.required)
      .map((f: any) => f.name);
  }, [form]);

  const formAnswer = useForm<TSubmission>({
    mode: 'onBlur',
    defaultValues: {
      formId,
    },
    resolver: zodResolver(
      answerSchema.superRefine((data, ctx) => {
        console.log('data validation', data);
        const answer = data.answer;
        if (!answer) {
          return false;
        }
        const missingField = requiredFields.find(
          (field: any) => !answer[field] || isEmpty(answer[field]),
        );
        if (!missingField) return true;
        console.log('missingField', missingField);
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
  } = formAnswer;

  const goToThankyou = useCallback(() => {
    setIsDone(true);
  }, []);

  useEffect(() => {
    if (!previewMode) {
      if (temporaryData) {
        formAnswer.reset(temporaryData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  useEffect(() => {
    if (!isLoading && form && !previewMode) {
      announceToParent({
        type: 'form-loaded',
        payload: {},
      });
      if (form?.isSubmitted) {
        goToThankyou();
      }
    }
  }, [guestId, form, isLoading, previewMode, goToThankyou]);

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
    const answer = formFields.reduce(
      (acc, field) => {
        acc[field.name] = data.answer[field.name];
        const otherAnswerOfField = data.answer[field.name + '-other'] as string;
        if (otherAnswerOfField && ['select', 'radio'].includes(field.type)) {
          (acc[field.name] as unknown as string[]).push(otherAnswerOfField);
        }
        return acc;
      },
      {} as TSubmission['answer'],
    );

    if (previewMode) {
      goToThankyou();
      toast.success('Form submitted successfully!');
      return;
    }
    if (!guestId) {
      return;
    }
    try {
      const res = await submitFormAnswer(formId, guestId, {
        answer,
        messageId,
      });
      console.log('res', res);
      if (res.data) {
        toast.success('Form submitted successfully!');
        goToThankyou();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const onCloseForm = () => {
    if (!previewMode && guestId && !isDone) {
      // addFormDraftData(guestId, formAnswer.getValues());
    }
    if (isDone && guestId) {
      removeFormDraftData(guestId);
    }
    onClose(isDone);
  };

  return (
    <>
      <main
        className={cn(
          'relative h-screen w-full overflow-hidden  bg-[url(/test-flow-bg.png)] bg-cover bg-no-repeat p-10 md:p-[5vw]',
          themeName,
        )}
        style={{ backgroundImage: bgSrc }}
      >
        {!previewMode && (
          <Button.Icon
            onClick={onCloseForm}
            className="absolute right-1 top-1"
            variant={'ghost'}
            size={'sm'}
            color={'default'}
          >
            <X />
          </Button.Icon>
        )}
        {isDone ? (
          <ThankYou thankyou={thankyou} name={form.name} />
        ) : (
          <form
            onSubmit={formAnswer.handleSubmit(submit)}
            className="flex size-full flex-col gap-5 rounded-xl bg-white"
          >
            <div className="flex flex-none flex-row items-center gap-2 rounded-t-xl bg-neutral-50 p-3 text-primary-500-main">
              <FileText className="size-5" />
              <Typography className="text-md  font-semibold text-primary-500-main">
                {form.name}
              </Typography>
            </div>
            <Form {...formAnswer}>
              <div className="flex w-full grow flex-col gap-3 overflow-y-auto px-10">
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
            <div className="flex flex-none items-center justify-center pb-5">
              <Button
                endIcon={<Send />}
                color="primary"
                variant="default"
                type="submit"
                shape={'square'}
              >
                {'Submit'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </>
  );
};

export default ExtensionForm;
