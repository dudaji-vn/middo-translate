'use client';

import { exportToExcel } from '@/utils/export';
import moment from 'moment';
export function useExportXLSX<T extends any[]>(
  colInfo: Array<{ name: string; width: number }>,
) {
  const exportData = async (data: T, fileName?: string) => {
    try {
      await exportToExcel({
        data,
        fileName: fileName || 'data_' + moment().format('DD/MM/YYYY-hh:mm'),
        colInfo: colInfo,
      });
      console.log('Client data exported to Excel successfully!');
    } catch (error) {
      console.error('Error exporting client data to Excel:', error);
    }
  };

  return {
    exportData,
  };
}
