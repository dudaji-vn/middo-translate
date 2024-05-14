'use client';

import { User } from '@/features/users/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edge } from 'reactflow';
import { FlowNode } from '../../../settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Button } from '@/components/actions';
import { Pen, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/data-display';

export type ChatScript = {
  _id: string;
  name: string;
  lastEditedBy: Partial<User>;
  createdAt: string;
  updatedAt: string;
  chatFlow: {
    nodes: FlowNode[];
    edges: Edge[];
  };
};

export const scriptsColumns: ColumnDef<ChatScript>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'lastEditedBy',
    header: 'Last Edited By',
    cell(props) {
      return (
        <div className="flex gap-2" {...props}>
          <Avatar
            src={props.row?.original?.lastEditedBy?.avatar || '/avatar.svg'}
            alt={String(props.row?.original?.lastEditedBy?.name)}
            className="h-6 w-6 rounded-full"
          />
          <span>{props?.row?.original?.lastEditedBy?.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
  },
  {
    accessorKey: '_id',
    header: 'Actions',
    cell(props) {
      return (
        <div className="flex gap-2" {...props}>
          <Button.Icon size={'xs'} color={'default'}>
            <Pen />
          </Button.Icon>
          <Button.Icon size={'xs'} color={'default'}>
            <Trash2 className="text-error" />
          </Button.Icon>
        </div>
      );
    },
  },
];
