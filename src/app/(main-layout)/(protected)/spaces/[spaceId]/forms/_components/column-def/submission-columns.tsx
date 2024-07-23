'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { BusinessForm, FormSubmission } from '@/types/forms.type';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Typography } from '@/components/data-display';

export const makeSubmissionColumns = ({
  t,
  formFields,
}: {
  onView?: (id: string) => void;
  t: TFunction;
  formFields: BusinessForm['formFields'];
}) => {
  if (isEmpty(formFields)) {
    return [];
  }
  const columns = formFields.map(({ name, _id }) => {
    return {
      accessorKey: `answer.${name}`,
      header: name,
    };
  });
  return [
    {
      accessorKey: 'user.name',
      header: 'Submit by',
      cell: (props: any) => {
        return (
          <td className="flex items-center gap-2" {...props}>
            <Typography>{props?.row?.original?.user?.name}</Typography>
          </td>
        );
      },
    },
    {
      accessorKey: 'user.tempEmail',
      header: 'Email',
      cell: (props: any) => {
        return (
          <td className="flex items-center gap-2" {...props}>
            <Typography>{props?.row?.original?.user?.tempEmail}</Typography>
          </td>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submit at',
      cell: (props: any) => {
        const displayTime = moment(props?.row?.original?.updatedAt).format(
          'DD/MM/YYYY HH:mm A',
        );
        return (
          <td className="flex items-center gap-2" {...props}>
            <Typography>{displayTime}</Typography>
          </td>
        );
      },
    },
  ].concat(columns as any) as ColumnDef<FormSubmission>[];
};
