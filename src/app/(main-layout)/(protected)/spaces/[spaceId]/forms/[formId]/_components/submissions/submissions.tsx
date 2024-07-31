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
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  const spaceId = useParams()?.spaceId || '';
  const submissionColumns = makeSubmissionColumns({
    t,
    formFields,
  });

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
            colInfo={[]}
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
      </div>
      <div
        className={cn(
          'h-fit w-full grow overflow-y-auto',
          isPreview ? 'h-fit' : 'h-0',
        )}
      >
        <DataTable
          dividerRow
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
    </div>
  );
};
export default Submissions;
