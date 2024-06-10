import { useChatBox } from '../../../contexts';
import { RoomCloud } from '../room-cloud';
import { ImagePlay } from 'lucide-react';
import { useRoomSidebarTabs } from '../room-side-tabs/room-side-tabs.hook';
import useClient from '@/hooks/use-client';
import { RoomSideTabLayout } from '../room-side-tabs/room-side-tab-layout';
import { useTranslation } from 'react-i18next';
export interface RoomSideTabFilesProps {}

export const RoomSideTabFiles = ({}: RoomSideTabFilesProps) => {
  const { toggleTab } = useRoomSidebarTabs();
  const {t} = useTranslation('common');
  const isClient = useClient();
  const { room } = useChatBox();
  if (!isClient) return null;

  return (
    <RoomSideTabLayout
        title={t('CONVERSATION.FILE_MEDIA_AND_LINK')}
        icon={<ImagePlay />}
        onBack={()=>toggleTab("info")}
        type="back"
      >
      <div className="flex w-full flex-col divide-y divide-neutral-100 dark:divide-neutral-900  overflow-x-hidden  overflow-y-scroll pb-3 h-full">
        <RoomCloud room={room} />
      </div>
    </RoomSideTabLayout>
  );
};
