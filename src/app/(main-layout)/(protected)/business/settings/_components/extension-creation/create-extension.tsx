'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form, FormLabel } from '@/components/ui/form';
import { createExtensionSchema } from '@/configs/yup-form';

import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';

import { CopyIcon, Info, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { generateExtensionCode } from '@/utils/genrerateExtensionCode';
import { createExtensionService } from '@/services/extension.service';
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Spinner } from '@/components/feedback';
import { useTextCopy } from '@/hooks/use-text-copy';
import useClient from '@/hooks/use-client';
import { useAuthStore } from '@/stores/auth.store';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { DEFAULT_FIRST_MESSAGE, DEFAULT_THEME, TThemeOption } from './sections/options';
import CustomFirstMessageOptions from './sections/custom-first-message-options';
import PluginChatPreview from './sections/plugin-chat-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';
import CustomExtension from './sections/custom-extension';


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

type TabValue = 'add domain' | 'starting message' | 'custom extension' | 'copy & paste code'

export default function CreateExtension({ open, initialData, title = 'Create Extension' }: {
  open: boolean;
  initialData?: TBusinessExtensionData;
  title?: string;
}) {
  const isClient = useClient()
  const [tabValue, setTabValue] = React.useState<TabValue>('add domain');
  const [submitedData, setSubmitedData] = React.useState<TFormValues>();
  const currentUser = useAuthStore((s) => s.user);
  const [extensionId, setExtensionId] = React.useState<string>();
  const { copy } = useTextCopy();
  const router = useRouter();

  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      addingDomain: '',
      domains: [],
      custom: {
        language: currentUser?.language,
        firstMessage: DEFAULT_FIRST_MESSAGE.content,
        firstMessageEnglish: DEFAULT_FIRST_MESSAGE.contentEnglish,
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
    if (open) {
      setTabValue('add domain');
    }
    if (!open && initialData) { reset(); return }
    if (!isEmpty(initialData)) {
      setExtensionId(initialData._id);
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
        setTabValue('copy & paste code');
        setSubmitedData(values);
      }).catch((err) => {
        toast.error(err?.response?.data?.message || 'Create extension failed!');
        setTabValue('custom extension');
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

  if (!isClient || !open) return null;
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <Tabs defaultValue='add domains' className="w-full">
          <TabsList>
            <TabsTrigger value="add domains">Adding Domain</TabsTrigger>
            <TabsTrigger value="starting message">Starting Message</TabsTrigger>
            <TabsTrigger value="custom extension">Custom Extension</TabsTrigger>
            <TabsTrigger value="copy & paste code">Copy & Paste Code</TabsTrigger>
          </TabsList>
          <TabsContent value="add domains" className="p-4">
            <Typography variant="h5" className="inline-block py-3 text-neutral-600 text-[1rem] font-normal">
              Add all domains that you would like the extension to appear on
            </Typography>
            <div className='flex flex-row gap-3 items-start w-full justify-between'>
              <RHFInputField
                name='addingDomain'
                inputProps={{
                  placeholder: 'https://example.com',
                  className: 'h-10'
                }}
                formItemProps={{
                  className: 'w-full',
                }}
              />
              <Button
                color="secondary"
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
            <Typography className={domainsErrMessage && !isValid ? "inline-block py-1 text-red-500 text-[1rem] font-normal" : 'hidden'}>{domainsErrMessage}</Typography>
          </TabsContent>
          <TabsContent value="starting message" className="p-4">
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
          </TabsContent>
          <TabsContent value="custom extension" >
            <div className=" max-h-[calc(85vh-48px)] max-w-screen-md md:max-w-screen-xl overflow-y-scroll bg-white [&_h3]:text-[1.25rem]">
              <div className='flex flex-row divide-x divide-neutral-50  border-x border-b border-neutral-50 '>
                <div className='w-1/3  flex flex-col p-4 gap-3'>
                  <Typography variant="h5" className="font-semibold text-neutral-900 text-[1rem]">Custom style</Typography>
                  <Typography className=" text-neutral-500 text-[1rem] font-normal">Create your own extension style </Typography>
                  <CustomExtension selectedColor={watch('custom.color')} onChange={(color: TThemeOption['hex']) => {
                    setValue('custom.color', color);
                  }} />
                </div>
                <PluginChatPreview
                  onTranslatedChange={(text) => {
                    setValue('custom.firstMessageEnglish', text);
                  }}
                  className='w-2/3' content={watch('custom.firstMessage')} language={watch('custom.language')} color={watch('custom.color')} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="copy & paste code" className="p-4">
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
                  copy(generateExtensionCode(`/help-desk/${extensionId}`, watch('custom.color')));
                }}
              ><CopyIcon />
              </Button.Icon>
              <pre className="bg-transparent  text-neutral-600 text-sm rounded-lg overflow-auto px-2 whitespace-pre-wrap pr-7">
                <code className='text-neutral-600 text-sm p-2' lang='javascript'>
                  {generateExtensionCode(`/help-desk/${extensionId}`, watch('custom.color'))}
                </code>
              </pre>
            </div>
            {isSubmitting && <Spinner className='my-2 mx-auto text-primary-200' />}
          </TabsContent>
        </Tabs>
      </form>
    </Form>

  );
}
