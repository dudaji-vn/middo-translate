'use client';

import { Button, IconButton } from '@/components/button';
import { forwardRef, useState } from 'react';

import { LoadingBase } from '@/components/loading-base';
import { QRCodeIcon } from '@/components/icons';
import { QrScanner } from '@/components/scanner';
import { ROUTE_NAMES } from '@/configs/route-name';
import { getConversation } from '@/services/conversation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast';

export interface RoomCodeInputProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomCodeInput = forwardRef<HTMLDivElement, RoomCodeInputProps>(
  (props, ref) => {
    const [code, setCode] = useState<string>('');
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const [showScanner, setShowScanner] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();
    const handleJoin = async () => {
      setIsJoining(true);
      const room = await getConversation(code);
      if (room) {
        router.push(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + code);
      } else {
        toast({
          description: 'Room not found!',
        });
      }
    };
    const onNewScanResult = (decodedText: string) => {
      const isValidCodeUrl = decodedText.includes(
        ROUTE_NAMES.ONLINE_CONVERSATION_JOIN,
      );
      if (isValidCodeUrl) {
        router.push(decodedText);
      } else {
        toast({
          description: 'Invalid code!',
        });
      }
    };
    return (
      <div ref={ref} {...props} className="joinSection">
        <div className="enterCode">
          <input
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            type="text"
            placeholder="Enter room code"
          />

          <IconButton
            onClick={() => setShowScanner(true)}
            iconSizeUnset
            variant="ghost"
            className="iconNoBGButton"
          >
            <QRCodeIcon className="opacity-60" />
          </IconButton>
        </div>
        <Button
          disabled={code.length === 0}
          onClick={handleJoin}
          className="fillButton"
        >
          Join
        </Button>
        {isJoining && <LoadingBase loadingText="Joining room..." />}
        {showScanner && (
          <QrScanner
            onCancel={() => setShowScanner(false)}
            onDecode={onNewScanResult}
          />
        )}
      </div>
    );
  },
);
RoomCodeInput.displayName = 'RoomCodeInput';
