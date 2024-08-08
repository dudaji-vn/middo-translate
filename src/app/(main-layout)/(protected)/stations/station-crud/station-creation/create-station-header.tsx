'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cva } from 'class-variance-authority';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { cn } from '@/utils/cn';
import { TabsList } from '@/components/navigation';
import { useTranslation } from 'react-i18next';

enum BusinessModalType {
  CreateStation = 'create-station',
}
const headerVariants = cva('w-full flex', {
  variants: {
    navigation: {
      default: 'hidden',
      'create-station': 'w-full py-2 flex gap-3',
    },
  },
});

export const createStationSteps = [
  {
    title: 'STATION.STATION_INFO',
    value: 0,
    nameField: 'information',
    requiredFields: ['information.name', 'information.avatar'],
  },
  {
    title: 'STATION.STATION_TEAM',
    value: 1,
    nameField: 'team',
  },
  {
    title: 'EXTENSION.MEMBER.INVITE_MEMBER',
    value: 2,
    nameField: 'members',
    requiredFields: ['members'],
  },
];

const CreateStationHeader = ({
  step = 0,
  onStepChange,
  errors = [],
}: {
  step: number;
  onStepChange: (value: number) => void;
  errors: boolean[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation('common');
  const modalType: BusinessModalType = searchParams?.get(
    'modal',
  ) as BusinessModalType;

  const stepPercentage = (step / (createStationSteps.length - 1)) * 100;

  return (
    <section
      className={cn(
        'createStationSteps-center flex w-full min-w-fit flex-col items-center justify-between gap-3  bg-primary-100 px-4 dark:bg-background md:flex-row',
        headerVariants({ navigation: modalType || 'default' }),
      )}
    >
      <div className="flex w-full flex-row items-center justify-start gap-2 md:w-fit">
        <Button.Icon
          onClick={() => {
            router.back();
          }}
          variant={'ghost'}
          size={'xs'}
          color={'default'}
          className="text-neutral-600"
        >
          <ArrowLeft className="" />
        </Button.Icon>
        <Typography className="min-w-max capitalize text-neutral-600 dark:text-neutral-50 max-sm:min-w-32">
          {t('MODAL.CREATE_STATION.HEADING')}
        </Typography>
      </div>
      <div className="flex flex-1 justify-center">
        <TabsList className="relative w-fit justify-between gap-24 border-none md:mx-10 xl:mx-14">
          <div className="absolute inset-0 !z-0 h-[50%] w-full border-b-[1px] border-dashed border-b-neutral-50"></div>
          <div
            style={{ width: `${stepPercentage}%` }}
            className="absolute  left-0 top-0 !z-10 h-[50%] border-b-[2px] border-b-neutral-200 transition-all duration-1000"
          />
          {createStationSteps.map((item, index) => {
            const isActive = step === index;
            const isAfterCurrent = step < index;
            const isError = errors[index] && index < step;
            const isDone = step > index && !isError;
            const stepContent = isDone ? (
              <Check className="text-white" />
            ) : (
              index + 1
            );
            return (
              <div key={index} className="z-20">
                <Button
                  disabled={index > step + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onStepChange(index);
                  }}
                  shape={'square'}
                  size={'xs'}
                  variant={'ghost'}
                  className={cn(
                    'flex flex-row gap-3',
                    isActive && '!bg-neutral-50 dark:!bg-neutral-800',
                    isAfterCurrent &&
                      '!bg-neutral-50 hover:bg-primary-100  dark:!bg-neutral-800',
                    isDone &&
                      '!active:bg-success-200 !bg-success-100 hover:bg-success-200',
                    isError && '!bg-error-100',
                  )}
                >
                  <div
                    className={cn(
                      ' h-6 w-6 rounded-full ',
                      isActive && 'bg-primary-500-main text-white',
                      isAfterCurrent && 'bg-neutral-200 text-white',
                      isDone &&
                        '!active:bg-success-200 bg-success-700 text-white',
                      isError && 'bg-error text-white',
                    )}
                  >
                    {stepContent}
                  </div>
                  <p
                    className={cn(
                      'font-light ',
                      isActive ? 'text-primary-500-main' : 'max-md:hidden',
                      isAfterCurrent && 'text-neutral-200',
                      isDone && 'text-success-700',
                      isError && 'text-error-500',
                    )}
                  >
                    {t(item.title)}
                  </p>
                </Button>
              </div>
            );
          })}
        </TabsList>
      </div>
    </section>
  );
};

export default CreateStationHeader;
