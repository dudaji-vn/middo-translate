'use client';

import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import useClient from '@/hooks/use-client';
import { Tabs } from '@/components/navigation';
import CreateOrEditSpaceHeader from './create-or-edit-space-header';
import { z } from 'zod';
import StepWrapper from '../../settings/_components/extension-creation/steps/step-wrapper';
import { Button } from '@/components/actions';
import { isEmpty } from 'lodash';
import { createOrEditSpace} from '@/services/business-space.service';
import CreateSpaceForm from './sections/create-section';
import InviteMembers from './sections/invite-section';
import { Member } from './sections/members-columns';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SPACES_KEY } from '@/features/business-spaces/hooks/use-get-spaces';



const createSpaceSchema = z.object({
  name: z.string().min(1, {
    message: 'Space name is required.'
  }).max(50, {
    message: 'Space name is too long, maximum 500 characters.'
  }),
  avatar: z.string().min(1, {
    message: 'Space avatar is required.'
  }),
  backgroundImage: z.string().optional(),
  members: z.array(z.object({
    email: z.string().email({
      message: 'Invalid email address'
    }),
    role: z.string()
  })).optional()
});

type TCreateSpaceFormValues = z.infer<typeof createSpaceSchema>;

export default function CreateOrEditSpace({ open }: {
  open: boolean;
}) {
  const isClient = useClient()
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [tabErrors, setTabErrors] = React.useState<boolean[]>([false, false]);
  const queryClient = useQueryClient();

  const formCreateSpace = useForm<TCreateSpaceFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      avatar: undefined,
      backgroundImage: '',
      members: []
    },
    resolver: zodResolver(createSpaceSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTabValue(0);
    }
    if (!open) {
      formCreateSpace.reset();
      return;
    }

  }, [open]);

  const handleStepChange = async (value: number) => {
    await formCreateSpace.trigger();
    console.log('formCreateSpace.formState.errors', formCreateSpace.formState.errors)
    setTabErrors([!isEmpty(formCreateSpace.formState.errors), false]);
    setTabValue(value);
  }

  const submitCreateSpace = async (value: any) => {
    formCreateSpace.trigger();
    if (!isEmpty(formCreateSpace.formState.errors)) {
      toast.error('Please fill all required fields.');
      setTabErrors([true, false]);
      return;
    }
    try {
      const data = await createOrEditSpace({
        name: formCreateSpace.watch('name'),
        avatar: formCreateSpace.watch('avatar'),
        backgroundImage: formCreateSpace.watch('backgroundImage'),
        members: formCreateSpace.watch('members')
      })
      toast.success('Space created successfully.');
      queryClient.invalidateQueries([GET_SPACES_KEY, { type: 'all_spaces' }]);
      router.push('/spaces');
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
      <Form {...formCreateSpace}>
        <CreateOrEditSpaceHeader
          errors={tabErrors}
          step={tabValue}
          onStepChange={handleStepChange} />
        <StepWrapper value="0"
          className='px-0'
          cardProps={{
            className: 'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none'
          }}>
          <CreateSpaceForm />
          <div className='h-fit w-full py-4 bg-primary-100 flex-col flex items-center'>
            <Button
              color={'primary'}
              shape={'square'}
              size={'sm'}
              onClick={() => handleStepChange(1)}
            >
              Next
            </Button>
          </div>
        </StepWrapper>
        <StepWrapper
          className='px-0'
          value="1"
          cardProps={{
            className: 'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none'
          }}
        >
          <InviteMembers
            space={{
              name: formCreateSpace.watch('name'),
              avatar: formCreateSpace.watch('avatar'),
              members: formCreateSpace.watch('members') || []
            }}
            setMembers={(members: Member[]) => formCreateSpace.setValue('members', members)}
          />
          <div className='h-fit w-full py-4 bg-primary-100 flex-col flex items-center'>

            <form onSubmit={formCreateSpace.handleSubmit(submitCreateSpace)} >  <Button
              color={'primary'}
              shape={'square'}
              type='submit'
              size={'sm'}
              loading={formCreateSpace.formState.isSubmitting}
              disabled={!formCreateSpace.formState.isValid}
            >
              Create space and Invite members
            </Button>
            </form>
          </div>
        </StepWrapper>

      </Form>
    </Tabs>

  );
}
