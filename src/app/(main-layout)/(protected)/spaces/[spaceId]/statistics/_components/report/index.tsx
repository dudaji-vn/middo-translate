'use client';

import React, {  } from 'react';
import { StatisticData, TChartKey } from '@/types/business-statistic.type';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import { BusinessLineChart } from './report-charts/business-line-chart';
import ReportCards from './report-cards';

const Report= ({ data }: { data: StatisticData }) => {
  const isClient = useClient();
  const { t } = useTranslation('common');
  const [chartKey, setChartKey] = React.useState<TChartKey>('client');
  if (!data && !isClient) return null;
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

export default Report;
