'use client';

import { Member } from '@/app/(main-layout)/(protected)/stations/station-crud/sections';
import { Typography } from '@/components/data-display';
import { PenIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/actions';

export const StationInvitationList = ({
  invitations,
  onEdit,
  onRemove,
}: {
  invitations: Member[];
  onRemove?: (invitation: Member) => void;
  onEdit?: (invitation: Member) => void;
}) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-2 overflow-hidden">
      <div className="flex text-neutral-400">
        <div className="basis-[62.5%] ">Email / Username</div>
        <div className="basis-[25%]">Team</div>
        <div className="flex basis-[12.5%] justify-center">Action</div>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2">
        {invitations.map((invitation) => (
          <div
            key={invitation.usernameOrEmail}
            className="flex rounded-xl bg-primary-100 py-2"
          >
            <div className="flex basis-[62.5%] items-center pl-4">
              <Typography>{invitation.usernameOrEmail}</Typography>
            </div>
            <div className="flex basis-[25%] items-center">
              <Typography className="font-medium">
                {invitation.teamName}
              </Typography>
            </div>
            <div className="flex basis-[12.5%] items-center justify-center gap-1">
              <Button.Icon
                disabled={invitation.role === 'owner'}
                onClick={() => onEdit && onEdit(invitation)}
                color="default"
                variant="ghost"
                size="xs"
              >
                <PenIcon />
              </Button.Icon>
              <Button.Icon
                disabled={invitation.role === 'owner'}
                onClick={() => onRemove && onRemove(invitation)}
                color="error"
                variant="ghost"
                size="xs"
              >
                <Trash2Icon />
              </Button.Icon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
