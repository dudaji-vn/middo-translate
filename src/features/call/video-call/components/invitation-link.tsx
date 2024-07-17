import { Button, CopyZoneClick } from "@/components/actions";
import { CopyIcon, EyeIcon, EyeOffIcon, Link2Icon } from "lucide-react";
import { useVideoCallStore } from "../../store/video-call.store";
import { NEXT_PUBLIC_URL } from "@/configs/env.public";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function InvitationLink() {
    const [isShow, setIsShow] = useState<boolean>(true)
    const { t } = useTranslation('common')
    const room = useVideoCallStore(state => state.room)
    return <div className="p-3 rounded-xl bg-primary-100 dark:bg-neutral-900 flex flex-col gap-3">
        <div className="flex gap-2 items-center">
            <Link2Icon size={16} />
            <p className="text-neutral-800 font-semibold dark:text-neutral-50">{t('CONVERSATION.INVITATION_LINK')}</p>
        </div>
        {isShow && <>
            <p className="text-sm text-neutral-600 dark:text-neutral-200">{t('CONVERSATION.COPY_INVITATION_LINK')}</p>
            <CopyZoneClick
                text={`${NEXT_PUBLIC_URL}/call/${room?._id}`}
                className="bg-white rounded-xl border border-neutral-100 p-3 dark:border-neutral-700 dark:bg-background flex justify-center items-center cursor-pointer"
            >
                <span className="flex-1 text-primary font-semibold truncate">{`${NEXT_PUBLIC_URL}/call/${room?._id}`}</span>
                <Button.Icon
                    size={"xs"}
                    shape={'default'}
                    color={'default'}
                    variant={'ghost'}
                    >
                        <CopyIcon />
                    </Button.Icon>
            </CopyZoneClick>
        </>}


        <Button
            shape={'square'}
            size={'sm'}
            startIcon={isShow ? <EyeOffIcon /> : <EyeIcon />}
            color={"secondary"}
            className="w-full"
            onClick={() => setIsShow(!isShow)}
        >
            {isShow ? t('CONVERSATION.HIDE') : t('CONVERSATION.SHOW')}
        </Button>

    </div>
}