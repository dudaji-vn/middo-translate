'use client';

import { User } from '@/features/users/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edge } from 'reactflow';
import { FlowNode } from '../../../settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { Button } from '@/components/actions';
import { Eye, Pen, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/data-display';
import moment from 'moment';

export type ChatScript = {
  _id: string;
  name: string;
  lastEditedBy: Partial<User>;
  createdBy: Partial<User>;
  createdAt: string;
  updatedAt: string;
  chatFlow: {
    nodes: FlowNode[];
    edges: Edge[];
  };
};

export const scriptsColumns = ({
  onView,
  onDelete,
  onEdit,
}: {
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) =>
  [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell(props) {
        return (
          <div className="flex gap-2" {...props}>
            <Avatar
              src={props.row?.original?.createdBy?.avatar || '/avatar.svg'}
              alt={String(props.row?.original?.createdBy?.name)}
              className="h-6 w-6 rounded-full"
            />
            <span>{props?.row?.original?.createdBy?.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created On',
      cell(props) {
        const displayTime = moment(props?.row?.original?.createdAt).format(
          'DD/MM/YYYY HH:mm A',
        );
        return (
          <div className="flex gap-2" {...props}>
            <span>{displayTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'lastEditedBy',
      header: 'Last Edited',
      cell(props) {
        const displayTime = moment(props?.row?.original?.updatedAt).format(
          'DD/MM/YYYY HH:mm A',
        );
        return (
          <div className="flex gap-2" {...props}>
            <Avatar
              src={props.row?.original?.lastEditedBy?.avatar || '/avatar.svg'}
              alt={String(props.row?.original?.lastEditedBy?.name)}
              className="h-6 w-6 rounded-full"
            />
            <span>{displayTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: '_id',
      header: 'Actions',
      cell(props) {
        return (
          <div className="flex gap-2" {...props}>
            <Button.Icon
              variant={'ghost'}
              size={'xs'}
              color={'default'}
              onClick={() => onView(props.row.original._id)}
            >
              <Eye />
            </Button.Icon>
            <Button.Icon
              variant={'ghost'}
              size={'xs'}
              color={'default'}
              onClick={() => onEdit(props.row.original._id)}
            >
              <Pen />
            </Button.Icon>
            <Button.Icon
              variant={'ghost'}
              size={'xs'}
              color={'default'}
              onClick={() => onDelete(props.row.original._id)}
            >
              <Trash2 className="text-error" />
            </Button.Icon>
          </div>
        );
      },
    },
  ] as ColumnDef<ChatScript>[];
