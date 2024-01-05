import { SendIcon } from 'lucide-react';

export interface PendingStatusProps {}

export const PendingStatus = (props: PendingStatusProps) => {
  return (
    <div className="flex items-center justify-end gap-1 text-end text-sm text-text">
      <SendIcon height={12} width={12} />
      Sending
    </div>
  );
};
