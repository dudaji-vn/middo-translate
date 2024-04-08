import {
    textMiddleVariants,
    textVariants,
    wrapperMiddleVariants,
    wrapperVariants,
} from '@/features/chat/messages/components/message-item/message-item-text.style';
import { useEffect, useMemo, useState } from 'react';

import { TriangleSmall } from '@/components/icons/triangle-small';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/features/chat/store';
import { RichTextView } from '@/components/rich-text-view';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useTranslation } from 'react-i18next';
import { Message } from '@/features/chat/messages/types';
import { messageVariants } from '@/features/chat/messages/components/message-item/variants';

export interface ContentProps extends VariantProps<typeof wrapperVariants> {
    message: Message;
    setLinks?: (links: string[]) => void;
}

export const FakeMessage = ({ position = 'right', active = false, message }: ContentProps) => {
    const showMiddleTranslation = true;
    const { t } = useTranslation('common');
    const { userLanguage, currentUserId } = useAuthStore((state) => ({
        userLanguage: state.user?.language,
        currentUserId: state.user?._id,
    }));

    const receiverLanguage = userLanguage;

    const [contentDisplay, setContentDisplay] = useState(message.content);
    useEffect(() => {
        if (message.status === 'removed') {
            setContentDisplay(t('CONVERSATION.UNSEND_A_MESSAGE'));
            return;
        }

        setContentDisplay(message.content);
        return;
    }, [
        receiverLanguage,
        message.content,
        message.sender.language,
        message.contentEnglish,
        message.status,
        message.language,
        message.sender._id,
        currentUserId,
        t,
    ]);
    const isMe = message.sender._id === currentUserId;
    return (
        <div
            className={cn(
                messageVariants({
                    sender: 'me'
                }), 'my-1'
            )}
        >
            <div
                className={cn(
                    wrapperVariants({ active, position, status: message.status }),
                )}
            >
                <div className={cn(textVariants({ position, status: message.status }))}>
                    <RichTextView
                        editorStyle="text-base md:text-sm"
                        mentions={[]}
                        mentionClassName={position === 'right' ? 'right' : 'left'}
                        content={contentDisplay}
                    />
                </div>
                {message?.contentEnglish &&
                    message.status !== 'removed' &&
                    showMiddleTranslation &&
                    !(message.language === DEFAULT_LANGUAGES_CODE.EN && isMe) && (
                        <div className="relative mt-2">
                            <TriangleSmall
                                position="top"
                                className={cn(
                                    'absolute left-4 top-0 -translate-y-full fill-primary-400',
                                )}
                                pathProps={{
                                    className:
                                        position === 'right' ? 'fill-primary-400' : 'fill-[#e6e6e6]',
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
                                        editorStyle="font-light text-base md:text-sm"
                                        content={message.contentEnglish}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};
