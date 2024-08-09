'use client';

import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/actions';
import { Tabs } from '@/components/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { usePlatformStore } from '@/features/platform/stores';
import { GET_STATIONS_KEY } from '@/features/stations/hooks/use-get-stations';
import useClient from '@/hooks/use-client';
import { createStation } from '@/services/station.service';
import { useAuthStore } from '@/stores/auth.store';
import customToast from '@/utils/custom-toast';
import { useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import StepWrapper from '../../../spaces/[spaceId]/settings/_components/extension-creation/steps/step-wrapper';
import CreateStationForm from '../sections/create-section';
import CreateTeams from '../sections/create-teams-section';
import InviteMembers from '../sections/invite-section';
import { EStationRoles, Member } from '../sections/members-columns';
import CreateStationHeader from './create-station-header';
import { ArrowLeft } from 'lucide-react';

const createStationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: 'STATION.ERRORS.NAME_REQUIRED',
    })
    .max(30, {
      message: 'STATION.ERRORS.NAME_MAX_LENGTH',
    }),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  teams: z.array(z.object({ name: z.string() })).optional(),
  members: z
    .array(
      z.object({
        usernameOrEmail: z.string().min(1),
        role: z.string().default(EStationRoles.Member),
        teamName: z.string().optional(),
      }),
    )
    .optional(),
});

export const defaultTeams = ['Administrator'];
type TCreateStationFormValues = z.infer<typeof createStationSchema>;
export default function CreateStation({ open }: { open: boolean }) {
  const isClient = useClient();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [tabErrors, setTabErrors] = React.useState<boolean[]>([false, false]);
  const router = useRouter();
  const platform = usePlatformStore((state) => state.platform);
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const currentUser = useAuthStore((state) => state.user);
  const formCreateStation = useForm<TCreateStationFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      avatar: undefined,
      backgroundImage: '',
      members: [
        {
          usernameOrEmail: currentUser?.username!,
          role: EStationRoles.Owner,
          teamName: defaultTeams[0],
        },
      ],
      teams: defaultTeams.map((team) => ({ name: team })),
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
        name: formCreateStation.watch('name').trim(),
        avatar: formCreateStation.watch('avatar'),
        backgroundImage: formCreateStation.watch('backgroundImage'),
        members: formCreateStation.watch('members'),
        teams: formCreateStation.watch('teams'),
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
  if (!isClient || !open) return null;

  return (
    <Tabs
      value={tabValue?.toString()}
      className="flex h-full w-full flex-col bg-primary-100 dark:bg-background"
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
          className="h-full px-0"
          canNext
          onNextStep={() => handleStepChange(1)}
          cardProps={{
            className:
              'w-full shadow-none dark:bg-background flex flex-col h-[calc(100vh-204px)] items-center gap-4 border-none rounded-none shadow-none',
          }}
        >
          <CreateStationForm />
        </StepWrapper>
        <StepWrapper
          canPrev
          canNext
          onNextStep={() => handleStepChange(2)}
          onPrevStep={() => handleStepChange(0)}
          className="flex-1 px-0"
          value="1"
          cardProps={{
            className:
              'w-full md:pt-10 pt-3 h-full flex flex-col h-[calc(100vh-204px)] items-center gap-4 border-none rounded-none shadow-none shadow-none dark:bg-background',
          }}
        >
          <CreateTeams
            station={{
              name: formCreateStation.watch('name'),
              avatar: formCreateStation.watch('avatar'),
              members: formCreateStation.watch('members') || [],
              teams:
                formCreateStation.watch('teams')?.map((team) => team.name) ||
                [],
            }}
            onSetTeams={(teams) =>
              formCreateStation.setValue(
                'teams',
                teams.map((team) => ({ name: team })),
              )
            }
          />
        </StepWrapper>
        <StepWrapper
          footerProps={{
            className: 'hidden',
          }}
          className="px-0"
          value="2"
          cardProps={{
            className:
              'w-full md:pt-10 pt-3 flex flex-col h-[calc(100vh-204px)] overflow-hidden items-center gap-4 border-none rounded-none shadow-none shadow-none dark:bg-background',
          }}
        >
          <InviteMembers
            station={{
              name: formCreateStation.watch('name'),
              avatar: formCreateStation.watch('avatar'),
              members: formCreateStation.watch('members') || [],
              teams: formCreateStation.watch('teams') || [],
            }}
            onMembersChange={(members: Member[]) =>
              formCreateStation.setValue('members', members)
            }
          />
        </StepWrapper>
        {tabValue === 2 && (
          <div className="flex h-fit w-full items-center justify-between bg-primary-100 py-4 dark:bg-background">
            <Button
              variant={'ghost'}
              color={'default'}
              shape={'square'}
              size={'sm'}
              startIcon={<ArrowLeft />}
              onClick={() => handleStepChange(1)}
            >
              Previous
            </Button>
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
            <Button
              variant={'ghost'}
              color={'default'}
              shape={'square'}
              size={'sm'}
              startIcon={<ArrowLeft />}
              className="invisible"
            >
              Next
            </Button>
          </div>
        )}
      </Form>
    </Tabs>
  );
}
