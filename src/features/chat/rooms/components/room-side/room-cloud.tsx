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
  return (
    <Accordion type="single" collapsible className="mt-8">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Package2 width={16} height={16} /> <span>Cloud shared</span>{' '}
            <span className="text-sm text-colors-neutral-600">(+99)</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t">
          <div className="mt-3 flex w-full gap-2">
            <Button
              onClick={() => setCurrentTab('media')}
              startIcon={<ImageIcon className="h-4 w-4" />}
              size="sm"
              shape="square"
              variant={currentTab === 'media' ? 'default' : 'ghost'}
              color={currentTab === 'media' ? 'secondary' : 'default'}
            >
              Media
            </Button>
            <Button
              onClick={() => setCurrentTab('file')}
              startIcon={<File className="h-4 w-4" />}
              size="sm"
              shape="square"
              variant={currentTab === 'file' ? 'default' : 'ghost'}
              color={currentTab === 'file' ? 'secondary' : 'default'}
            >
              File
            </Button>
          </div>
          <div className="mt-3">{ComponentMap[currentTab]}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
