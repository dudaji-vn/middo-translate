'use client';

import React from 'react';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import { useGetSpaceAnalytic } from '@/features/business-spaces/hooks/use-get-space-analytic';
import { TChartKey } from '@/types/business-statistic.type';
import { ReportCards } from './_components/report/report-cards';
import { MAPPED_CHART_UNIT, getMaxUnit } from './_utils/get-humanized-unit';
import { BusinessLineChart } from './_components/report/report-charts';
import LanguageRank from './_components/report/report-charts/languages-rank/language-rank';

const charts: Array<TChartKey> = [
  'newVisitor',
  'openedConversation',
  'dropRate',
  'responseTime',
  'customerRating',
  'responseMessage',
];

const ReportPage = ({
  params: { spaceId },
  searchParams: { domain, memberId, type, fromDate, toDate },
}: {
  params: {
    spaceId: string;
  };
  searchParams: {
    domain: string;
    memberId: string;
    type: string;
    fromDate: string;
    toDate: string;
  };
}) => {
  const isClient = useClient();
  const { t } = useTranslation('common');
  const hasValidDateRange = fromDate && toDate;
  const { data, isFetching } = useGetSpaceAnalytic({
    spaceId,
    ...(!!type && {
      type: type as any,
    }),
    ...(hasValidDateRange && {
      custom: {
        fromDate: fromDate,
        toDate: toDate,
      },
    }),
    ...(!!domain && { domain }),
    ...(!!memberId && { memberId }),
  });

  if (!isClient) return null;

  return (
    <section className="relative h-fit w-full space-y-4">
      <ReportCards data={data?.analysis} loading={isFetching} />
      <LanguageRank
        data={data?.conversationLanguage || []}
        isLoading={isFetching}
      />
      {charts.map((chart) => {
        let chartUnit = MAPPED_CHART_UNIT[chart];
        const chartData = data?.chart?.[chart] || [];
        if (chart === 'responseTime') {
          const { unit, ratio } = getMaxUnit(chartData);
          chartData.forEach((item) => {
            item.value = Number((item.value / ratio).toFixed(1));
          }, []);
          chartUnit = unit;
        }
        if (chart === 'dropRate') {
          chartData.forEach((item) => {
            item.value = item.value * 100;
          }, []);
        }
        if (chart === 'customerRating') {
          chartData.forEach((item) => {
            item.value = item.value * 5;
          }, []);
        }
        return (
          <BusinessLineChart
            key={chart}
            title={t(`BUSINESS.CHART.${chart.toUpperCase()}`)}
            data={data?.chart?.[chart] || []}
            unit={chartUnit}
          />
        );
      })}
    </section>
  );
};

export default ReportPage;
