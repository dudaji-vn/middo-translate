'use client';

import { ColumnDef } from '@tanstack/react-table';
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
    },
    {
      accessorKey: 'firstConnectDate',
      header: t('EXTENSION.CLIENT.FIRST_CONNECT_DATE'),
    },
    {
      accessorKey: 'lastConnectDate',
      header: t('EXTENSION.CLIENT.LAST_CONNECT_DATE'),
    },
  ];
}
