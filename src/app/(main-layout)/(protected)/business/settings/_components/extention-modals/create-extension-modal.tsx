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
import { usePathname } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateExtensionCode } from './genrerateExtensionCode';
import { CreateExtensionSectionWrapper } from './create-exstension-sections/create-extension-section-wrapper';


type TFormValues = {
  addingDomain: string;
  domains: Array<string>;
  custom: {
    language: string;
    firstMessage: string;
    theme: string;
  };

}

type AccordionValue = 'add domain' | 'custom extension' | 'copy & paste code'

export default function CreateExtensionModal() {
  const [isClient, setIsClient] = React.useState(false);
  const pathname = usePathname();
  const defaultValue: AccordionValue = 'add domain';

  const [open, setOpen] = React.useState(false);
  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      addingDomain: '',
      domains: [],
      custom: {
        language: '',
        firstMessage: '',
        theme: '',
      },
    },
    resolver: zodResolver(createExtensionSchema),
  });
  const {
    watch,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = form;
  const domains: Array<string> = watch('domains');
  const addingDomain: string = watch('addingDomain');
  const domainsErrMessage = errors?.domains?.message;
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const onOpenModal = () => {
    setOpen(true);
  }
  const submit = async (values: TFormValues) => {
    trigger();
    console.log('values :>>', values)
    try {

    } catch (err: any) {

    } finally {
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
  console.log('errors', errors, isValid)
  if (!isClient) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-fit  max-w-screen-md">
          <Form {...form}>
            <form onSubmit={handleSubmit(submit)}>
              <DialogTitle className="flex h-[48px] flex-row items-center justify-between py-4 pr-2">
                <Typography variant="h4">
                  <Info className="absolute -left-8 top-1/2 -translate-y-1/2 transform" />
                  Create Extension
                </Typography>
              </DialogTitle>
              <div className=" max-h-[calc(85vh-48px)] max-w-screen-md overflow-y-scroll bg-white [&_h3]:mt-4  [&_h3]:text-[1.25rem]">

                <Accordion
                  type="single"
                  collapsible
                  className="w-full transition-all duration-500 "
                  defaultValue={defaultValue}
                >
                  <CreateExtensionSectionWrapper
                    title="add domain"
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
      <Button variant={'default'} color={'primary'} className='m-4' shape={'square'} onClick={onOpenModal}>
        <Plus className="h-4 w-4" />
        <Typography className="ml-2 text-white">
          Create Extension
        </Typography>
      </Button>

    </>
  );
}
