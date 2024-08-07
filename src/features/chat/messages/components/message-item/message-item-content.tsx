import { useMemo } from 'react';
import {
  textMiddleVariants,
  textVariants,
  wrapperMiddleVariants,
  wrapperVariants,
} from './message-item-text.style';

import { TriangleSmall } from '@/components/icons/triangle-small';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useChatStore } from '@/features/chat/stores';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useAuthStore } from '@/stores/auth.store';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { VariantProps } from 'class-variance-authority';
import { useDisplayContent } from '../../hooks/use-display-content';
import { Message } from '../../types';
import { AnimatePresence, m, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RichTextView } from './rich-text-view';
import { useMessageActions } from '../message-actions';

export interface ContentProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
  setLinks?: (links: string[]) => void;
  showDetails?: boolean;
  isEditing?: boolean;
  keyword?: string;
}

export const Content = ({
  position,
  active,
  message,
  showDetails,
  isEditing,
  keyword,
}: ContentProps) => {
  const { isOnHelpDeskChat } = useBusinessNavigationData();
  const { userLanguage, currentUserId } = useAuthStore((state) => ({
    userLanguage: state.user?.language,
    currentUserId: state.user?._id,
  }));
  const { t } = useTranslation('common');
  const { action, message: activeMessage } = useMessageActions();

  const isActionActive = useMemo(() => {
    return activeMessage?._id === message._id;
  }, [activeMessage, message._id]);
  const isOriginal = action === 'view-original' && isActionActive;

  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const isMe = message.sender._id === currentUserId;
  const isMeTheAnonymous =
    message.senderType === 'anonymous' && isOnHelpDeskChat;

  const enContent = message.translations?.en;

  const showEnContent = useMemo(() => {
    if (!enContent) return false;
    if (message.status === 'removed') return false;
    if (!showMiddleTranslation && !showDetails) return false;
    if (
      message.language === DEFAULT_LANGUAGES_CODE.EN &&
      (isMe || isMeTheAnonymous)
    )
      return false;
    return true;
  }, [
    enContent,
    isMe,
    message.language,
    message.status,
    showDetails,
    showMiddleTranslation,
    isMeTheAnonymous,
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
    useOriginal: isOriginal,
  });
  if (message.status === 'removed') {
    return (
      <div
        className={cn(
          wrapperVariants({ active, position, status: message.status }),
          position === 'right' ? 'me' : '',
        )}
      >
        <div className={cn(textVariants({ position, status: message.status }))}>
          {contentDisplay}
        </div>
      </div>
    );
  }
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
          <div className="flex items-center gap-1">
            {message.status === 'edited' && !isEditing && (
              <EditedStatus position={position} />
            )}
            {isOriginal && (
              <span
                className={
                  'flex text-xs font-light' +
                  (position === 'right'
                    ? ' justify-end text-primary-300'
                    : ' text-neutral-300')
                }
              >
                {message.status === 'edited' && ' | '}
                {t('CONVERSATION.ORIGINAL')}
              </span>
            )}
          </div>
          <RichTextView
            keyword={keyword}
            editorStyle={cn('text-base md:text-sm', {
              translated: !isUseOriginal,
              right: position === 'right',
            })}
            mentions={
              message?.mentions?.map((mention) => ({
                id: mention._id,
                label: mention.name,
              })) || []
            }
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
                  position === 'right'
                    ? 'fill-primary-400'
                    : 'fill-[#e6e6e6] dark:fill-neutral-800',
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
                  editorStyle={cn(
                    'font-light translated text-base md:text-sm dark:text-neutral-50',
                    isEditing ? 'isEditing' : '',
                    {
                      right: position === 'right',
                    },
                  )}
                  mentions={
                    message?.mentions?.map((mention) => ({
                      id: mention._id,
                      label: mention.name,
                    })) || []
                  }
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

function highlightKeyword(htmlContent: string, keyword: string): string {
  // Escape special characters in the keyword for use in a regular expression
  const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Create a regular expression to find the keyword, case-insensitive
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');

  // Replace the keyword with a highlighted version
  const highlightedContent = htmlContent.replace(
    regex,
    '<span class="highlight">$1</span>',
  );
  return highlightedContent;
}
