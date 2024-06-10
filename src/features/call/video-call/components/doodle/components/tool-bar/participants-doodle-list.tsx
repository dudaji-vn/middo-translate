import { useVideoCallStore } from '@/features/call/store/video-call.store';
import React from 'react';
import { useDoodleContext } from '../../context/doodle-context-context';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';
import trimLongName from '@/features/call/utils/trim-long-name.util';

export default function ParticipantDoodleList() {
  const {t} = useTranslation('common')
  
  const colorDoodle = useVideoCallStore(state => state.colorDoodle);
  const user = useAuthStore(state => state.user);
  
  const { imagesCanvas } = useDoodleContext();
  return (
    <ul className="max-h-[180px] max-w-[52px] overflow-x-hidden w-full flex-1 overflow-auto border-t border-neutral-50 dark:border-neutral-700 pb-4 pt-4">
      <ul className="flex w-full flex-col items-center justify-center gap-5 ">
        <li className="flex flex-col items-center justify-center gap-1">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: colorDoodle }}
          ></div>
          <span className="text-sm truncate">{t('CONVERSATION.YOU')}</span>
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
              <span className="truncate text-sm">{trimLongName(item.user.name, 4)}</span>
            </li>
          );
        })}
      </ul>
    </ul>
  );
}
