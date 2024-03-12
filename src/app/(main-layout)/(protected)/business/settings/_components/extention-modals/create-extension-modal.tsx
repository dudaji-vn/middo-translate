'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import {
  Accordion,
} from '@/components/data-display/accordion';
import RHFInputField from '@/components/form/RHF/RHFInputField/RHFInputField';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { createExtensionSchema } from '@/configs/yup-form';

import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';

import { Info, Plus, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateExtensionCode } from './genrerateExtensionCode';
import { CreateExtensionSectionWrapper } from './create-exstension-sections/create-extension-section-wrapper';
import { createExtensionService } from '@/services/extension.service';
import toast from 'react-hot-toast';
import { TBusinessExtensionData } from '../extenstion/business-extension';
import { isEmpty } from 'lodash';


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
  const [isClient, setIsClient] = React.useState(false);
  const pathname = usePathname();
  const [accordionValue, setAccordionValue] = React.useState<AccordionValue>('add domain');
  const router = useRouter();

  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      addingDomain: '',
      domains: [],
      // TODO: remove mock data
      custom: {
        language: 'vi',
        firstMessage: 'Thử nghiệm',
        firstMessageEnglish: 'Test',
        color: '',
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
    formState: { errors, isValid, isSubmitting },
  } = form;
  const domains: Array<string> = watch('domains');
  const addingDomain: string = watch('addingDomain');
  const domainsErrMessage = errors?.domains?.message;
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!open && initialData) { reset(); return }
    if (!isEmpty(initialData)) {
      setValue('domains', initialData.domains);
      setValue('custom', {
        language: initialData.language,
        firstMessage: initialData.firstMessage,
        firstMessageEnglish: initialData.firstMessageEnglish,
        color: initialData.color,
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
      await createExtensionService(payload);
      toast.success('Create extension success!');
      setOpen(false);
      reset()
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

  if (!isClient) return null;
  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-fit  max-w-screen-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(submit)}>
            <DialogTitle className="flex h-[48px] flex-row items-center justify-between py-4 pr-2">
              <Typography variant="h4">
                <Info className="absolute -left-8 top-1/2 -translate-y-1/2 transform" />
                {title}
              </Typography>
            </DialogTitle>
            <div className=" max-h-[calc(85vh-48px)] max-w-screen-md overflow-y-scroll bg-white [&_h3]:mt-4  [&_h3]:text-[1.25rem]">
              <Accordion
                type="single"
                collapsible
                value={accordionValue}
                className="w-full transition-all duration-500 flex flex-col gap-2 justify-center"
                onValueChange={(value) => setAccordionValue(value as AccordionValue)}
              >
                <CreateExtensionSectionWrapper
                  title="add domain"
                  isDone={domains?.length > 0}
                  onNextStep={() => { setAccordionValue('custom extension') }}
                >
                  <Typography variant="h5" className="inline-block py-3 text-neutral-600 text-[1rem] font-normal">
                    Add all domains that you would like the extension to appear on
                  </Typography>
                  <div className='flex flex-row items-start gap-4 w-full justify-between'>
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
                      disabled={Boolean(errors.addingDomain)}
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
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    );
                  })
                  }
                  <Typography className="inline-block py-3 text-red-500 text-[1rem] font-normal">{domainsErrMessage}</Typography>
                </CreateExtensionSectionWrapper>

                <CreateExtensionSectionWrapper
                  title="custom extension"
                  isDone={true}
                  onNextStep={() => { setAccordionValue('copy & paste code') }}
                >
                  updating...
                </CreateExtensionSectionWrapper>

                <CreateExtensionSectionWrapper
                  title="copy & paste code"
                >
                  <Typography className="inline-block py-3 text-neutral-600 text-[1rem] font-normal">
                    Copy and paste the code below into your website
                  </Typography>
                  <pre className='bg-neutral-50 rounded-[20px] w-full overflow-x-auto'>
                    <code className='text-neutral-600 text-sm p-2' lang='javascript'>
                      {generateExtensionCode()}
                    </code>
                  </pre>

                </CreateExtensionSectionWrapper>
              </Accordion>
            </div>
            <div className="flex justify-end gap-4 p-4">
              <Button
                variant="ghost"
                color="default"
                shape="square"
                type='button'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                color="primary"
                shape="square"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Save & Close
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
}
