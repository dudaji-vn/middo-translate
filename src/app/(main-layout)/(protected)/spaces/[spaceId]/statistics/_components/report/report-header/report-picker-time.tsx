'use client';

import { Button } from '@/components/actions';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { addDays, format } from 'date-fns';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { ReportDropdown } from '../../report-dropdown';
import { DropdownOption } from '../../report-dropdown/report-dropdown';
import { generateHref } from './href.util';

export type TimePickerType =
  | 'last-week'
  | 'last-month'
  | 'last-year'
  | 'custom';

export const analyticsType = ['last-week', 'last-month', 'last-year', 'custom'];

export type TimePickerOptions = {
  type: TimePickerType;
  spaceId: string;
} & (
  | {
      type: 'custom';
      custom: {
        fromDate: string;
        toDate: string;
      };
    }
  | {
      type: Exclude<'last-week' | 'last-month' | 'last-year', 'custom'>;
      custom?: never;
    }
);
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

const defaultOption = 'last-week';
export const reportDateFilterOptions: Record<
  TimePickerOptions['type'],
  string
> = {
  'last-week': 'COMMON.TIME.LAST_WEEK',
  'last-month': 'COMMON.TIME.LAST_MONTH',
  'last-year': 'COMMON.TIME.LAST_YEAR',
  custom: 'COMMON.TIME.CUSTOM',
};
export type ReportPickerTimeProps = {};

const ReportPickerTime = ({ ...props }: ReportPickerTimeProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation('common');
  const current = new URLSearchParams(
    Array.from(searchParams?.entries() || []),
  );
  const type = searchParams?.get('type');
  const fromDate = searchParams?.get('fromDate') || '';
  const toDate = searchParams?.get('toDate') || '';

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDatePickerModal, setOpenDatePickerModal] = useState(false);
  const options: DropdownOption[] = Object.entries(reportDateFilterOptions).map(
    ([key, value]) => {
      const href =
        `${ROUTE_NAMES.SPACES}/${params?.spaceId}` +
          generateHref(
            key as TimePickerType,
            { fromDate, toDate },
            reportDateFilterOptions,
            defaultOption,
            current,
          ) || '#';
      return {
        name: t(value),
        value: key,
        href: key === 'custom' ? undefined : href,
        onClick:
          key === 'custom' ? () => setOpenDatePickerModal(true) : undefined,
      };
    },
  );
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    options[0],
  );
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromDate ? new Date(fromDate) : addDays(new Date(), -7),
    to: toDate ? new Date(toDate) : new Date(),
  });
  const onConfirmRangeFilter = () => {
    current.set(
      'fromDate',
      format(date?.from || new Date(), DEFAULT_DATE_FORMAT),
    );
    current.set('toDate', format(date?.to || new Date(), DEFAULT_DATE_FORMAT));
    current.set('type', 'custom');
    const href = `${ROUTE_NAMES.SPACES}/${params?.spaceId}/statistics?${current.toString()}`;
    router.push(href);
    setOpenDatePickerModal(false);
  };

  const displayCurrentValue = useMemo(() => {
    if (type === 'custom') {
      return `${format(date?.from || new Date(), 'yyyy/MM/dd')} - ${format(date?.to || new Date(), 'yyyy/MM/dd')}`;
    }
    const contentKey =
      reportDateFilterOptions[(type || defaultOption) as TimePickerType];
    return t(contentKey);
  }, [type, date]);

  useEffect(() => {
    if (!type) {
      return;
    }
    if (reportDateFilterOptions[type as TimePickerType]) {
      setSelectedOption(
        options.find((opt) => opt.value === type) || options[0],
      );
    } else {
      current.set('type', defaultOption);
      const href = `${ROUTE_NAMES.SPACES}/${params?.spaceId}/statistics?${current.toString()}`;
      router.push(href);
    }
  }, [type]);

  return (
    <>
      <ReportDropdown
        open={openDropdown}
        displayCurrentValue={displayCurrentValue}
        onOpenChange={setOpenDropdown}
        selectedOption={selectedOption || options[0]}
        onSelectChange={(option) => {
          if (option.href) {
            router.push(option.href);
          }
          if (option.value === 'custom') {
            setOpenDatePickerModal(true);
          }
        }}
        options={options}
        startIcon={<CalendarIcon />}
      />

      <ConfirmAlertModal
        title="Pick a date range"
        titleProps={{
          className: 'mx-auto',
        }}
        open={openDatePickerModal}
        onOpenChange={setOpenDatePickerModal}
        dialogContentProps={{
          className:
            'w-full md:max-w-screen-md max-md:w-full max-md:h-[90vh] overflow-y-auto',
        }}
        footerProps={{
          className: 'hidden',
        }}
        onCancel={() => setOpenDatePickerModal(false)}
        onConfirm={onConfirmRangeFilter}
      >
        <div className="mx-auto flex flex-col items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <div className="flex text-primary-600">
                {format(date.from, 'LLL dd, y')} -{' '}
                {format(date.to, 'LLL dd, y')}
              </div>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date</span>
          )}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </div>
        <div className="flex justify-end px-4">
          <Button
            className="h-11 w-28"
            size={'xs'}
            onClick={onConfirmRangeFilter}
          >
            {t('COMMON.APPLY')}
          </Button>
        </div>
      </ConfirmAlertModal>
    </>
  );
};

export default ReportPickerTime;
