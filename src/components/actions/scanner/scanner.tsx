'use client';

import './style.css';

import { Button } from '@/components/actions';
import QrReader from 'react-qr-reader';
import { XIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDisableScrollWhenMount } from '@/hooks/use-disable-scroll-when-mount';

export type ScannerStatus = 'scanning' | 'success' | 'error';
interface QrScannerProps {
  onDecode: (data: string) => void;
  onCancel?: () => void;
  status?: ScannerStatus;
}

export const QrScanner: React.FC<QrScannerProps> = ({
  onDecode,
  onCancel,
  status,
}) => {
  useDisableScrollWhenMount();
  return (
    <div
      className={cn(
        'scanner fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-background pb-10',
        status === 'success' && 'success',
        status === 'error' && 'error',
      )}
    >
      <QrReader
        facingMode={'environment'}
        delay={500}
        onError={(err) => console.log(err)}
        onScan={(data) => {
          if (data) {
            onDecode(data);
          }
        }}
        className="flex h-full w-full flex-1 !items-center !justify-center"
      />
      <Button.Icon onClick={onCancel} color="secondary">
        <XIcon />
      </Button.Icon>
    </div>
  );
};
