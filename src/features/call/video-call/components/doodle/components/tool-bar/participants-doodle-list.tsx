import { useVideoCallStore } from '@/features/call/store/video-call.store';
import React from 'react';
import { useDoodleContext } from '../../context/doodle-context-context';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';

export default function ParticipantDoodleList() {
  const { colorDoodle } = useVideoCallStore();
  const { imagesCanvas } = useDoodleContext();
  const { user } = useAuthStore();
  const {t} = useTranslation('common')
  return (
    <ul className="max-h-[180px] w-full flex-1 overflow-auto border-t border-neutral-50 pb-4 pt-4">
      <ul className="flex w-full flex-col items-center justify-center gap-5 ">
        <li className="flex flex-col items-center justify-center gap-1">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: colorDoodle }}
          ></div>
          <span className="text-sm">{t('CONVERSATION.YOU')}</span>
        </li>
        {Object.values(imagesCanvas).map((item, index) => {
          if (item.user._id === user?._id) return;
          return (
            <li
              key={index}
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="truncate text-sm">{item.user.name}</span>
            </li>
          );
        })}
      </ul>
    </ul>
  );
}
