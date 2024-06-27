import { Button } from '@/components/actions';
import { Switch } from '@/components/data-entry';
import { useTextCopy } from '@/hooks';
import { CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useActiveLinkInvitation } from '../hooks/use-active-link-invitation';
import { useCancelLinkInvitation } from '../hooks/use-cancel-link-invitation';
import { useGetInvitationLink } from '../hooks/use-get-invitation-link';
import { Station } from '../types/station.types';

export const AddByLink = ({ station }: { station: Station }) => {
  const { cancel } = useCancelLinkInvitation({ stationId: station._id });
  const { active } = useActiveLinkInvitation({ stationId: station._id });
  const { data, refetch } = useGetInvitationLink({ stationId: station._id });
  const isActive = data?.link ? true : false;
  const { copy } = useTextCopy();
  const handleSwitch = () => {
    if (isActive) {
      cancel();
    } else {
      active();
    }
  };
  const link = data?.link;
  console.log(data);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <span className="font-semibold">Invitation link</span>
        <Switch
          checked={isActive}
          onCheckedChange={handleSwitch}
          className="ml-3"
        />
      </div>
      {isActive && (
        <div className="mt-2 w-full space-y-2">
          <span className="text-sm font-light">
            Copy & send the link below for others to join this Station
          </span>
          <div className="flex items-center gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-1 pl-3">
            <span className="line-clamp-1 flex-1 overflow-hidden font-semibold text-primary">
              {link}
            </span>
            <Button.Icon
              onClick={() => copy(link)}
              variant="ghost"
              color="default"
              size="xs"
            >
              <CopyIcon />
            </Button.Icon>
          </div>
          <div className="flex justify-end">
            <LinkExpireIn
              expireAt={data?.createdAt || new Date().toISOString()}
              onExpire={refetch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// this is the component that will be countdown the time left for the link to expire by createAt and in a day, format hh:mm:ss
const TIME_IN_DAY = 24 * 60 * 60 * 1000;
const LinkExpireIn = ({
  expireAt,
  onExpire,
}: {
  expireAt: string;
  onExpire: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(expireAt).getTime() + TIME_IN_DAY - Date.now();
      if (diff < 0) {
        setTimeLeft(0);
        onExpire();
        return;
      }
      setTimeLeft(diff);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [expireAt]);

  return (
    <div className="text-sm font-light text-neutral-600">
      Link expire in{' '}
      <span className="font-semibold ">
        {new Date(timeLeft).toISOString().substr(11, 8).replace(/00:/, '')}
      </span>
    </div>
  );
};
