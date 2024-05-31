import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { MessagesSquare, Minus, Monitor, Smartphone } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import { Triangle } from '@/components/icons';
import { DEFAULT_THEME } from './options';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { TimeDisplay } from '@/features/chat/messages/components/time-display';
import { PreviewReceivedMessage } from './preview-received-message';
import { isEmpty } from 'lodash';
import { FlowNode } from '../steps/script-chat-flow/design-script-chat-flow';
import { useTranslation } from 'react-i18next';

export type PluginChatPreviewProps = {
  content: string;
  language: string;
  color?: string;
  space: TSpace;
  firstButtonNode?: FlowNode;
  onTranslatedChange?: (translated: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export type TPreviewDevice = 'desktop' | 'mobile';
const DeviceWrapper = ({
  children,
  isMobile,
}: {
  children: ReactNode;
  isMobile?: boolean;
}) => {
  return (
    <div
      className={
        isMobile
          ? 'z-0 mx-auto grid h-[756px] w-[375px]  grid-cols-1  place-content-end rounded-[32px] border-[1rem] border-neutral-50 bg-neutral-400 shadow-[2px_10px_24px_2px_#1616161A]'
          : ''
      }
    >
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-[400px] flex-col rounded-[20px] bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]',
          isMobile && 'rounded-b-[16px] shadow-none',
        )}
      >
        {children}
        <Triangle
          fill="#ffffff"
          position="top"
          className={
            isMobile
              ? 'hidden'
              : 'absolute -bottom-4  right-6 -translate-y-full rotate-180'
          }
        />
      </div>
    </div>
  );
};
const devices: Array<{ name: TPreviewDevice; icon: ReactNode }> = [
  {
    name: 'desktop',
    icon: <Monitor className="w-10/12" />,
  },
  {
    name: 'mobile',
    icon: <Smartphone className="w-10/12" />,
  },
];

const PluginChatPreview = ({
  className,
  content,
  firstButtonNode,
  language,
  color,
  onTranslatedChange,
  space,
  ...props
}: PluginChatPreviewProps) => {
  const { t } = useTranslation('common');
  const [selectedDevice, setSelectedDevice] =
    React.useState<TPreviewDevice>('desktop');
  const [isStarted, setIsStarted] = React.useState(false);

  const themeColor = color || DEFAULT_THEME;
  const isMobile = selectedDevice === 'mobile';

  return (
    <div
      {...props}
      className={cn('flex flex-col divide-y divide-neutral-50', className)}
    >
      <div className="flex  flex-row items-center justify-start gap-3 px-3 py-2">
        <Typography className="text-sm font-medium leading-[18px] text-neutral-800">
          {t('COMMON.PREVIEW')}
        </Typography>
        <div className="flex flex-row items-center gap-1 rounded-[8px] bg-neutral-50 p-1">
          {devices.map((device, index) => {
            const isSelect = selectedDevice === device.name;
            return (
              <Button.Icon
                key={device.name}
                shape={'square'}
                variant="ghost"
                color={'default'}
                type="button"
                className={cn(
                  'rounded-[4px]',
                  isSelect
                    ? 'bg-white hover:!bg-white'
                    : 'bg-neutral-50 hover:!bg-gray-50',
                )}
                onClick={() => setSelectedDevice(device.name)}
              >
                {device.icon}
              </Button.Icon>
            );
          })}
        </div>
      </div>
      <div className="relative  h-fit space-y-4 p-5">
        <DeviceWrapper isMobile={isMobile}>
          <div className="flex h-11 w-full flex-row items-center justify-between border-b border-neutral-50 px-3">
            <div className="flex w-full flex-row items-center justify-start">
              <Typography className={'min-w-14 text-xs text-neutral-600'}>
                Power by
              </Typography>
              <Image
                src="/logo.png"
                priority
                alt="logo"
                width={50}
                height={50}
              />
            </div>
            <Minus className="h-4 w-4" />
          </div>
          <div
            className="flex w-full flex-col items-end space-y-4 overflow-y-auto overflow-x-hidden p-4"
            id="chat-container"
          >
            <div className="w-full">
              <TimeDisplay time={new Date().toString()} />
            </div>
            <PreviewReceivedMessage
              space={space}
              media={[]}
              debouncedTime={0}
              content={content}
            />
            <Button
              className={cn('h-10  w-fit hover:!bg-neutral-50', {
                hidden: isEmpty(firstButtonNode),
              })}
              variant={'outline'}
              color={'primary'}
              type={'button'}
              style={{
                borderColor: themeColor,
                color: themeColor,
              }}
            >
              {firstButtonNode?.data?.content}
            </Button>
          </div>
          <div className={'flex flex-col gap-6 p-4'}>
            <Button
              variant={'default'}
              shape={'square'}
              className={cn('h-11 w-full rounded-[12px] hover:opacity-80')}
              style={{ backgroundColor: themeColor }}
              onClick={() => setIsStarted(true)}
            >
              Start a conversation
            </Button>
          </div>
        </DeviceWrapper>
        <div
          className={
            isMobile
              ? 'hidden'
              : 'relative mx-auto flex max-w-[400px] flex-row justify-end'
          }
        >
          <div className="relative w-fit  rounded-full bg-white p-4 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]">
            <MessagesSquare className={`h-6 w-6`} stroke={themeColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginChatPreview;
