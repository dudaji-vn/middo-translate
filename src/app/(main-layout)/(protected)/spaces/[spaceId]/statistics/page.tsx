'use client';

import React from 'react';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import ReportCards from './_components/report/report-cards';
import { BusinessLineChart } from './_components/report/report-charts/business-line-chart';
import { useGetSpaceAnalytic } from '@/features/business-spaces/hooks/use-get-space-analytic';
import { TChartKey } from '@/types/business-statistic.type';

const charts: Array<TChartKey> = [
  'newVisitor',
  'openedConversation',
  'dropRate',
  'responseTime',
  'customerRating',
];

const ReportPage = ({
  params: { spaceId },
  searchParams,
}: {
  params: {
    spaceId: string;
  };
  searchParams: {
    type: string;
    fromDate: string;
    toDate: string;
  };
}) => {
  const isClient = useClient();
  const { t } = useTranslation('common');
  const hasValidDateRange = searchParams.fromDate && searchParams.toDate;
  const { data, isFetching } = useGetSpaceAnalytic({
    spaceId,
    ...(!!searchParams.type && {
      type: searchParams.type as any,
    }),
    ...(hasValidDateRange && {
      custom: {
        fromDate: searchParams.fromDate,
        toDate: searchParams.toDate,
      },
    }),
  });

  if (!isClient) return null;
  console.log('data???', data);

  return (
    <section className="relative h-fit w-full space-y-4">
      <ReportCards data={data?.analysis} loading={isFetching} />
      {charts.map((chart) => {
        return (
          <BusinessLineChart
            key={chart}
            title={t(`BUSINESS.CHART.${chart.toUpperCase()}`)}
            data={data?.chart?.[chart] || []}
            unit={chart === 'responseTime' ? 's' : 'message'}
            nameField={chart}
          />
        );
      })}
    </section>
  );
};

export default ReportPage;
