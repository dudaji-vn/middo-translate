'use client';

import React, { use } from 'react';
import { StatisticData, TChartKey } from '@/types/business-statistic.type';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import ReportCards from './_components/report/report-cards';
import { BusinessLineChart } from './_components/report/report-charts/business-line-chart';
import ReportHeader from './_components/report/report-header/report-header';
import { useGetSpaceAnalytic } from '@/features/business-spaces/hooks/use-get-space-analytic';

const ReportPage = ({
  params: { spaceId },
}: {
  params: {
    spaceId: string;
  };
}) => {
  const isClient = useClient();
  const { t } = useTranslation('common');
  const [chartKey, setChartKey] = React.useState<TChartKey>('client');
  const data: StatisticData = useGetSpaceAnalytic({ spaceId }).data;

  if (!data || !isClient) return null;
  const handleChartKeyChange = (key: TChartKey) => {
    setChartKey(key);
  };

  return (
    <>
      <ReportCards
        data={data}
        chartKey={chartKey}
        onKeyChange={handleChartKeyChange}
      />
      <BusinessLineChart reportData={data} keyData={chartKey} />
    </>
  );
};

export default ReportPage;
