'use client';

import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import useClient from '@/hooks/use-client';
import { useAuthStore } from '@/stores/auth.store';
import { Tabs } from '@/components/navigation';
import CreateOrEditSpaceHeader from './create-or-edit-space-header';
import { z } from 'zod';
import { TSpace } from '../business-header/business-spaces';
import StepWrapper from '../../settings/_components/extension-creation/steps/step-wrapper';
import { Avatar, Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { ArrowRight } from 'lucide-react';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';


type TFormValues = {
  information: {
    name: string;
    description?: string;
    avatar?: string;
  };
  members: any[];
}


const createSpaceSchema = z.object({
  information: z.object({
    name: z.string(),
    description: z.string().optional(),
    avatar: z.string().optional(),
  }),
  members: z.array(z.object({})),
});

export default function CreateOrEditSpace({ open, initialData }: {
  open: boolean;
  initialData?: TSpace;
}) {
  const isClient = useClient()
  const [tabValue, setTabValue] = React.useState<number>(0);
  const pathname = usePathname() || '';
  const currentUser = useAuthStore((s) => s.user);
  const router = useRouter();

  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      information: {
        name: '',
        description: '',
        avatar: '/empty-cam.svg',
      },
      members: [],
    },
    resolver: zodResolver(createSpaceSchema),
  });

  const {
    watch,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting, },
  } = form;

  useEffect(() => {
    if (open) {
      setTabValue(0);
    }
    if (!open) {
      reset();
      return;
    }

  }, [initialData, open]);


  const submit = async (values: TFormValues) => {
    trigger();

    try {
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  if (!isClient || !open) return null;
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <Tabs value={tabValue?.toString()} className="w-full bg-primary-100"
          defaultValue={tabValue.toString()}
          onValueChange={(value) => {
            setTabValue(parseInt(value));
          }}>
          <CreateOrEditSpaceHeader step={tabValue} onStepChange={setTabValue} />
          <StepWrapper value="0"
            className='px-0'
            cardProps={{
              className: 'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none'
            }}>
            <section
              className='max-w-[800px] h-[calc(100vh-200px)] min-h-80  flex flex-col items-center justify-center gap-8'
            >
              <div className='w-full flex flex-col  gap-3'>
                <Typography className='text-neutral-800 text-[32px] font-semibold leading-9'>
                  Give <span className='text-primary-500-main'>your space</span> some information
                </Typography>
                <Typography className='text-neutral-600 font-normal'>
                  Help your crews to recognize your business easier by naming this space, adding space avatar or company&apos;s logo <span className='font-light'>(optional)</span>.
                </Typography>
              </div>
              <div className='w-full flex flex-row gap-3 p-3 bg-primary-100 items-center rounded-[12px]'>
                <Avatar src={watch('information.avatar') ?? '/empty-cam.svg'} alt='avatar' className='w-24 h-24 cursor-pointer p-0' />
                <RHFInputField name='information.name'
                  formItemProps={{
                    className: 'w-full'
                  }}
                  inputProps={{
                    placeholder: 'Enter space name',
                    required: true,
                  }} />
              </div>

            </section>
          </StepWrapper>
          <StepWrapper value="1" >
            Adding members
          </StepWrapper>
          <div className='h-fit py-4 bg-primary-100 flex flex-row justify-between'>
            <em />
            <Button
              endIcon={<ArrowRight />}
              color={'primary'}
              shape={'square'}
              size={'sm'}
            >
              Next
            </Button>
            <em />

          </div>
        </Tabs>
      </form>
    </Form>

  );
}
