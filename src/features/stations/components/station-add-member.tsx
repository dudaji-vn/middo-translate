import { Button } from '@/components/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import { User } from '@/features/users/types';
import { AtSignIcon, Link, SearchIcon, UserPlus2Icon } from 'lucide-react';
import {
  forwardRef,
  use,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useInviteMembers } from '../hooks/use-invite-members';
import { Station } from '../types/station.types';
import { AddByLink } from './station-add-by-link';
import { AddByUsername } from './station-add-by-username';

export interface StationAddMemberProps {
  station: Station;
}

export type AddType = 'search' | 'link';

export const tabs: Record<
  AddType,
  {
    label: string;
    value: AddType;
    icon?: React.ReactNode;
  }
> = {
  search: {
    label: 'COMMON.USERNAME',
    value: 'search',
    icon: <AtSignIcon className="size-5 md:size-4" />,
  },
  // email: {
  //   label: 'COMMON.EMAIL',
  //   value: 'email',
  //   icon: <MailIcon className="size-5 md:size-4" />,
  // },
  link: {
    label: 'COMMON.LINK',
    value: 'link',
    icon: <Link className="size-5 md:size-4" />,
  },
};

export const StationAddMember = ({ station }: StationAddMemberProps) => {
  const { t } = useTranslation('common');
  const ref = useRef<StationAddMemberRef>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSubmit = () => {
    ref.current?.submit();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button.Icon size="xs" variant="ghost">
          <UserPlus2Icon />
        </Button.Icon>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="w-full overflow-hidden">
          <AlertDialogTitle>{t('STATION.INVITE_MEMBERS')}</AlertDialogTitle>
          <StationAddMemberContent
            onAdd={setSelectedUsers}
            ref={ref}
            station={station}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-4">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={selectedUsers.length === 0}
            onClick={handleSubmit}
          >
            {t('COMMON.INVITE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface StationAddMemberContentProps {
  station: Station;
  onAdd: (users: User[]) => void;
}

export interface StationAddMemberRef {
  submit: () => void;
}

export const StationAddMemberContent = forwardRef<
  StationAddMemberRef,
  StationAddMemberContentProps
>(({ station, onAdd }, ref) => {
  const { t } = useTranslation('common');
  const [type, setType] = useState<'search' | 'link'>('search');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { mutate } = useInviteMembers();

  const handleSubmit = () => {
    mutate({
      stationId: station._id,
      users: selectedUsers,
    });
    setSelectedUsers([]);
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const TabContent = useMemo(() => {
    switch (type) {
      case 'link':
        return <AddByLink station={station} />;
      default:
        return (
          <AddByUsername
            station={station}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        );
    }
  }, [type, station, selectedUsers]);

  useEffect(() => {
    onAdd(selectedUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUsers]);

  return (
    <>
      <Tabs defaultValue="all" value={type} className="w-full">
        <TabsList>
          {Object.values(tabs).map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => {
                setType(tab.value);
              }}
              className="!rounded-none dark:!text-neutral-50"
            >
              {type === tab.value ? (
                <>{t(tab.label)}</>
              ) : (
                <div className="relative h-5 ">{tab?.icon}</div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="py-3">{TabContent}</div>
    </>
  );
});

StationAddMemberContent.displayName = 'StationAddMemberContent';
