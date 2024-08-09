import { Avatar, Typography } from '@/components/data-display';
import { DataTableProps } from '@/components/ui/data-table';
import { StationInvitationTabs } from '@/features/stations';
import { StationInvitationList } from '@/features/stations/components/station-invitation-list';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultTeams } from './create-teams-section';
import { EStationRoles, Member } from './members-columns';

export enum EStationMemberStatus {
  Invited = 'invited',
  Joined = 'joined',
}

export type InviteMembersProps = {
  station: {
    name?: string;
    avatar?: string;
    members: Member[];
    teams: { name: string }[];
  };
  setMembers?: (members: Member[]) => void;
  onAddMember?: (member: Member) => void;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  stationPreviewProps?: React.HTMLAttributes<HTMLDivElement>;
  header?: React.ReactNode;
  tableProps?: DataTableProps<Member, any>;
  headerTitleProps?: React.HTMLAttributes<HTMLDivElement>;
  headerDescriptionProps?: React.HTMLAttributes<HTMLDivElement>;
  blackList?: string[];
  hideOwner?: boolean;
  onMembersChange?: (members: Member[]) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const InviteMembers = ({
  station,
  blackList,
  onMembersChange,
  stationPreviewProps,
  tableProps,
  header,
  headerProps,
  headerTitleProps,
  hideOwner = false,
  headerDescriptionProps,
  onAddMember,
  ...props
}: InviteMembersProps) => {
  const [members, setMembers] = React.useState<Member[]>(station.members);

  const handleAddMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const handleRemoveMember = (member: Member) => {
    setMembers(
      members.filter((m) => m.usernameOrEmail !== member.usernameOrEmail),
    );
  };

  useEffect(() => {
    onMembersChange && onMembersChange(members);
  }, [members]);

  return (
    <section
      {...props}
      className={cn(
        'flex h-auto  min-h-80 w-full flex-col items-center justify-center gap-8 max-md:px-4 md:max-w-4xl',
        props.className,
      )}
    >
      <Header />
      <StationInvitationTabs
        onAddMember={handleAddMember}
        teams={station?.teams}
        addedMembers={members}
      />
      <div className="flex w-full flex-1 flex-col space-y-5 overflow-hidden">
        <div
          className="flex w-full flex-row items-center gap-3 rounded-[12px] bg-primary-100 p-3 dark:bg-background"
          {...stationPreviewProps}
        >
          <Avatar
            variant={'outline'}
            src={station?.avatar || '/avatar.svg'}
            alt="avatar"
            className="size-[88px] cursor-pointer p-0"
          />
          <div className="flex w-full flex-col gap-1">
            <Typography className="text-[18px] font-semibold text-neutral-800 dark:text-neutral-50">
              {station?.name}
            </Typography>
            <Typography className="font-normal text-neutral-600 dark:text-neutral-50">
              {station?.members?.length} members
            </Typography>
          </div>
        </div>
        <StationInvitationList
          invitations={members}
          onRemove={handleRemoveMember}
        />
      </div>
    </section>
  );
};

export default InviteMembers;

const Header = ({
  header,
  headerProps,
  headerTitleProps,
  headerDescriptionProps,
}: {
  header?: React.ReactNode;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  headerTitleProps?: React.HTMLAttributes<HTMLDivElement>;
  headerDescriptionProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const { t } = useTranslation('common');
  return (
    <>
      {header ? (
        <React.Fragment>{header}</React.Fragment>
      ) : (
        <div className="flex w-full flex-col  gap-3" {...headerProps}>
          <Typography
            className="text-[32px] font-semibold leading-9 text-neutral-800 dark:text-neutral-50"
            {...headerTitleProps}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t('MODAL.CREATE_STATION.INVITE_MEMBERS.TITLE'),
              }}
            ></span>
          </Typography>
          <Typography
            className="flex gap-2 font-light text-neutral-600 dark:text-neutral-100"
            {...headerDescriptionProps}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t('MODAL.CREATE_STATION.INVITE_MEMBERS.DESCRIPTION'),
              }}
            />
          </Typography>
        </div>
      )}
    </>
  );
};
