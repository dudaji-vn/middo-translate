'use client';

import { User } from '@/features/users/types';
import { ColumnDef, SortingFn } from '@tanstack/react-table';
import { Edge } from 'reactflow';
import { FlowNode } from '../../../settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { Button } from '@/components/actions';
import { Eye, Pen, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/data-display';
import moment from 'moment';
import { Checkbox } from '@/components/form/checkbox';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { TFunction } from 'i18next';

export type ChatScript = {
  _id: string;
  name: string;
  lastEditedBy: Partial<User>;
  createdBy: Partial<User>;
  createdAt: string;
  updatedAt: string;
  isUsing: boolean;
  chatFlow: {
    nodes: FlowNode[];
    edges: Edge[];
  };
};

export const makeScriptsColumns = ({
  onView,
  onEdit,
  enableDeletion = true,
  singleRowSelection = false,
  isSomeRowCanDelete = false,
  onDeleteRowSelections = () => {},
  t,
}: {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  isSomeRowCanDelete?: boolean;
  enableDeletion?: boolean;
  singleRowSelection?: boolean;
  onDeleteRowSelections?: () => void;
  t: TFunction;
}) =>
  [
    {
      id: 'select',
      header: ({ table }) => {
        const noData = table.getRowCount() === 0;
        if (singleRowSelection || noData || !isSomeRowCanDelete) {
          return null;
        }
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const selectAble = row?.getCanSelect();
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className={cn(
              selectAble
                ? 'cursor-pointer'
                : 'cursor-not-allowed border-neutral-300',
              singleRowSelection ? 'rounded-full' : '',
            )}
            disabled={!selectAble}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: t('EXTENSION.SCRIPT.NAME'),
      cell(props) {
        return (
          <td {...props} className=" flex flex-row gap-2">
            <span className="line-clamp-2 max-w-80 text-ellipsis break-words">
              {props?.row?.original?.name}
            </span>
            {props?.row?.original?.isUsing && (
              <Badge
                variant="default"
                className=" bg-success-100 text-xs font-semibold text-success-700 dark:bg-success-900"
              >
                {t('COMMON.IN_USE')}
              </Badge>
            )}
          </td>
        );
      },
    },
    {
      accessorKey: 'createdBy',
      header: t('COMMON.CREATED_BY'),
      cell(props) {
        return (
          <td className="flex gap-2" {...props}>
            <Avatar
              src={props.row?.original?.createdBy?.avatar || '/avatar.svg'}
              alt={String(props.row?.original?.createdBy?.name)}
              className="h-6 w-6 rounded-full"
            />
            <span>{props?.row?.original?.createdBy?.name}</span>
          </td>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EXTENSION.SCRIPT.CREATE_ON'),
      sortDescFirst: true,
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.createdAt;
        const statusB = rowB.original.createdAt;

        return (
          new Date(statusA as string).getTime() -
          new Date(statusB as string).getTime()
        );
      },
      cell(props) {
        const displayTime = moment(props?.row?.original?.createdAt).format(
          'DD/MM/YYYY HH:mm A',
        );
        return (
          <td className="flex gap-2" {...props}>
            <span>{displayTime}</span>
          </td>
        );
      },
    },
    {
      accessorKey: 'lastEditedBy',
      header: t('EXTENSION.SCRIPT.LAST_EDITED'),
      cell(props) {
        const displayTime = moment(props?.row?.original?.updatedAt).format(
          'DD/MM/YYYY HH:mm A',
        );
        return (
          <td className="flex gap-2" {...props}>
            <Avatar
              src={props.row?.original?.lastEditedBy?.avatar || '/avatar.svg'}
              alt={String(props.row?.original?.lastEditedBy?.name)}
              className="h-6 w-6 rounded-full"
            />
            <span>{displayTime}</span>
          </td>
        );
      },
    },
    {
      accessorKey: '_id',
      header(props) {
        const table = props.table;
        const isManySelected =
          table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected();

        return (
          <th className="flex flex-row items-center gap-2">
            <p className="min-w-20 font-normal">
              {t('EXTENSION.SCRIPT.ACTIONS')}
            </p>
            <Button.Icon
              variant={'ghost'}
              size={'xs'}
              color={'error'}
              disabled={!isManySelected || !enableDeletion}
              onClick={onDeleteRowSelections}
              className={enableDeletion ? '' : 'hidden'}
            >
              <Trash2 />
            </Button.Icon>
          </th>
        );
      },
      cell(props) {
        return (
          <td className="flex gap-2" {...props}>
            <Tooltip
              title={t('COMMON.VIEW')}
              triggerItem={
                <Button.Icon
                  variant={'ghost'}
                  size={'xs'}
                  color={'default'}
                  onClick={() => onView(props.row.original._id)}
                >
                  <Eye />
                </Button.Icon>
              }
            />
            <Tooltip
              title={t('COMMON.EDIT')}
              triggerItem={
                <Button.Icon
                  variant={'ghost'}
                  size={'xs'}
                  color={'default'}
                  onClick={() => onEdit(props.row.original._id)}
                >
                  <Pen />
                </Button.Icon>
              }
            />
          </td>
        );
      },
    },
  ] as ColumnDef<ChatScript>[];
