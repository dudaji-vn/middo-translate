'use client';

import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import useClient from '@/hooks/use-client';
import { useAuthStore } from '@/stores/auth.store';
import { Tabs } from '@/components/navigation';
import CreateOrEditSpaceHeader, { createSpaceSteps } from './create-or-edit-space-header';
import { z } from 'zod';
import { TSpace } from '../business-header/business-spaces';
import StepWrapper from '../../settings/_components/extension-creation/steps/step-wrapper';
import { Avatar, Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { ArrowRight, Plus } from 'lucide-react';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import UpdateUserAvatar from '@/features/user-settings/update-user-avatar';
import UploadSpaceImage from './upload-space-image';
import { forEach } from 'lodash';
import { DataTable } from '@/components/ui/data-table';


type TFormValues = {
  information: {
    name: string;
    description?: string;
    avatar?: string;
  };
  members: any[];
  addingMember?: {
    email: string;
    role: string;
  }
}


const createSpaceSchema = z.object({
  information: z.object({
    name: z.string().min(1, {
      message: 'Space name is required.'
    }).max(255, {
      message: 'Space name is too long, maximum 255 characters.'
    }),
    description: z.string().optional(),
    avatar: z
      .any()
      .refine((value: any) => value?.length > 0 || value?.size > 0, {
        message: "Please upload an image.",
      })
      .refine((value: any) => value?.size < 3000000, {
        message: "Image size must be less than 3MB.",
      }),
    addingMember: z.object({
      email: z.string().email({
        message: 'Invalid email address.'
      }),
      role: z.string().optional(),
    }).optional(),
  }),
  members: z.string().optional(),
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

  const onNextClick = async () => {
    const requiredFields = createSpaceSteps[tabValue]?.requiredFields;
    await Promise.all(
      requiredFields.map((field) => trigger(field as keyof TFormValues))
    );

    const canGoNext = requiredFields.every((field) => !errors[field as keyof TFormValues]);
    if (canGoNext) {
      setTabValue(tabValue + 1);
    }
  };
  const addMember = () => {
    const addingMember = watch('addingMember');
    if (!addingMember || addingMember.length === 0) return;
    setValue('members', [...watch('members'), addingMember]);
    setValue('addingMember', '');
    trigger('members');
  }
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
                <UploadSpaceImage />
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
          <StepWrapper
            className='px-0'
            value="1"
            cardProps={{
              className: 'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none'
            }}
          >
            <section
              className='max-w-[800px] h-[calc(100vh-200px)] min-h-80  flex flex-col items-center justify-center gap-8'
            >
              <div className='w-full flex flex-col  gap-3'>
                <Typography className='text-neutral-800 text-[32px] font-semibold leading-9'>
                  <span className='text-primary-500-main'>Invite</span>other to join your space <span className='text-[24px] font-normal'>(optional)</span>
                </Typography>
                <Typography className='text-neutral-600 flex gap-2 font-light'>
                  You can only invite 2 members in a Free plan account.
                  <span className='text-primary-500-main font-normal'>
                    upgrade plan.
                  </span>
                </Typography>
              </div>
              <div className='flex flex-row gap-3 items-start w-full justify-between'>
                <RHFInputField
                  name='addingMember'
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
                  endIcon={<Plus className="h-4 w-4 mr-1" />}
                  className='h-10'
                  onClick={addMember}
                  disabled={Boolean(errors.addingMember) || isSubmitting}

                >
                  Invite
                </Button>
              </div>
              <div className='w-full p-3 bg-primary-100 items-center rounded-[12px]'>
                updating
              </div>

            </section>
          </StepWrapper>
          <div className='h-fit py-4 bg-primary-100 flex flex-row justify-between'>
            <em />
            <Button
              endIcon={(tabValue < createSpaceSteps.length - 1) ? <ArrowRight /> : <></>}
              color={'primary'}
              shape={'square'}
              size={'sm'}
              onClick={onNextClick}
            >
              {tabValue === createSpaceSteps.length - 1 ? 'Create My Space' : 'Next'}
            </Button>
            <em />

          </div>
        </Tabs>
      </form>
    </Form>

  );
}
