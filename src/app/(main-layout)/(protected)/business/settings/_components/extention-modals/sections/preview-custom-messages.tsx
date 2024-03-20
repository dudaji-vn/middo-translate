import { Avatar, Text, Typography } from "@/components/data-display";
import { Spinner } from "@/components/feedback";
import { TriangleSmall } from "@/components/icons/triangle-small";
import { DEFAULT_LANGUAGES_CODE } from "@/configs/default-language";
import { TimeDisplay } from "@/features/chat/messages/components/time-display";
import { User } from "@/features/users/types";
import { translateWithDetection } from "@/services/languages.service";
import { cn } from "@/utils/cn";
import React, { useEffect, useMemo } from "react";
import { useDebounce } from "usehooks-ts";

const DEBOUNCED_TRANSLATE_TIME = 800;

export const PreviewCustomMessages = ({ sender, content = '', englishContent, ...props }: {
    sender?: User | null,
    content?: string,
    englishContent?: string
} & React.HTMLAttributes<HTMLDivElement>) => {

    const [translatedContent, setTranslatedContent] = React.useState<string>(englishContent || '')
    const [isTranslating, setIsTranslating] = React.useState<boolean>(false)
    const debouncedContent = useDebounce(content, DEBOUNCED_TRANSLATE_TIME);
    const isTyping = useMemo(() => debouncedContent !== content, [debouncedContent, content]);

    useEffect(() => {
        if (englishContent?.length) {
            setTranslatedContent(englishContent);
            return;
        }
        setIsTranslating(true);
        translateWithDetection(debouncedContent, DEFAULT_LANGUAGES_CODE.EN).then((res) => {
            setTranslatedContent(typeof res === 'string' ? res : res.translatedText)
        }).finally(() => {
            setIsTranslating(false);
        })
    }, [debouncedContent])

    return <div {...props}>
        <TimeDisplay time={new Date().toLocaleDateString()} />
        <div className="w-full gap-1  pb-8 relative  flex pr-11 md:pr-20">
            <div className="overflow-hidden relative aspect-square size-6 rounded-full mb-auto mr-1 mt-0.5 shrink-0">
                <Avatar src={String(sender?.avatar)} alt={String(sender?.name)} size="xs" />
            </div>
            <div className="relative space-y-2">
                <Typography className='p-1 text-sm leading-[18px] font-light text-neutral-600'>{sender?.name}</Typography>
                <div className="w-fit min-w-10 bg-neutral-50 px-2 py-1 relative overflow-hidden rounded-[20px]">
                    <div className="px-3 py-2 bg-neutral-50 break-word-mt text-start tiptap prose editor-view prose-strong:text-current max-w-none w-full focus:outline-none text-current text-sm">
                        {content}
                    </div>
                    <div className={"relative mt-2 min-w-10"}>
                        <TriangleSmall
                            fill={'#e6e6e6'}
                            position="top"
                            className="absolute left-4 top-0 -translate-y-full"
                        />
                        <div className={cn("mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600 relative")}>
                            <Text
                                value={englishContent || translatedContent}
                                className={cn("text-start text-sm font-light", isTyping && ' pr-4')}
                            />
                            <Spinner size='sm' className={isTranslating || isTyping ? 'absolute top-1 right-1 ' : 'hidden'} color='white' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div >
}