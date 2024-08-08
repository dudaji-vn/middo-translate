'use client';

import { Button, ButtonProps } from '@/components/actions';
import { cn } from '@/utils/cn';
import { exportToExcel } from '@/utils/export';
import { FileDown } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DownloadButton = ({
  data,
  colInfo,
  ...props
}: {
  data: any;
  colInfo: Array<{ name: string; width: number }>;
} & Omit<ButtonProps, 'endIcon'> & {
    endIcon?: any;
  }) => {
  const { t } = useTranslation('common');
  const exportData = async () => {
    try {
      // Assuming you have 'exportToExcel' function available in the scope
      await exportToExcel({
        data,
        fileName: 'clients_data_' + moment().format('DD/MM/YYYY-hh:mm'),
        colInfo: colInfo,
      });
      console.log('Client data exported to Excel successfully!');
    } catch (error) {
      console.error('Error exporting client data to Excel:', error);
    }
  };
  return (
    <Button
      onClick={() => exportData()}
      size={'md'}
      shape={'square'}
      color={'secondary'}
      startIcon={<FileDown />}
      {...props}
      className={cn('h-fit w-full rounded-[12px] max-md:p-2', props.className)}
      // className="w-fit relative cursor-pointer z-20 flex flex-row items-center text-primary-500-main  gap-2 rounded-xl bg-primary-200 px-3 py-1 active:!bg-primary-200 active:!text-shading md:hover:bg-neutral-100"
    >
      <span>{t('EXTENSION.CLIENT.EXPORT_XLSX')}</span>
    </Button>
  );
};

export default DownloadButton;
