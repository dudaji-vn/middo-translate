import '../style.css';

import { CopyOutline, Share } from '@easy-eva-icons/react';

import { Button } from '@/components/actions';
import { CopyZoneClick } from '@/components/copy-zone-click';
import Link from 'next/link';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import QRCode from 'react-qr-code';
import { ROUTE_NAMES } from '@/configs/route-name';
import { ShareZone } from '@/components/share-zone';
import { getConversation } from '@/services/conversation';

interface SharingProps {
  params: {
    id: string;
  };
}

export default async function Sharing({ params }: SharingProps) {
  const link = `${NEXT_PUBLIC_URL}${ROUTE_NAMES.ONLINE_CONVERSATION_JOIN}/${params.id}`;
  const room = await getConversation(params.id);
  if (!room) {
    return <div>Room not found</div>;
  }
  return (
    <div className="myContainer">
      <div className="wrapper">
        <div className="oneColumnWrapper">
          <p>Conversation room code:</p>

          <div className="codeWrapper">
            <h1>{room.code}</h1>
            <CopyZoneClick text={room.code}>
              <Button.Icon color="default" variant="ghost">
                <CopyOutline />
              </Button.Icon>
            </CopyZoneClick>
          </div>
          <div className="qrWrapper">
            <QRCode
              size={168}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={link}
              viewBox={`0 0 168 168`}
            />
          </div>
          <div className="circleButtonWrapper">
            <ShareZone text={link}>
              <Button color="secondary">
                <Share />
              </Button>
            </ShareZone>
            Share through link
          </div>
          <div className="buttonContainer md:!flex-row">
            <Link
              href={`${ROUTE_NAMES.ONLINE_CONVERSATION}/${params.id}`}
              className="fillButton md:w-[320px]"
            >
              Enter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
