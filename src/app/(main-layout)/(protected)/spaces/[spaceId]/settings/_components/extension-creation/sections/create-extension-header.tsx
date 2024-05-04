'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cva } from 'class-variance-authority';
import { ArrowLeft, Check, Pen } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
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
  isEditing,
}: {
  step: number;
  onStepChange: (value: number) => void;
  // canNext: boolean;
  isError?: boolean;
  isEditing?: boolean;
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
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();
  const stepPercentage = isEditing
    ? 100
    : (step / (createExtensionSteps.length - 1)) * 100;
  const currentValue = watch(createExtensionSteps[step]?.nameField);
  const [canNext, setCanNext] = useState<boolean>(false);
  const btnSubmitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isEmpty(currentValue)) {
      trigger(createExtensionSteps[step]?.nameField).then((result) => {
        setCanNext(result);
      });
    }
    console.log('step=== ', step);
    if (isEmpty(currentValue)) setCanNext(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          let isDone =
            step > index || isSubmitting || isSubmitSuccessful || isEditing;
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
              className="z-20 min-h-[70px]"
              disabled={step !== index && !canNext}
            >
              <Button
                shape={'square'}
                size={'xs'}
                key={index}
                variant={'ghost'}
                className={cn(
                  'flex flex-row font-light gap-3 transition-all px-3 py-2 duration-300',
                  isActive && '!bg-neutral-50',
                  isAfterCurrent && '!bg-neutral-50  hover:bg-primary-100',
                  isError && '!bg-error-100' && step === index,
                  isDone && '!bg-success-100',
                  {
                    'py-3 px-4 text-base font-semibold': isActive,
                  }
                )}
              >
                <div
                  className={cn(
                    isActive && 'bg-primary-500-main text-white',
                    isAfterCurrent && 'bg-neutral-200 text-white',
                    isError && 'bg-error-500 text-white' && step === index,
                    isDone && 'bg-success-700 text-white',
                    'flex size-6 items-center justify-center rounded-full text-[12px]',
                  )}
                >
                  {(isEditing || (isDone && !isActive)) && (
                    <Check className="size-3" />
                  )}
                  {isActive && !isDone && <Pen className=" size-3" />}
                  {!isDone && !isActive && index + 1}
                </div>
                <p
                  className={cn(
                    ' max-md:hidden',
                    isActive && 'text-primary-500-main ',
                    isAfterCurrent && 'text-neutral-200',
                    isError && 'text-error-500' && step === index,
                    isDone && 'text-success-700',
                  )}
                >
                  {item.title}
                </p>
              </Button>
            </TabsTrigger>
          );
        })}
      </TabsList>
      <em />
      <em />
      <button ref={btnSubmitRef} type="submit" className="hidden" />
    </section>
  );
};

export default CreateExtensionHeader;
