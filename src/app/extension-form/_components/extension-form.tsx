'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { z } from 'zod';
import { BaseEntity } from '@/types';
import { ArrowLeft, ArrowRight, FileText, Send, X } from 'lucide-react';
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

type TActions = {
  prev: string;
  next: string;
  submit: string;
  requireMessage: string;
  requireOptionMessage: string;
  close: string;
};
type TSubmission = z.infer<typeof answerSchema>;

const RenderField = ({
  field,
  hidden = false,
}: {
  field: TFormField;
  hidden?: boolean;
}) => {
  if (!field?.type || hidden) return null;

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
const baseData = {
  hasNextPage: false,
  hasPrevPage: false,
  layout: 'multiple',
  requiredFields: [],
};
export type FormDetail = z.infer<typeof createBusinessFormSchema> & BaseEntity;
const ExtensionForm = ({
  formId,
  guestId,
  onClose = (done: boolean) => {},
  messageId,
  previewMode = false,
  language,
}: {
  formId?: string;
  guestId?: string;
  roomId?: string;
  language?: string;
  messageId?: string;
  onClose?: (done: boolean) => void;
  previewMode?: boolean;
}) => {
  const { data: form, isLoading } = useGetFormHelpdesk({
    formId,
    userId: guestId,
    language,
  });
  const [isDone, setIsDone] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);

  const temporaryData = useHelpdeskFormDraft(guestId || '');

  const { hasNextPage, hasPrevPage, requiredFields, layout } = useMemo(() => {
    if (!form) {
      return baseData;
    }
    const { formFields, customize } = form as FormDetail;
    const layout = customize?.layout;

    if (customize?.layout === 'multiple') {
      return {
        ...baseData,
        requiredFields: formFields.filter((f: any) => f.required),
      };
    }
    const currentField = formFields[currentPage];
    if (!currentField) {
      return baseData;
    }
    return {
      hasNextPage: currentPage < formFields.length - 1,
      hasPrevPage: currentPage > 0,
      layout,
      requiredFields: currentField?.required ? [currentField] : [],
    };
  }, [currentPage, form]);

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
          (field: { name: string; type: string }) =>
            !answer[field.name] || isEmpty(answer[field.name]),
        )?.name;
        const missingInputOfOptionTypeOther = requiredFields.find(
          (field: any) => {
            const answerValue = answer[field.name];
            const otherInputValue = answer[`${field.name}-other`];
            switch (field.type) {
              case 'radio':
                return (
                  field.options?.some(
                    (option: any) => option.type === 'other',
                  ) &&
                  answerValue === 'other' &&
                  !otherInputValue
                );
              case 'checkbox':
                return (
                  field.options?.some(
                    (option: any) => option.type === 'other',
                  ) &&
                  ((answerValue || []) as any)?.includes('other') &&
                  !otherInputValue
                );
              default:
                return false;
            }
          },
        )?.name;
        if (missingField) {
          ctx.addIssue({
            message:
              form?.actions?.requireMessage || `This answer is required!`,
            code: z.ZodIssueCode.unrecognized_keys,
            path: ['answer', missingField],
            keys: ['answer', missingField],
          });
          return false;
        }
        if (missingInputOfOptionTypeOther) {
          ctx.addIssue({
            message:
              form?.actions?.requireOptionMessage ||
              `Please add your answer for 'other' option!`,
            code: z.ZodIssueCode.unrecognized_keys,
            path: ['answer', missingInputOfOptionTypeOther],
            keys: ['answer', missingInputOfOptionTypeOther],
          });
          return false;
        }
        return true;
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
  const actions = form.actions as TActions;

  const { formFields, customize, thankyou } = form as FormDetail;
  const themeName = customize?.theme
    ? extensionsCustomThemeOptions.find(
        (t) => t.hex === customize?.theme || t.name === customize.theme,
      )?.name
    : 'default';
  const bgSrc = `url(${customize?.background})`;

  const onPageChange = (page: number) => {
    const showAll = customize?.layout === 'multiple';
    const inCorrectPage =
      page === currentPage || page > formFields.length - 1 || page < 0;
    if (showAll || inCorrectPage) {
      return;
    }
    if (page > currentPage) {
      formAnswer.trigger().then((isValid) => {
        if (isValid) {
          setCurrentPage(page);
        }
      });
    } else setCurrentPage(page);
  };

  const submit = async (data: TSubmission) => {
    const answer = formFields.reduce(
      (acc, field) => {
        acc[field.name] = data.answer[field.name];
        const otherAnswerOfField = data.answer[field.name + '-other'] as string;
        if (otherAnswerOfField) {
          if (field.type === 'checkbox' && !isEmpty(acc[field.name])) {
            const otherOption = field.options?.find(
              (option) => option.type === 'other',
            );
            const replaceIndex = (acc[field.name] as string[]).findIndex(
              (item: string) => item === otherOption?.value,
            );
            if (replaceIndex !== -1) {
              // @ts-ignore
              acc[field.name][replaceIndex] = otherAnswerOfField;
            }
          } else if (field.type === 'radio') {
            acc[field.name] = otherAnswerOfField;
          }
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

  console.log('form', form);
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
          <ThankYou
            thankyou={thankyou}
            name={form.name}
            onclose={onCloseForm}
            btnName={actions.close}
          />
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
                  const isCurrentQuestion = index === currentPage;
                  const props =
                    layout === 'multiple' ? {} : { hidden: !isCurrentQuestion };
                  return (
                    <RenderField
                      key={field._id}
                      field={field as unknown as TFormField}
                      {...props}
                    />
                  );
                })}
              </div>
            </Form>
            <div className="flex flex-none items-center justify-between px-4 pb-5">
              <Button
                startIcon={<ArrowLeft />}
                color="primary"
                variant="ghost"
                disabled={formAnswer.formState.isSubmitting || !hasPrevPage}
                shape={'square'}
                className={cn('', {
                  invisible: !hasPrevPage,
                })}
                onClick={() => onPageChange(currentPage - 1)}
              >
                {actions.prev}
              </Button>
              <Button
                endIcon={<Send />}
                color="primary"
                variant="default"
                loading={formAnswer.formState.isSubmitting}
                type="submit"
                shape={'square'}
                className={cn('', {
                  hidden: hasNextPage,
                })}
              >
                {actions.submit}
              </Button>
              <Button
                endIcon={<ArrowRight />}
                color="primary"
                variant="default"
                disabled={formAnswer.formState.isSubmitting || !hasNextPage}
                shape={'square'}
                className={cn('', {
                  hidden: !hasNextPage,
                })}
                onClick={() => onPageChange(currentPage + 1)}
              >
                {actions.next}
              </Button>
              <Button
                color="primary"
                variant="default"
                disabled={formAnswer.formState.isSubmitting || !hasNextPage}
                shape={'square'}
                className={cn('', {
                  invisible: !isDone,
                })}
                startIcon={<X />}
              >
                {actions.close}
              </Button>
            </div>
          </form>
        )}
      </main>
    </>
  );
};

export default ExtensionForm;
