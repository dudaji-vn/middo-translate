'use client';

import React from 'react';
import {
  DEFAULT_THEME,
  extensionsCustomThemeOptions,
} from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { Button, ButtonProps } from '../../actions';
import { Check, CircleIcon, Plus, XIcon } from 'lucide-react';
import { generateRandomHexColor } from '@/utils/color-generator';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';

export const COLOR_REGEX = /^#[0-9A-F]{6}$/i;

export type TColorSelectorProps = {
  selectedColor: string;
  colorNameField: string;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  gridContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  itemProps?: ButtonProps;
  randomButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
  addButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
  listColors?: string[];
  defaultTheme: string;
};
const RHFColorSelector = ({
  selectedColor,
  colorNameField,
  wrapperProps,
  gridContainerProps,
  itemProps,
  randomButtonProps,
  addButtonProps,
  defaultTheme = DEFAULT_THEME,
  listColors = extensionsCustomThemeOptions.map((color) => color.hex),
}: TColorSelectorProps) => {
  const { setValue } = useFormContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onRandomColor = () => {
    setValue(colorNameField, generateRandomHexColor());
  };
  const onClickManualAddColor = () => {
    inputRef.current?.click();
  };
  const colorOptions = listColors;

  const manualColor = selectedColor && !colorOptions.includes(selectedColor);
  return (
    <div
      {...wrapperProps}
      className={cn('flex w-full flex-col gap-3', wrapperProps?.className)}
    >
      <div
        {...gridContainerProps}
        className={cn(
          'md:grid-cols-14 xl:grid-cols-16 2xl:grid-cols-20 grid  grid-flow-row grid-cols-4 sm:grid-cols-8 lg:grid-cols-8 ',
          gridContainerProps?.className,
        )}
      >
        {colorOptions.map((color, index) => {
          const isSelect = selectedColor === color;
          return (
            <Button.Icon
              key={color}
              variant="ghost"
              type="button"
              {...itemProps}
              className={cn(
                'relative size-8 bg-transparent',
                itemProps?.className,
              )}
              onClick={() => {
                setValue(colorNameField, color);
              }}
            >
              <CircleIcon
                className="absolute inset-0 m-auto size-full"
                stroke={
                  selectedColor === color
                    ? 'var(--color-primary)'
                    : 'var(--color-neutral-500)'
                }
                fill={color}
              />
              <Check
                stroke="white"
                className={`absolute inset-0 m-auto  size-[50%] ${isSelect ? 'block' : 'hidden'}`}
              />
            </Button.Icon>
          );
        })}
        <Button.Icon
          // variant="ghost"
          color={'default'}
          type="button"
          {...itemProps}
          onClick={(e) => {
            if (manualColor) {
              setValue(colorNameField, defaultTheme);
            } else {
              onClickManualAddColor();
            }
          }}
          className={cn(
            'relative size-8 border-[2px] border-white bg-transparent dark:border-neutral-800',
            itemProps?.className,
          )}
        >
          {manualColor && (
            <CircleIcon
              className="absolute inset-0 m-auto size-full"
              stroke={selectedColor || '#FAFAFA'}
              fill={selectedColor || '#FAFAFA'}
            />
          )}
          <input
            onChange={(e) => {
              setValue(colorNameField, e.target.value);
            }}
            ref={inputRef}
            type="color"
            className="invisible absolute inset-0"
          />

          {manualColor ? (
            <>
              <Check
                stroke="white"
                className={`absolute inset-0 m-auto size-[50%] hover:hidden`}
              />
              <Button.Icon
                color={'default'}
                className="absolute -right-0 -top-0 !h-[16px]  !w-[16px] bg-black p-1 text-white opacity-60 hover:opacity-100"
              >
                <XIcon />
              </Button.Icon>
            </>
          ) : (
            <Plus
              stroke="grey"
              className={`absolute inset-0 m-auto h-6 w-6 stroke-neutral-700 `}
            />
          )}
        </Button.Icon>
      </div>
      <div
        className={cn(
          'relative flex w-full flex-row items-start gap-3 rounded-[12px]',
        )}
      ></div>
    </div>
  );
};

export default RHFColorSelector;
