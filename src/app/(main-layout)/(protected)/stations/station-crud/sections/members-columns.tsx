'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { TFunction } from 'i18next';
export enum EStationRoles {
  Owner = 'owner',
  Member = 'member',
}
export type Member = {
  _id?: string;
  usernameOrEmail: string;
  role: string;
  status?: 'joined' | 'invited' | 'deleted';
  teamName?: string;
};

export const makeMembersColumns = ({
  onDelete,
  t,
}: {
  onDelete: (member: Member) => void;
  t: TFunction;
}) =>
  [
    {
      accessorKey: 'usernameOrEmail',
      header: t('STATION.MEMBER.EMAIL_OR_USERNAME'),
      cell(props) {
        return (
          <Typography className="text-gray-500 dark:text-neutral-50">
            {props.getValue() as string}
            <span className="font-light">
              {(props.row.original.role === EStationRoles.Owner &&
                ` (${t('STATION.MEMBER.YOU')})`) ||
                ''}
            </span>
          </Typography>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      cell(props) {
        return (
          <div className="flex gap-2">
            <Button.Icon
              size={'xs'}
              color={'default'}
              className={cn({
                invisible: props.row.original.role === EStationRoles.Owner,
              })}
              onClick={() => onDelete(props.row.original as Member)}
            >
              <Trash2 className="text-error" />
            </Button.Icon>
          </div>
        );
      },
    },
  ] as ColumnDef<Member>[];
