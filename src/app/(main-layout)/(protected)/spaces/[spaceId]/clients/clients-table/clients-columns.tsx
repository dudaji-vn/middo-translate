'use client';

import { ColumnDef, SortingFn } from '@tanstack/react-table';
import { Client } from '../page';
import { TFunction } from 'i18next';

export function makeClientsColumns(t: TFunction): ColumnDef<Client>[] {
  return [
    {
      accessorKey: 'name',
      header: t('EXTENSION.CLIENT.NAME'),
    },
    {
      accessorKey: 'email',
      header: t('EXTENSION.CLIENT.EMAIL'),
    },
    {
      accessorKey: 'phoneNumber',
      header: t('EXTENSION.CLIENT.PHONE'),
      cell: ({ row }) => {
        const value = row.original.phoneNumber;
        if (!value) {
          return '-';
        }
        return (
          <a
            href={`
            tel:${value}
          `}
          >
            {value}
          </a>
        );
      },
    },
    {
      accessorKey: 'firstConnectDate',
      header: t('EXTENSION.CLIENT.FIRST_CONNECT_DATE'),
      // enableSorting: true,
      sortDescFirst: true,
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.firstConnectDate;
        const statusB = rowB.original.firstConnectDate;

        return (
          new Date(statusA as string).getTime() -
          new Date(statusB as string).getTime()
        );
      },
    },
    {
      accessorKey: 'lastConnectDate',
      header: t('EXTENSION.CLIENT.LAST_CONNECT_DATE'),
      // enableSorting: true,
      sortDescFirst: true,
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.lastConnectDate;
        const statusB = rowB.original.lastConnectDate;

        return (
          new Date(statusA as string).getTime() -
          new Date(statusB as string).getTime()
        );
      },
    },
  ];
}
