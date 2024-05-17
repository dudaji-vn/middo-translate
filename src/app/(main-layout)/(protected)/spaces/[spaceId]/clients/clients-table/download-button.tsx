'use client';

import { Button } from '@/components/actions';
import { exportToExcel } from '@/utils/export';
import { FileDown } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DownloadButton = ({
  data,
  colInfo,
}: {
  data: any;
  colInfo: Array<{ name: string; width: number }>;
}) => {
  const { t } = useTranslation('common');
  const exportDataToExcel = async () => {
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
      onClick={() => exportDataToExcel()}
      size={'md'}
      shape={'square'}
      color={'secondary'}
      className="max-md:h-12 max-md:w-16 max-md:p-2"
      // className="w-fit relative cursor-pointer z-20 flex flex-row items-center text-primary-500-main  gap-2 rounded-xl bg-primary-200 px-3 py-1 active:!bg-primary-200 active:!text-shading md:hover:bg-neutral-100"
    >
      <FileDown className="mx-1 h-5 w-5 max-md:my-[6px]" />
      <span className="max-md:hidden">{t('BUSINESS.CLIENT.EXPORT_XLSX')}</span>
    </Button>
  );
};

export default DownloadButton;
