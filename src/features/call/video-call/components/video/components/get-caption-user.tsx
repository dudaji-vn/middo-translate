import { CUSTOM_EVENTS } from "@/configs/custom-event";
import { SUPPORTED_VOICE_MAP } from "@/configs/default-language";
import useSpeechToTextCaption from "@/features/call/hooks/use-speech-to-text-caption";
import CaptionInterface from "@/features/call/interfaces/caption.interface";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import { sendEvent } from "@/features/call/utils/custom-event.util";
import { translateText } from "@/services/languages.service";
import { useAuthStore } from "@/stores/auth.store";
import { memo, useEffect } from "react";

interface GetCaptionUserProps {
    name: string;
    avatar: string;
    language: string;
    stream?: MediaStream;
}

const GetCaptionUserMain = ({ name, avatar, language, stream }: GetCaptionUserProps) => {
    const myLanguage = useAuthStore(state => state.user?.language);
    const { transcript } = useSpeechToTextCaption(SUPPORTED_VOICE_MAP[(language || 'auto') as keyof typeof SUPPORTED_VOICE_MAP], stream);
    useEffect(() => {
        if (!transcript) return;
        const translateCaption = async () => {
            let contentEn = transcript;
            if (language !== 'en') {
                contentEn = await translateText(transcript, language, 'en');
            }
            let contentMyLanguage = transcript;
            if (myLanguage !== language) {
                contentMyLanguage = await translateText(transcript, language, myLanguage);
            }
            const captionObj: CaptionInterface = {
                user: { name, avatar },
                content: contentMyLanguage,
                contentEn: contentEn,
                language: language,
            };
            sendEvent(CUSTOM_EVENTS.CAPTION.SEND_CAPTION, captionObj);
        };

        translateCaption();
    });
    
  return null;
}


const GetCaptionUser = ({ name, avatar, language, stream }: GetCaptionUserProps) => {
    const isFullScreen = useVideoCallStore(state => state.isFullScreen);
    const isShowCaption = useVideoCallStore(state => state.isShowCaption);
    if (!isFullScreen || !isShowCaption) return null;
    return <GetCaptionUserMain name={name} avatar={avatar} language={language} stream={stream} />;
}

export default memo(GetCaptionUser);

