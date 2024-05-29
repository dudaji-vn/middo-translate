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
  CreateSpace = 'create-space',
}
const headerVariants = cva('w-full flex flex-row', {
  variants: {
    navigation: {
      default: 'hidden',
      'create-space': 'w-full py-2 flex flex-row gap-3',
    },
  },
});
const mappedTitle = {
  'create-space': 'Create Space',
};
export const createSpaceSteps = [
  {
    title: 'EXTENSION.SPACE.SPACE_INFOR',
    value: 0,
    nameField: 'information',
    requiredFields: ['information.name', 'information.avatar'],
  },
  {
    title: 'EXTENSION.MEMBER.INVITE_MEMBER',
    value: 1,
    nameField: 'members',
    requiredFields: ['members'],
  },
];

const CreateOrEditSpaceHeader = ({
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

  const stepPercentage = (step / (createSpaceSteps.length - 1)) * 100;

  return (
    <section
      className={cn(
        'createSpaceSteps-center flex w-full flex-row items-center justify-between gap-3 bg-primary-100 px-4',
        headerVariants({ navigation: modalType || 'default' }),
      )}
    >
      <div className="flex flex-row items-center gap-2">
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
        <Typography className="min-w-max capitalize text-neutral-600">
          {mappedTitle[modalType || 'create-space']}
        </Typography>
      </div>
      <TabsList className="relative max-w-[600px] justify-between gap-5 border-none md:mx-10 xl:mx-14">
        <div className="absolute inset-0 !z-0 h-[50%] w-full border-b-[1px] border-dashed border-b-neutral-50"></div>
        <div
          style={{ width: `${stepPercentage}%` }}
          className="absolute  left-0 top-0 !z-10 h-[50%] border-b-[2px] border-b-neutral-200 transition-all duration-1000"
        />
        {createSpaceSteps.map((item, index) => {
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
                  isActive && '!bg-neutral-50',
                  isAfterCurrent && '!bg-neutral-50  hover:bg-primary-100',
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
                    'font-light max-md:hidden',
                    isActive && 'text-primary-500-main ',
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
      <em />
    </section>
  );
};

export default CreateOrEditSpaceHeader;
