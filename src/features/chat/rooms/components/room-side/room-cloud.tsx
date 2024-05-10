import { File, ImageIcon, LinkIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { roomApi } from '../../api';
import { Room } from '../../types';
import { RoomFiles } from './room-files';
import { RoomMedia } from './room-media';

export interface RoomCloudProps {
  room: Room;
}

type TabType = 'media' | 'file' | 'link';

const ComponentMap: Record<TabType, JSX.Element> = {
  media: <RoomMedia />,
  file: <RoomFiles />,
  link: <div>Coming soon</div>,
};
const tabs: {
  label: string;
  value: TabType;
  icon: JSX.Element;
}[] = [
  {
    label: 'CONVERSATION.MEDIA',
    value: 'media',
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    label: 'CONVERSATION.FILE',
    value: 'file',
    icon: <File className="h-4 w-4" />,
  },
  {
    label: 'CONVERSATION.LINK',
    value: 'link',
    icon: <LinkIcon className="h-4 w-4" />,
  },
];
export const RoomCloud = ({ room }: RoomCloudProps) => {
  const [currentTab, setCurrentTab] = useState<TabType>('media');
  const { data } = useQuery({
    queryKey: ['cloud-count'],
    queryFn: () => roomApi.getCloudCount(room._id),
  });
  const { t } = useTranslation('common');
  const counts = useMemo(() => {
    return {
      media: data?.mediaCount || 0,
      file: data?.fileCount || 0,
      link: data?.linkCount || 0,
    };
  }, [data]);
  return (
    <div className="mt-5 bg-white p-3">
      <Tabs defaultValue="all" value={currentTab} className="w-full">
        <TabsList className="overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setCurrentTab(tab.value)}
              className="!rounded-none"
            >
              <div className="mr-2">{tab.icon}</div>
              {t(tab.label)}
              &nbsp;
              <span className="text-sm text-neutral-600">
                ({counts[tab.value]})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-3">{ComponentMap[currentTab]}</div>
    </div>
  );
};
