'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { ESPaceRoles } from '../../../settings/_components/space-setting/setting-items';
import { TFunction } from 'i18next';

export type Member = {
  _id?: string;
  email: string;
  role: string;
  status?: 'joined' | 'invited' | 'deleted';
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
      accessorKey: 'email',
      header: t('EXTENSION.MEMBER.EMAIL'),
      cell(props) {
        return (
          <Typography className="text-gray-500">
            {props.getValue() as string}
            <span className="font-light">
              {props.row.original.role === ESPaceRoles.Owner && ' (you)'}
            </span>
          </Typography>
        );
      },
    },
    {
      accessorKey: 'role',
      header: t('EXTENSION.MEMBER.ROLE'),
      cell(props) {
        return (
          <Typography
            className={cn(
              'capitalize text-gray-500',
              props.getValue() === ESPaceRoles.Admin && 'text-primary-500-main',
            )}
          >
            {props.getValue() as string}
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
                invisible: props.row.original.role === ESPaceRoles.Owner,
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
