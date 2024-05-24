'use client';

import React from 'react';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsOptions,
  useGetSpaceAnalytic,
} from '@/features/business-spaces/hooks/use-get-space-analytic';
import { ESpaceChart, TChartKey } from '@/types/business-statistic.type';
import { ReportCards } from './_components/report/report-cards';
import {
  MAPPED_CHART_UNIT,
  getProposedTimeUnit,
} from './_utils/get-humanized-unit';
import { BusinessLineChart } from './_components/report/report-charts';
import LanguageRank from './_components/report/report-charts/languages-rank/language-rank';
import BusinessScatter from './_components/report/report-charts/scatter-visit/business-scatter';

const chartsOrderList: Array<TChartKey> = [
  ESpaceChart.NEW_VISITOR,
  ESpaceChart.OPENED_CONVERSATION,
  ESpaceChart.LANGUAGE_RANK,
  ESpaceChart.TRAFFIC_TRACK,
  ESpaceChart.DROP_RATE,
  ESpaceChart.RESPONSE_TIME,
  ESpaceChart.CUSTOMER_RATING,
  ESpaceChart.RESPONSE_MESSAGE,
];
const ALLOW_DECIMALS: Array<TChartKey> = [
  ESpaceChart.RESPONSE_TIME,
  ESpaceChart.DROP_RATE,
  ESpaceChart.CUSTOMER_RATING,
];
const CHART_AFFECTED_PARAMS: Partial<
  Record<TChartKey, keyof AnalyticsOptions>
> = {
  [ESpaceChart.NEW_VISITOR]: 'domain',
  [ESpaceChart.OPENED_CONVERSATION]: 'domain',
  [ESpaceChart.DROP_RATE]: 'domain',
  [ESpaceChart.RESPONSE_MESSAGE]: 'memberId',
  [ESpaceChart.RESPONSE_TIME]: 'memberId',
};

const ReportPage = ({
  params: { spaceId },
  searchParams,
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
  const { domain, memberId, type, fromDate, toDate } = searchParams;
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
      {chartsOrderList.map((chart) => {
        if (chart === ESpaceChart.TRAFFIC_TRACK) {
          return (
            <BusinessScatter
              key={chart}
              data={data?.trafficTrack || []}
              displayFilterBy={searchParams.domain}
            />
          );
        }
        if (chart === ESpaceChart.LANGUAGE_RANK)
          return (
            <LanguageRank
              key={chart}
              piesData={data?.chart?.conversationLanguage || []}
              data={data?.conversationLanguage || []}
              isLoading={isFetching}
            />
          );
        let chartUnit = MAPPED_CHART_UNIT[chart];
        const chartData = [...(data?.chart?.[chart] || [])];
        if (chart === ESpaceChart.RESPONSE_TIME) {
          const { unit, ratio } = getProposedTimeUnit(chartData);
          chartData.forEach((item, index) => {
            chartData[index].value = Number((item.value / ratio).toFixed(0));
          }, []);
          chartUnit = unit;
        }
        const filterBy =
          searchParams[
            CHART_AFFECTED_PARAMS[chart] as keyof typeof searchParams
          ];
        return (
          <BusinessLineChart
            key={chart}
            filterByKey={CHART_AFFECTED_PARAMS[chart]}
            filterBy={filterBy}
            title={t(`BUSINESS.CHART.${chart.toUpperCase()}`)}
            data={chartData}
            unit={chartUnit}
            yAxisProps={{
              allowDecimals: ALLOW_DECIMALS.includes(chart),
            }}
          />
        );
      })}
    </section>
  );
};

export default ReportPage;
