import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { File, ImageIcon, Package2 } from 'lucide-react';

import { Button } from '@/components/actions';
import { Room } from '../../types';
import { RoomFiles } from './room-files';
import { RoomMedia } from './room-media';
import { roomApi } from '../../api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export interface RoomCloudProps {
  room: Room;
}

const ComponentMap: Record<'media' | 'file', JSX.Element> = {
  media: <RoomMedia />,
  file: <RoomFiles />,
};

export const RoomCloud = ({ room }: RoomCloudProps) => {
  const [currentTab, setCurrentTab] = useState<'media' | 'file'>('media');
  const { data } = useQuery({
    queryKey: ['cloud-count'],
    queryFn: () => roomApi.getCloudCount(room._id),
  });

  return (
    <Accordion type="single" collapsible className="mt-8">
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-3">
          <div className="flex items-center gap-2">
            <Package2 width={16} height={16} /> <span>Cloud shared</span>
            <span className="text-sm text-neutral-600">
              ({data?.count || 0})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t">
          <div className="mt-3 flex w-full gap-2">
            <Button
              onClick={() => setCurrentTab('media')}
              startIcon={<ImageIcon className="h-4 w-4" />}
              size="xs"
              shape="square"
              variant={currentTab === 'media' ? 'default' : 'ghost'}
              color={currentTab === 'media' ? 'secondary' : 'default'}
            >
              Media ({data?.mediaCount || 0})
            </Button>
            <Button
              onClick={() => setCurrentTab('file')}
              startIcon={<File className="h-4 w-4" />}
              size="xs"
              shape="square"
              variant={currentTab === 'file' ? 'default' : 'ghost'}
              color={currentTab === 'file' ? 'secondary' : 'default'}
            >
              File ({data?.fileCount || 0})
            </Button>
          </div>
          <div className="mt-3">{ComponentMap[currentTab]}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
