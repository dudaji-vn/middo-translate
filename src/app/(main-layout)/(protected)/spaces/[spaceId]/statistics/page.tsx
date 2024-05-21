'use client';

import React from 'react';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import ReportCards from './_components/report/report-cards';
import { BusinessLineChart } from './_components/report/report-charts/business-line-chart';
import { useGetSpaceAnalytic } from '@/features/business-spaces/hooks/use-get-space-analytic';
import { mockChartData } from './mock-data';

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
  const { data, isFetching } = useGetSpaceAnalytic({
    spaceId,
    type: searchParams.type as any, // This type 'any' will be fixed in the next PR
    custom:
      searchParams?.fromDate && searchParams?.toDate
        ? {
            fromDate: searchParams.fromDate,
            toDate: searchParams.toDate,
          }
        : undefined,
  });

  if (!isClient) return null;

  return (
    <section className="relative h-fit w-full space-y-4">
      <ReportCards data={data} loading={isFetching} />
      <BusinessLineChart
        title={t('BUSINESS.CHART.NEWVISITOR')}
        data={mockChartData['newVisitor']}
        unit="visitor"
        nameField="newVisitor"
      />
      <BusinessLineChart
        title={t('BUSINESS.CHART.OPENEDCONVERSATION')}
        data={mockChartData['openedConversation']}
        unit="conversation"
        nameField="openedConversation"
      />
    </section>
  );
};

export default ReportPage;
