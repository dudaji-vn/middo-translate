import React from 'react';
import { Typography } from '@/components/data-display';
import { RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/actions';
import { Member } from '../../../_components/spaces-crud/sections/members-columns';
import {
  ESPaceRoles,
  MANAGE_SPACE_ROLES,
  SPACE_SETTING_TAB_ROLES,
} from '../space-setting/setting-items';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export type MemberItemProps = {
  isOwnerRow: boolean;
  isLoading?: boolean;
  onDelete: (member: Member) => void;
  onResendInvitation: (member: Member) => void;
  myRole?: ESPaceRoles;
  isMe?: boolean;
} & Member &
  React.HTMLAttributes<HTMLDivElement>;
const MemberItem = ({
  role,
  isMe,
  isOwnerRow,
  email,
  myRole,
  status,
  isLoading,
  onResendInvitation,
  onDelete,
  ...props
}: MemberItemProps) => {
  const roles = SPACE_SETTING_TAB_ROLES.find(
    (setting) => setting.name === 'members',
  )?.roles;
  const { t } = useTranslation('common');
  const deleteAble =
    !isLoading && roles?.delete.includes(myRole as ESPaceRoles) && !isOwnerRow;

  const canNotResend =
    isOwnerRow ||
    status === 'joined' ||
    !MANAGE_SPACE_ROLES['invite-member'].includes(myRole as ESPaceRoles) ||
    (myRole === ESPaceRoles.Admin && role !== ESPaceRoles.Member);

  return (
    <div
      className="flex w-full flex-row items-center justify-between rounded-[12px] bg-primary-100 py-1 dark:bg-neutral-900"
      {...props}
    >
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-auto w-[260px] flex-row items-center justify-start gap-3 break-words rounded-l-[12px] px-3 sm:w-[400px] md:w-[500px] xl:w-[800px]">
          <Typography className="text-neutral-800 dark:text-neutral-50">
            {email}
          </Typography>
          {isOwnerRow && <Badge className="bg-primary text-white">Owner</Badge>}
          {isMe && (
            <span className="font-light text-neutral-500">{`(${t('EXTENSION.MEMBER.YOU')})`}</span>
          )}
        </div>
        <div className="flex w-fit flex-row items-center  justify-start  gap-6 py-1">
          <Typography
            className={cn(
              'w-[100px] capitalize text-gray-500',
              status === 'joined' && 'text-primary-500-main',
              status === 'invited' && 'text-success-700',
            )}
          >
            {status}
          </Typography>
          <Button
            className={cn('text-neutral-500', {
              invisible: canNotResend,
            })}
            startIcon={<RotateCcw className="text-neutral-500" />}
            size={'xs'}
            shape={'square'}
            color={'default'}
            loading={isLoading}
            onClick={() =>
              onResendInvitation({
                email,
                role,
                status,
              })
            }
          >
            Resend
          </Button>
        </div>
      </div>
      <div className="min-w-10 px-4">
        <Button.Icon
          size={'xs'}
          className={deleteAble ? '' : 'invisible'}
          disabled={!deleteAble}
          color={'default'}
          onClick={() =>
            onDelete({
              email,
              role,
              status,
            })
          }
        >
          <Trash2 className="text-error" />
        </Button.Icon>
      </div>
    </div>
  );
};

export default MemberItem;
