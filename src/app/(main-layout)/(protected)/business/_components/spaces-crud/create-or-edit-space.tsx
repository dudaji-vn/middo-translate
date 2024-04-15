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
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import UpdateUserAvatar from '@/features/user-settings/update-user-avatar';
import UploadSpaceImage from './sections/upload-space-image';
import { forEach } from 'lodash';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/utils/cn';
import { createSpaceService } from '@/services/business-space.service';
import CreateSpaceForm from './sections/create-section';
import InviteMembers from './sections/invite-section';



const createSpaceSchema = z.object({
  name: z.string().min(1, {
    message: 'Space name is required.'
  }).max(255, {
    message: 'Space name is too long, maximum 255 characters.'
  }),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
});

type TCreateSpaceFormValues = z.infer<typeof createSpaceSchema>;

export default function CreateOrEditSpace({ open, initialData }: {
  open: boolean;
  initialData?: TSpace;
}) {
  const isClient = useClient()
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [space, setSpace] = React.useState(initialData);

  const formCreateSpace = useForm<TCreateSpaceFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      avatar: '',
      backgroundImage: '',
    },
    resolver: zodResolver(createSpaceSchema),
  });



  useEffect(() => {
    if (open) {
      setTabValue(0);
    }
    if (!open) {
      formCreateSpace.reset();
      return;
    }

  }, [initialData, open]);

  const handleStepChange = (value: number) => {
    // if (value < tabValue) {
    //   // setTabValue(value);
    //   return;
    // }
    // if (formCreateSpace.formState.isSubmitSuccessful) {
    //   setTabValue(value);
    // }
  }

  const submitCreateSpace = async (values: TCreateSpaceFormValues) => {
    formCreateSpace.trigger();
    console.log('values', values)
    try {
      const data = await createSpaceService(values)
      toast.success('Space created successfully.');
      if (data?.data) {
        setSpace(data?.data);
        setTabValue(1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  if (!isClient || !open) return null;
  return (
    <Tabs value={tabValue?.toString()} className="w-full bg-primary-100"
      defaultValue={tabValue.toString()}
      onValueChange={(value) => {
        setTabValue(parseInt(value));
      }}>
      <CreateOrEditSpaceHeader step={tabValue} onStepChange={handleStepChange} />
      <StepWrapper value="0"
        className='px-0'
        cardProps={{
          className: 'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none'
        }}>
        <Form {...formCreateSpace}>
          <form onSubmit={formCreateSpace.handleSubmit(submitCreateSpace)}>
            <CreateSpaceForm />
            <div className='h-fit w-full py-4 bg-primary-100 flex-col flex items-center'>
              <Button
                color={'primary'}
                shape={'square'}
                size={'sm'}
                loading={formCreateSpace.formState.isSubmitting}
                type='submit'
              >
                Create New Space
              </Button>
            </div>
          </form>
        </Form>
      </StepWrapper>
      <StepWrapper
        className='px-0'
        value="1"
        cardProps={{
          className: 'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none'
        }}
      >
        <InviteMembers
          space={space}
        />
      </StepWrapper>
    </Tabs>

  );
}
