'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import {
  Accordion,
} from '@/components/data-display/accordion';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormLabel } from '@/components/ui/form';
import { createExtensionSchema } from '@/configs/yup-form';

import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';

import { CopyIcon, Info, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { generateExtensionCode } from '@/utils/genrerateExtensionCode';
import { CreateExtensionSectionWrapper } from './sections/create-extension-section-wrapper';
import { createExtensionService } from '@/services/extension.service';
import toast from 'react-hot-toast';
import { TBusinessExtensionData } from '../extenstion/business-extension';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Spinner } from '@/components/feedback';
import { useTextCopy } from '@/hooks/use-text-copy';
import CustomThemeOptions from './sections/custom-theme-options';
import { TThemeOption, DEFAULT_THEME } from './sections/options';
import CustomFirstMessageOptions from './sections/custom-first-message-options';
import PluginChatPreview from './sections/plugin-chat-preview';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import useClient from '@/hooks/use-client';


type TFormValues = {
  addingDomain: string;
  domains: Array<string>;
  custom: {
    language: string;
    firstMessage: string;
    firstMessageEnglish: string;
    color: string;
  };

}

type AccordionValue = 'add domain' | 'custom extension' | 'copy & paste code'

export default function CreateExtensionModal({ open, initialData, title = 'Create Extension', onOpenChange: setOpen }: {
  open: boolean;
  initialData?: TBusinessExtensionData;
  title?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const isClient = useClient()
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [accordionValue, setAccordionValue] = React.useState<AccordionValue>('add domain');
  const [submitedData , setSubmitedData] = React.useState<TFormValues>();
  const [extensionId, setExtensionId] = React.useState<string>();
  const { copy } = useTextCopy();
  const router = useRouter();

  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      addingDomain: '',
      domains: [],
      custom: {
        language: 'vi',
        firstMessage: 'Xin chào, tôi có thể giúp gì cho bạn?',
        firstMessageEnglish: 'Hello, how can I help you?',
        color: DEFAULT_THEME,
      },
    },
    resolver: zodResolver(createExtensionSchema),
  });
  const {
    watch,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting, },
  } = form;
  const domains: Array<string> = watch('domains');
  const addingDomain: string = watch('addingDomain');
  const domainsErrMessage = errors?.domains?.message;

  useEffect(() => {
    if (!open && initialData) { reset(); return }
    if (!isEmpty(initialData)) {
      setValue('domains', initialData.domains);
      setValue('custom', {
        language: initialData.language,
        firstMessage: initialData.firstMessage,
        firstMessageEnglish: initialData.firstMessageEnglish,
        color: initialData.color || DEFAULT_THEME,
      });
    }
  }, [initialData, open]);

  const submit = async (values: TFormValues) => {
    trigger();
    const payload = {
      domains: values.domains,
      ...values.custom,
    };
    try {
      createExtensionService(payload).then((res) => {
        setExtensionId(res.data._id);
        toast.success('Create extension success!');
        setAccordionValue('copy & paste code');
        setSubmitedData(values);
      }).catch((err) => {
        toast.error(err?.response?.data?.message || 'Create extension failed!');
        setAccordionValue('custom extension');
      })
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };
  const addDomain = () => {
    if (!addingDomain || domains?.includes(addingDomain)) return;
    const newDomains = Array.from(new Set([...domains, addingDomain]));
    setValue('domains', newDomains);
    setValue('addingDomain', '');
    trigger('domains');
  }

  const removeDomain = (domain: string) => {
    setValue('domains', domains.filter((d) => d !== domain));
    trigger('domains');
  }    
  const initialCustom = {
    language: initialData?.language,
    firstMessage: initialData?.firstMessage,
    firstMessageEnglish: initialData?.firstMessageEnglish,
    color: initialData?.color || DEFAULT_THEME,
  };
  const onOpenChange = (open: boolean) => {
    const currentFormData = form.getValues();
    const isSubmited = isEqual(currentFormData, submitedData);
    console.log('submitedData, currentFormData', submitedData, currentFormData)
    const isChanged = !isEqual(currentFormData.domains, initialData?.domains) || !isEqual(currentFormData.custom, initialCustom);
    if (!open && !isEmpty(initialData) && isChanged && !isSubmited) {
      setOpenConfirmDialog(true);
      return;
    }
    setOpen(open);
  }
  if (!isClient) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="h-fit  max-w-screen-xl md:max-w-screen-md"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <Form {...form}>
            <form onSubmit={handleSubmit(submit)}>
              <DialogTitle className="flex h-[48px] flex-row items-center justify-between py-4 pr-2">
                <Typography variant="h4">
                  <Info className="absolute -left-8 top-1/2 -translate-y-1/2 transform" />
                  {title}
                </Typography>
              </DialogTitle>
              <div className=" max-h-[calc(85vh-48px)] max-w-screen-xl md:max-w-screen-md overflow-y-scroll bg-white [&_h3]:text-[1.25rem]">
                <Accordion
                  type="single"
                  collapsible
                  value={accordionValue}
                  className="w-full transition-all duration-500 flex flex-col justify-center"
                  onValueChange={(value) => setAccordionValue(value as AccordionValue)}
                >
                  <CreateExtensionSectionWrapper
                    value="add domain"
                    isDone={domains?.length > 0}
                    onNextStep={() => {
                      trigger('domains');
                      if (isValid) setAccordionValue('custom extension')
                    }}
                  >
                    <Typography variant="h5" className="inline-block py-3 text-neutral-600 text-[1rem] font-normal">
                      Add all domains that you would like the extension to appear on
                    </Typography>
                    <div className='flex flex-row items-start w-full justify-between'>
                      <RHFInputField
                        name='addingDomain'
                        inputProps={{
                          placeholder: 'https://example.com',
                          className: 'h-10',
                        }}
                        formItemProps={{
                          className: 'w-5/6',
                        }}
                      />
                      <Button
                        variant="ghost"
                        color="default"
                        shape="square"
                        type="button"
                        className='h-10'
                        onClick={addDomain}
                        disabled={Boolean(errors.addingDomain) || isSubmitting}

                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    {domains?.length > 0 && <Typography variant="h5" className="inline-block py-3 text-neutral-600 text-[1rem] font-medium">Added domains</Typography>}
                    {domains?.map((domain, index) => {
                      if (!domain?.length) {
                        removeDomain(domain);
                        return null;
                      }
                      return (
                        <div key={index} className={cn('flex flex-row items-center gap-4 w-full justify-between')}>
                          <Typography className="text-neutral-600 text-[1rem] font-normal">
                            {domain}
                          </Typography>
                          <Button
                            variant="ghost"
                            color="error"
                            shape="square"
                            type="button"
                            size={'xs'}
                            onClick={() => removeDomain(domain)}
                            disabled={isSubmitting}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      );
                    })
                    }
                  </CreateExtensionSectionWrapper>
                  <Typography className={domainsErrMessage && !isValid ? "inline-block py-1 text-red-500 text-[1rem] font-normal" : 'hidden'}>{domainsErrMessage}</Typography>
                  <CreateExtensionSectionWrapper
                    value="custom extension"
                    isDone={true}
                    nextStepType='submit'
                    nextStepProps={{
                      disabled: !isValid,
                      loading: isSubmitting,
                    }}
                    accordionContentProps={{
                      className: 'px-0'
                    }}
                  >
                    <div className='flex flex-row divide-x divide-neutral-50 px-4 border-x border-b border-neutral-50 '>
                      <div className='w-1/3 divide-y divide-neutral-50'>
                        <div className='flex flex-col gap-3 p-3'>
                          <FormLabel
                            className="mb-1 inline-block text-neutral-900 text-[1rem] font-semibold"
                          >
                            Starting message
                          </FormLabel>
                          <CustomFirstMessageOptions
                            firstMessage={watch('custom.firstMessage')}
                            onFirstMessageChange={(message) => {
                              setValue('custom.firstMessage', message);
                            }}
                          />
                        </div>
                        <CustomThemeOptions selectedColor={watch('custom.color')} onChange={(color: TThemeOption['hex']) => {
                          setValue('custom.color', color);
                        }} />
                      </div>
                      <PluginChatPreview className='w-2/3' content={watch('custom.firstMessage')} language={watch('custom.language')} />
                    </div>
                  </CreateExtensionSectionWrapper>
                  <CreateExtensionSectionWrapper
                    value="copy & paste code"
                  >
                    <Typography className="inline-block py-3 text-neutral-600 text-[1rem] font-normal">
                      Copy and paste the code below into your website
                    </Typography>
                    <div className="relative w-full bg-neutral-50  max-h-60 text-neutral-600 text-sm rounded-lg overflow-auto">
                      <Button.Icon
                        variant="ghost"
                        size={'xs'}
                        type="button"
                        className='text-neutral-400 absolute right-4 top-1'
                        onClick={() => {
                          copy(generateExtensionCode(`/help-desk/${extensionId}`));
                        }}
                      ><CopyIcon />
                      </Button.Icon>
                      <pre className="bg-transparent  text-neutral-600 text-sm rounded-lg overflow-auto px-2 whitespace-pre-wrap pr-7">
                        <code className='text-neutral-600 text-sm p-2' lang='javascript'>
                          {generateExtensionCode(`/help-desk/${extensionId}`)}
                        </code>
                      </pre>
                    </div>
                  </CreateExtensionSectionWrapper>
                  {isSubmitting && <Spinner className='my-2 mx-auto text-primary-200' />}
                </Accordion>
              </div>
            </form>
          </Form>

        </DialogContent>
        <ConfirmAlertModal
          title="You didn't save your changes"
          description="Are you sure you want to leave?"
          open={openConfirmDialog}
          onOpenChange={setOpenConfirmDialog}
          onConfirm={() => {
            setOpen(false);
            reset();
            setOpenConfirmDialog(false);
          }}
          onCancel={() => { setOpenConfirmDialog(false) }}
        />
      </Dialog>
    </>
  );
}
