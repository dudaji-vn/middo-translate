import { useMemo } from 'react';
import {
  textMiddleVariants,
  textVariants,
  wrapperMiddleVariants,
  wrapperVariants,
} from './message-item-text.style';

import { TriangleSmall } from '@/components/icons/triangle-small';
import { RichTextView } from '@/components/rich-text-view';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useChatStore } from '@/features/chat/stores';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useAuthStore } from '@/stores/auth.store';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { VariantProps } from 'class-variance-authority';
import { useDisplayContent } from '../../hooks/use-display-content';
import { Message } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface ContentProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
  setLinks?: (links: string[]) => void;
  showDetails?: boolean;
  isEditing?: boolean;
}

export const Content = ({
  position,
  active,
  message,
  showDetails,
  isEditing,
}: ContentProps) => {
  const { userLanguage, currentUserId } = useAuthStore((state) => ({
    userLanguage: state.user?.language,
    currentUserId: state.user?._id,
  }));

  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const isMe = message.sender._id === currentUserId;
  const enContent = message.translations?.en;
  const showEnContent = useMemo(() => {
    if (!enContent) return false;
    if (message.status === 'removed') return false;
    if (!showMiddleTranslation && !showDetails) return false;
    if (message.language === DEFAULT_LANGUAGES_CODE.EN && isMe) return false;
    return true;
  }, [
    enContent,
    isMe,
    message.language,
    message.status,
    showDetails,
    showMiddleTranslation,
  ]);
  const { isHelpDesk } = useBusinessNavigationData();
  const { room } = useBusinessExtensionStore();

  const receiverLanguage = useMemo(() => {
    return isHelpDesk
      ? room?.participants?.find((p) => p.status === 'anonymous')?.language
      : userLanguage;
  }, [room, isHelpDesk, userLanguage]);

  const { contentDisplay, isUseOriginal } = useDisplayContent({
    message,
    userLanguage: receiverLanguage,
  });

  return (
    <AnimatePresence mode="sync">
      <div
        className={cn(
          wrapperVariants({ active, position, status: message.status }),
          position === 'right' ? 'me' : '',
          showEnContent ? 'pb-3 md:pb-3' : '',
        )}
      >
        <div
          className={cn(
            textVariants({ position, status: message.status }),
            showEnContent ? 'mb-1 md:mb-1' : '',
            isEditing ? 'text-opacity-20' : '',
          )}
        >
          {message.status === 'edited' && !isEditing && (
            <EditedStatus position={position} />
          )}
          <RichTextView
            editorStyle={cn('text-base md:text-sm', {
              translated: !isUseOriginal,
            })}
            mentions={
              message?.mentions?.map((mention) => ({
                id: mention._id,
                label: mention.name,
              })) || []
            }
            mentionClassName={position === 'right' ? 'right' : 'left'}
            content={contentDisplay}
          />
        </div>
        {showEnContent && (
          <motion.div
            initial={{
              opacity: 0,
              translateY: -5,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <TriangleSmall
              position="top"
              className={cn(
                'absolute left-2 top-0 -translate-y-full fill-primary-400',
              )}
              pathProps={{
                className:
                  position === 'right' ? 'fill-primary-400' : 'fill-[#e6e6e6] dark:fill-neutral-800',
              }}
            />
            <div
              className={cn(
                wrapperMiddleVariants({
                  position,
                  active,
                  status: message.status,
                }),
              )}
            >
              <div
                className={cn(
                  textMiddleVariants({ position, status: message.status }),
                )}
              >
                <RichTextView
                  mentionClassName={position === 'right' ? 'right' : 'left'}
                  editorStyle={cn(
                    'font-light translated text-base md:text-sm dark:text-neutral-50',
                    isEditing ? 'isEditing' : '',
                  )}
                  content={enContent || ''}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

const EditedStatus = ({ position }: { position?: 'left' | 'right' | null }) => {
  const { t } = useTranslation('common');
  return (
    <span
      className={
        'flex text-xs font-light' +
        (position === 'right'
          ? ' justify-end text-primary-300'
          : ' text-neutral-300')
      }
    >
      {t('COMMON.EDITED')}
    </span>
  );
};
