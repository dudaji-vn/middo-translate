'use client';

import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import useClient from '@/hooks/use-client';
import { Tabs } from '@/components/navigation';
import { z } from 'zod';
import { Button } from '@/components/actions';
import { isEmpty } from 'lodash';
import CreateStationForm from './sections/create-section';
import InviteMembers from './sections/invite-section';
import { EStationRoles, Member } from './sections/members-columns';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';
import { usePlatformStore } from '@/features/platform/stores';
import { ROUTE_NAMES } from '@/configs/route-name';
import { GET_STATIONS_KEY } from '@/features/stations/hooks/use-get-spaces';
import StepWrapper from '../../spaces/[spaceId]/settings/_components/extension-creation/steps/step-wrapper';
import CreateStationHeader from './create-station-header';
import { createStation } from '@/services/station.service';

const createStationSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'STATION.ERRORS.NAME_REQUIRED',
    })
    .max(30, {
      message: 'STATION.ERRORS.NAME_MAX_LENGTH',
    }),
  avatar: z.string().min(1, {
    message: 'STATION.ERRORS.AVATAR_REQUIRED',
  }),
  backgroundImage: z.string().optional(),
  members: z
    .array(
      z.object({
        email: z.string().email({
          message: 'STATION.ERRORS.INVALID_EMAIL',
        }),
        role: z.string(),
      }),
    )
    .optional(),
});

type TCreateStationFormValues = z.infer<typeof createStationSchema>;

export default function CreateStation({ open }: { open: boolean }) {
  const isClient = useClient();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [tabErrors, setTabErrors] = React.useState<boolean[]>([false, false]);
  const router = useRouter();
  const platform = usePlatformStore((state) => state.platform);
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const formCreateStation = useForm<TCreateStationFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      avatar: undefined,
      backgroundImage: '',
      members: [],
    },
    resolver: zodResolver(createStationSchema),
  });

  useEffect(() => {
    if (open) {
      setTabValue(0);
    }
    if (!open) {
      formCreateStation.reset();
      return;
    }
  }, [open]);

  const handleStepChange = async (value: number) => {
    await formCreateStation.trigger().then((res) => {
      if (!res) {
        return;
      }
      setTabValue(value);
    });
    setTabErrors([!isEmpty(formCreateStation.formState.errors), false]);
  };

  const submitCreateStation = async (value: any) => {
    formCreateStation.trigger();
    if (!isEmpty(formCreateStation.formState.errors)) {
      customToast.error('Please fill all required fields.');
      setTabErrors([true, false]);
      return;
    }
    try {
      await createStation({
        name: formCreateStation.watch('name'),
        avatar: formCreateStation.watch('avatar'),
        backgroundImage: formCreateStation.watch('backgroundImage'),
        members: formCreateStation.watch('members'),
      });
      customToast.success('Station created successfully.');
      queryClient.invalidateQueries([
        GET_STATIONS_KEY,
        { type: 'all_stations' },
      ]);
      router.push(ROUTE_NAMES.STATIONS + `?platform=${platform}`);
    } catch (err: any) {
      customToast.error(err?.response?.data?.message);
    }
  };
  const canNext = useMemo(() => {
    if (formCreateStation.watch('avatar') && formCreateStation.watch('name')) {
      return formCreateStation.trigger();
    }
    return false;
  }, [formCreateStation.watch('name'), formCreateStation.watch('avatar')]);

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
      <Form {...formCreateStation}>
        <CreateStationHeader
          errors={tabErrors}
          step={tabValue}
          onStepChange={handleStepChange}
        />
        <StepWrapper
          value="0"
          className="px-0"
          cardProps={{
            className:
              'w-full shadow-none dark:bg-background flex flex-col h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none',
          }}
        >
          <CreateStationForm />
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
              'w-full md:pt-10 pt-3  flex flex-col min-h-[calc(100vh-200px)] items-center gap-4 border-none rounded-none shadow-none shadow-none dark:bg-background',
          }}
        >
          <InviteMembers
            station={{
              name: formCreateStation.watch('name'),
              avatar: formCreateStation.watch('avatar'),
              members: formCreateStation.watch('members') || [],
            }}
            setMembers={(members: Member[]) =>
              formCreateStation.setValue('members', members)
            }
            allowedRoles={[EStationRoles.Admin, EStationRoles.Member]}
          />
          <div className="flex h-fit w-full flex-col items-center bg-primary-100 py-6 dark:bg-background">
            <form
              onSubmit={formCreateStation.handleSubmit(submitCreateStation)}
            >
              <Button
                color={'primary'}
                shape={'square'}
                type="submit"
                size={'sm'}
                loading={formCreateStation.formState.isSubmitting}
                disabled={!formCreateStation.formState.isValid}
              >
                {t('STATION.CREATE_BUTTON')}
              </Button>
            </form>
          </div>
        </StepWrapper>
      </Form>
    </Tabs>
  );
}
