'use client';

import { Button } from '@/components/actions';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { BusinessForm } from '@/types/forms.type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DownloadButton from '../../../../clients/clients-table/download-button';
import { makeSubmissionColumns } from '../../../_components/column-def/submission-columns';
import { cn } from '@/utils/cn';
import { Download, Eye, FileDown, MoreVertical, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/stores/app.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { useExportXLSX } from '@/hooks/use-xlsx';

const MoreActions = ({
  viewDetailForm,
  onDelete,
  isUsing,
  _id,
  submissions,
  colsInfo,
  ...props
}: {
  viewDetailForm?: () => void;
  onDelete?: (id: string) => void;
  isUsing?: boolean;
  _id: string;
  submissions: any[];
  colsInfo?: Array<{
    name: string;
    width: number;
  }>;
}) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useAppStore((state) => state.isMobile);
  const { exportData } = useExportXLSX(colsInfo || []);

  if (!isMobile) {
    return (
      <div className="flex h-12 flex-row items-center gap-2">
        <Button
          size={'xs'}
          variant={'ghost'}
          color={'primary'}
          startIcon={<Eye />}
          shape={'square'}
          className={viewDetailForm ? 'min-w-fit rounded-[12px]' : 'hidden'}
          onClick={() => viewDetailForm && viewDetailForm()}
        >
          View Detail
        </Button>
        <DownloadButton
          data={submissions}
          colInfo={colsInfo || []}
          className="rounded-[8px] py-2"
          color={'default'}
        />
        {onDelete && (
          <Button.Icon
            size={'xs'}
            disabled={isUsing}
            className="py-1"
            color={'error'}
            variant={'ghost'}
            onClick={() => onDelete(_id)}
          >
            <Trash2 />
          </Button.Icon>
        )}
      </div>
    );
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Button.Icon size="xs" variant="ghost" color="default">
          <MoreVertical />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dark:border-neutral-800 dark:bg-neutral-900 [&_svg]:size-5"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DropdownMenuItem
          className="flex flex-row items-center gap-2"
          onClick={() => {
            exportData(submissions);
          }}
        >
          <FileDown />
          Download XLSX
        </DropdownMenuItem>
        {onDelete && (
          <DropdownMenuItem
            onClick={() => {
              onDelete(_id);
              setOpen(false);
            }}
            className="flex flex-row items-center gap-2"
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Submissions = ({
  _id,
  name,
  isPreview = false,
  submissions = [],
  isUsing,
  totalSubmissions,
  formFields,
  onDelete,
  viewDetailForm,
  allowRunForm,
  ...props
}: BusinessForm &
  React.HTMLAttributes<HTMLDivElement> & {
    onDelete?: (id: string) => void;
    viewDetailForm?: () => void;
    allowRunForm?: boolean;
    isPreview?: boolean;
  }) => {
  const { t } = useTranslation('common');
  const isMobile = useAppStore((state) => state.isMobile);
  const spaceId = useParams()?.spaceId || '';
  const submissionColumns = makeSubmissionColumns({
    t,
    formFields,
  });
  console.log('HIHI:>>', submissions);
  return (
    <div
      {...props}
      className={cn(
        'flex h-full w-full flex-col justify-between gap-3 ',
        props.className,
      )}
    >
      <div className="flex h-14 flex-none  flex-row items-center justify-between">
        <div>
          <div
            className={cn('flex items-center gap-2', {
              'cursor-pointer': viewDetailForm,
            })}
            onClick={() => viewDetailForm && viewDetailForm()}
          >
            <p className=" font-semibold text-primary-500-main">{name}</p>
            {isUsing && (
              <Badge
                variant="default"
                className=" bg-success-100 text-xs font-semibold text-success-700 dark:bg-success-900"
              >
                {t('COMMON.IN_USE')}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {totalSubmissions || 0} submissions data
          </p>
        </div>
        <MoreActions
          viewDetailForm={viewDetailForm}
          onDelete={onDelete}
          isUsing={isUsing}
          _id={_id}
          submissions={submissions}
          colsInfo={submissionColumns?.map((col) => ({
            name: String(col?.id),
            width: 20,
          }))}
        />
      </div>
      <div
        className={cn(
          'h-fit w-full grow overflow-y-auto',
          isPreview ? 'h-fit' : 'h-0',
        )}
      >
        <DataTable
          dividerRow={!isMobile}
          tableHeadProps={{
            className:
              'bg-white  border-none dark:bg-background dark:text-neutral-50 text-neutral-900',
          }}
          cellProps={{
            className:
              'max-w-[200px] break-words bg-transparent first:rounded-s-xl last:rounded-e-xl py-1',
          }}
          rowProps={{
            className:
              'bg-white even:bg-primary-100 bg-primary-100 h-12 hover:bg-neutral-50  dark:bg-neutral-900  dark:hover:bg-neutral-800 dark:text-neutral-50',
          }}
          columns={submissionColumns}
          data={[...submissions]}
        />
      </div>
      <div className="">
        <Button
          size={'xs'}
          variant={'default'}
          color={'default'}
          startIcon={<Eye />}
          shape={'square'}
          className={
            viewDetailForm ? 'w-full rounded-[12px] md:hidden' : 'hidden'
          }
          onClick={() => viewDetailForm && viewDetailForm()}
        >
          View Form
        </Button>
      </div>
    </div>
  );
};
export default Submissions;
