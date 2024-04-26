'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cva } from 'class-variance-authority';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useMemo, useState } from 'react';
import { ExtensionModalType } from '../../space-setting/space-setting';
import { cn } from '@/utils/cn';
import { TabsList, TabsTrigger } from '@/components/navigation';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
const headerVariants = cva('w-full flex flex-row', {
  variants: {
    navigation: {
      default: 'hidden',
      'create-extension': 'w-full py-2 flex flex-row gap-3',
      'edit-extension': 'w-full py-2 flex flex-row gap-3',
      'edit-company': 'w-full py-2 flex flex-row gap-3',
    },
  },
});
const mappedTitle = {
  'edit-extension': 'Edit Extension',
  'create-extension': 'Create Extension',
  'edit-company': 'Edit Company',
};
export const createExtensionSteps = [
  {
    title: 'Add Domains',
    value: 0,
    nameField: 'domains',
  },
  {
    title: 'Starting Message',
    value: 1,
    nameField: 'custom.firstMessage',
  },
  {
    title: 'Custom Extension',
    value: 2,
    nameField: 'custom.color',
  },
];

const CreateExtensionHeader = ({
  step = 0,
  onStepChange,
  // canNext,
  isError,
}: {
  step: number;
  onStepChange: (value: number) => void;
  // canNext: boolean;
  isError?: boolean;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modalType: ExtensionModalType = searchParams?.get(
    'modal',
  ) as ExtensionModalType;
  const handleStepChange = async (index: number) => {
    if (step === index) return;
    onStepChange(index);
  };
  const {
    trigger,
    watch,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful, isDirty },
  } = useFormContext();
  const stepPercentage = (step / (createExtensionSteps.length - 1)) * 100;
  const currentValue = watch(createExtensionSteps[step]?.nameField);
  const [canNext, setCanNext] = useState<boolean>(false);

  const onStepClick = (newStep: number) => {
    trigger(createExtensionSteps[step]?.nameField).then((result) => {
      setCanNext(result);
      if (result) {
        handleStepChange(newStep);
      }
    });
  };
  useEffect(() => {
    if (!isEmpty(currentValue)) {
      trigger(createExtensionSteps[step]?.nameField).then((result) => {
        setCanNext(result);
      });
    }
  }, [currentValue]);

  useEffect(() => {
    if (isEmpty(currentValue)) setCanNext(false);
  }, [step, currentValue]);

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
          {mappedTitle[modalType || 'create-extension']}
        </Typography>
      </div>
      <TabsList className="relative max-w-[900px] justify-between gap-5 border-none md:mx-10 xl:mx-14">
        <div className="absolute inset-0 !z-0 h-[50%] w-full border-b-[1px] border-dashed border-b-neutral-50"></div>
        <div
          style={{ width: `${stepPercentage}%` }}
          className="absolute  left-0 top-0 !z-10 h-[50%] border-b-[2px] border-b-neutral-200 transition-all duration-1000"
        ></div>
        {createExtensionSteps.map((item, index) => {
          const isActive = step === index;
          let isDone = step > index || isSubmitting || isSubmitSuccessful;
          const isAfterCurrent = step < index;
          return (
            <TabsTrigger
              variant="unset"
              value={String(item.value)}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleStepChange(index);
              }}
              className="z-20"
              disabled={step !== index && !canNext}
            >
              <Button
                shape={'square'}
                size={'xs'}
                key={index}
                variant={'ghost'}
                className={cn(
                  'flex flex-row gap-3',
                  isActive && '!bg-neutral-50',
                  isAfterCurrent && '!bg-neutral-50  hover:bg-primary-100',
                  isDone && '!bg-success-100',
                  isError && '!bg-error-100' && step === index,
                )}
              >
                <div
                  className={cn(
                    ' h-6 w-6 rounded-full ',
                    isActive && 'bg-primary-500-main text-white',
                    isAfterCurrent && 'bg-neutral-200 text-white',
                    isDone && 'bg-success-700 text-white',
                    isError && 'bg-error-500 text-white' && step === index,
                  )}
                >
                  {isDone ? <Check className="h-6 w-6" /> : item.value + 1}
                </div>
                <p
                  className={cn(
                    'font-light max-md:hidden',
                    isActive && 'text-primary-500-main ',
                    isAfterCurrent && 'text-neutral-200',
                    isDone && 'text-success-700',
                    isError && 'text-error-500' && step === index,
                  )}
                >
                  {' '}
                  {item.title}
                </p>
              </Button>
            </TabsTrigger>
          );
        })}
      </TabsList>
      <Button
        type={step === createExtensionSteps.length - 1 ? 'submit' : 'button'}
        onClick={() => onStepClick(step + 1)}
        color={canNext ? 'primary' : 'disabled'}
        loading={isSubmitting}
        shape={'square'}
        className={cn('h-11')}
      >
        {step === createExtensionSteps.length - 1 ? 'Save' : 'Next'}
      </Button>
    </section>
  );
};

export default CreateExtensionHeader;
