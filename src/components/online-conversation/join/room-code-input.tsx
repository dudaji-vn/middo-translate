'use client';

import { QrScanner, ScannerStatus } from '@/components/actions/scanner';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/actions';
import { LoadingBase } from '@/components/feedback';
import { QRCodeIcon } from '@/components/icons';
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
    const [isScanned, setIsScanned] = useState<boolean>(false);
    const [scannerStatus, setScannerStatus] =
      useState<ScannerStatus>('scanning');
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
        setIsJoining(false);
      }
    };
    const onNewScanResult = (decodedText: string) => {
      if (isScanned) return;
      const isValidCodeUrl = decodedText.includes(
        ROUTE_NAMES.ONLINE_CONVERSATION_JOIN,
      );
      if (isValidCodeUrl) {
        setIsScanned(true);
        setScannerStatus('success');
        toast({
          description: 'Scanned!',
        });

        router.push(decodedText);
      } else {
        setScannerStatus('error');
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

          <Button.Icon
            onClick={() => setShowScanner(true)}
            variant="ghost"
            className="iconNoBGButton"
          >
            <QRCodeIcon />
          </Button.Icon>
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
            status={scannerStatus}
            onCancel={() => setShowScanner(false)}
            onDecode={onNewScanResult}
          />
        )}
      </div>
    );
  },
);
RoomCodeInput.displayName = 'RoomCodeInput';
