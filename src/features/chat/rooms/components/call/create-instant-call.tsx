'use client';

import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import customToast from '@/utils/custom-toast';
import {  LinkIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJoinCall } from '../../hooks/use-join-call';

const CreateInstantCall = ({

}) => {
    const {t} = useTranslation('common')
    const call = useVideoCallStore(state => state.call);
    const [isLoading, setLoading] = useState<boolean>(false);
    const startVideoCall = useJoinCall(true);
    const setFullScreen = useVideoCallStore(state => state.setFullScreen);
    const createInstantCall = async () => {
        if(call) {
            customToast.error(t('MESSAGE.ERROR.STOP_CALL_BEFORE_CREATE_INSTANT'))
            return;
        }

        try {
            setLoading(true);
            startVideoCall({});
            setFullScreen(true)
        } catch (error) {
            customToast.error(t('MESSAGE.ERROR.CAN_NOT_CREATE_INSTANT_CALL'))
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            shape={'square'}
            color={'primary'}
            variant={'default'}
            className='w-full'
            loading={isLoading}
            startIcon={<LinkIcon size={20} />}
            onClick={() => createInstantCall()}

          >
            {t('CONVERSATION.CREATE_INSTANT_CALL')}
          </Button>
    );
};

export default CreateInstantCall;
