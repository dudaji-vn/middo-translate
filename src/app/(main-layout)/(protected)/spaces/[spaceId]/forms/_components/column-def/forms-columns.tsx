'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/actions';
import { Eye, Pen, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/data-display';
import moment from 'moment';
import { Checkbox } from '@/components/form/checkbox';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { TFunction } from 'i18next';
import { BusinessForm } from '@/types/forms.type';

export const makeFormsColumns = ({
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
      header: t('EXTENSION.FORM.NAME'),
      cell(props) {
        return (
          <td {...props} className=" flex gap-2">
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
      accessorKey: '_id',
      header(props) {
        const table = props.table;
        const isManySelected =
          table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected();

        return (
          <th className="flex flex-row items-center gap-2">
            <p className="min-w-20 font-normal">
              {t('EXTENSION.FORM.ACTIONS')}
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
  ] as ColumnDef<BusinessForm>[];
