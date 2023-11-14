import './style.css';

import { Close } from '@easy-eva-icons/react';
import { IconButton } from '../button';
import QrReader from 'react-qr-reader';

interface QrScannerProps {
  onDecode: (data: string) => void;
  onCancel?: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onDecode, onCancel }) => {
  return (
    <div className="scanner fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-background pb-10">
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
      <IconButton onClick={onCancel} variant="secondary">
        <Close />
      </IconButton>
    </div>
  );
};
