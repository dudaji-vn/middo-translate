import React from 'react';
import {
  TThemeOption,
  DEFAULT_THEME,
  extensionsCustomThemeOptions,
} from './options';
import { Button } from '@/components/actions';
import { Check, CircleIcon, Info, Plus } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';

export type CustomThemeColorProps = {
  selectedColor: TThemeOption['hex'] | null;
  onChange: (color: TThemeOption['hex']) => void;
};
const CustomExtension = ({
  selectedColor,
  onChange,
}: CustomThemeColorProps) => {
  // TODO: Implement this feature
  const isPro = false;

  return (
    <section className="flex flex-col gap-1">
      <div className="rounded-[12px]  bg-primary-100 p-3  0">
        <FormLabel className="mb-3 inline-block text-[1rem] font-normal text-neutral-500">
          Theme
        </FormLabel>
        <div className="grid grid-flow-row grid-cols-4 md:grid-cols-6  lg:grid-cols-8 xl:grid-cols-10 ">
          {extensionsCustomThemeOptions.map((color, index) => {
            const isSelect = selectedColor === color.hex;
            return (
              <Tooltip
                title={color.name}
                key={color.hex}
                contentProps={{
                  className: 'text-neutral-800 capitalize',
                }}
                triggerItem={
                  <Button.Icon
                    variant="ghost"
                    type="button"
                    className="relative !h-6 !w-6"
                    onClick={() =>
                      selectedColor === color.hex
                        ? onChange(DEFAULT_THEME)
                        : onChange(color.hex)
                    }
                  >
                    <CircleIcon
                      className="h-6 w-6"
                      stroke={
                        selectedColor === color.hex
                          ? 'var(--color-primary)'
                          : 'var(--color-neutral-500)'
                      }
                      fill={color.hex}
                    />
                    <Check
                      stroke="white"
                      className={`absolute left-1 top-1 h-4 w-4 ${
                        isSelect ? 'block' : 'hidden'
                      }`}
                    />
                  </Button.Icon>
                }
              />
            );
          })}
          <Tooltip
            title={'Custom (This feature is not available yet)'}
            contentProps={{
              className: 'text-neutral-800',
            }}
            triggerItem={
              <Button.Icon
                variant="ghost"
                type="button"
                className="relative !h-6  !w-6 bg-neutral-100 hover:bg-neutral-200"
              >
                <Plus
                  stroke="grey"
                  className={`absolute left-1 top-1 h-4 w-4 stroke-neutral-700 `}
                />
              </Button.Icon>
            }
          />
        </div>
      </div>
      <div
        className={cn(
          'flex  flex-row items-center justify-between rounded-[12px] bg-primary-100 p-3  0',
          isPro ? '' : 'opacity-70',
        )}
      >
        <FormLabel className="mb-3 inline-block text-[1rem] font-normal text-neutral-500">
          Conversation icon
        </FormLabel>
        <div className="flex items-center gap-1 text-primary-500-main">
          <Typography className="font-semibold text-primary-500-main">
            PRO
          </Typography>
          <Info size={11} />
        </div>
      </div>
      <div
        className={cn(
          'flex  flex-row items-center justify-between rounded-[12px] bg-primary-100 p-3  0',
          isPro ? '' : 'opacity-70',
        )}
      >
        <FormLabel className="mb-3 inline-block text-[1rem] font-normal text-neutral-500">
          Middo icon
        </FormLabel>
        <div className="flex items-center gap-1 text-primary-500-main">
          <Typography className="font-semibold text-primary-500-main">
            PRO
          </Typography>
          <Info size={11} />
        </div>
      </div>
      <div
        className={cn(
          'flex  flex-row items-center justify-between rounded-[12px] bg-primary-100 p-3  0',
          isPro ? '' : 'opacity-70',
        )}
      >
        <FormLabel className="mb-3 inline-block text-[1rem] font-normal text-neutral-500">
          Video call
        </FormLabel>
        <div className="flex items-center gap-1 text-primary-500-main">
          <Typography className="font-semibold text-primary-500-main">
            PRO
          </Typography>
          <Info size={11} />
        </div>
      </div>
    </section>
  );
};

export default CustomExtension;
