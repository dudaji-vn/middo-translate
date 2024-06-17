'use client';

import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import useClient from '@/hooks/use-client';
import { Tabs } from '@/components/navigation';
import CreateOrEditSpaceHeader from './create-or-edit-space-header';
import { z } from 'zod';
import StepWrapper from '../../settings/_components/extension-creation/steps/step-wrapper';
import { Button } from '@/components/actions';
import { isEmpty } from 'lodash';
import { createOrEditSpace } from '@/services/business-space.service';
import CreateSpaceForm from './sections/create-section';
import InviteMembers from './sections/invite-section';
import { Member } from './sections/members-columns';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SPACES_KEY } from '@/features/business-spaces/hooks/use-get-spaces';
import { ESPaceRoles } from '../../settings/_components/space-setting/setting-items';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';
import { usePlatformStore } from '@/features/platform/stores';
import { ROUTE_NAMES } from '@/configs/route-name';

const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'EXTENSION.SPACE.ERRORS.NAME_REQUIRED',
    })
    .max(30, {
      message: 'EXTENSION.SPACE.ERRORS.NAME_MAX_LENGTH',
    }),
  avatar: z.string().min(1, {
    message: 'EXTENSION.SPACE.ERRORS.AVATAR_REQUIRED',
  }),
  backgroundImage: z.string().optional(),
  members: z
    .array(
      z.object({
        email: z.string().email({
          message: 'EXTENSION.SPACE.ERRORS.INVALID_EMAIL',
        }),
        role: z.string(),
      }),
    )
    .optional(),
});

type TCreateSpaceFormValues = z.infer<typeof createSpaceSchema>;

export default function CreateOrEditSpace({ open }: { open: boolean }) {
  const isClient = useClient();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [tabErrors, setTabErrors] = React.useState<boolean[]>([false, false]);
  const router = useRouter();
  const platform = usePlatformStore((state) => state.platform);
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const formCreateSpace = useForm<TCreateSpaceFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      avatar: undefined,
      backgroundImage: '',
      members: [],
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
  }, [open]);

  const handleStepChange = async (value: number) => {
    await formCreateSpace.trigger().then((res) => {
      if (!res) {
        return;
      }
      setTabValue(value);
    });
    setTabErrors([!isEmpty(formCreateSpace.formState.errors), false]);
  };

  const submitCreateSpace = async (value: any) => {
    formCreateSpace.trigger();
    if (!isEmpty(formCreateSpace.formState.errors)) {
      customToast.error('Please fill all required fields.');
      setTabErrors([true, false]);
      return;
    }
    try {
      await createOrEditSpace({
        name: formCreateSpace.watch('name'),
        avatar: formCreateSpace.watch('avatar'),
        backgroundImage: formCreateSpace.watch('backgroundImage'),
        members: formCreateSpace.watch('members'),
      });
      customToast.success('Space created successfully.');
      queryClient.invalidateQueries([GET_SPACES_KEY, { type: 'all_spaces' }]);
      router.push(ROUTE_NAMES.SPACES + `?platform=${platform}`);
    } catch (err: any) {
      customToast.error(err?.response?.data?.message);
    }
  };
  const canNext = useMemo(() => {
    if (formCreateSpace.watch('avatar') && formCreateSpace.watch('name')) {
      return formCreateSpace.trigger();
    }
    return false;
  }, [formCreateSpace.watch('name'), formCreateSpace.watch('avatar')]);

  if (!isClient || !open) return null;
  return (
    <Tabs
      value={tabValue?.toString()}
      className="w-full bg-primary-100 dark:bg-background"
      defaultValue={tabValue.toString()}
      onValueChange={(value) => {
        setTabValue(parseInt(value));
      }}
    >
      <Form {...formCreateSpace}>
        <CreateOrEditSpaceHeader
          errors={tabErrors}
          step={tabValue}
          onStepChange={handleStepChange}
        />
        <StepWrapper
          value="0"
          className="px-0"
          cardProps={{
            className:
              'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none',
          }}
        >
          <CreateSpaceForm />
          <div className="flex h-fit w-full flex-col items-center bg-primary-100 py-4 dark:bg-background">
            <Button
              color={canNext ? 'primary' : 'disabled'}
              shape={'square'}
              size={'sm'}
              onClick={() => handleStepChange(1)}
            >
              {t('PAGINATION.NEXT')}
            </Button>
          </div>
        </StepWrapper>
        <StepWrapper
          className="px-0"
          value="1"
          cardProps={{
            className:
              'w-full flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none dark:bg-background',
          }}
        >
          <InviteMembers
            space={{
              name: formCreateSpace.watch('name'),
              avatar: formCreateSpace.watch('avatar'),
              members: formCreateSpace.watch('members') || [],
            }}
            setMembers={(members: Member[]) =>
              formCreateSpace.setValue('members', members)
            }
            allowedRoles={[ESPaceRoles.Admin, ESPaceRoles.Member]}
          />
          <div className="flex h-fit w-full flex-col items-center bg-primary-100 py-4 dark:bg-background">
            <form onSubmit={formCreateSpace.handleSubmit(submitCreateSpace)}>
              <Button
                color={'primary'}
                shape={'square'}
                type="submit"
                size={'sm'}
                loading={formCreateSpace.formState.isSubmitting}
                disabled={!formCreateSpace.formState.isValid}
              >
                {t('EXTENSION.SPACE.CREATE_BUTTON')}
              </Button>
            </form>
          </div>
        </StepWrapper>
      </Form>
    </Tabs>
  );
}
