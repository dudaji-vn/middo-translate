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
import { getProposedTimeUnit } from './_utils/get-humanized-unit';
import { BusinessLineChart } from './_components/report/report-charts';
import LanguageRank from './_components/report/report-charts/languages-rank/language-rank';
import BusinessScatter from './_components/report/report-charts/scatter-visit/business-scatter';
import EmptyReport from './_components/report/empty-report/empty-repor';
import { ReportHeader } from './_components/report/report-header';

const chartsOrderList: Array<TChartKey> = [
  ESpaceChart.NEW_VISITOR,
  ESpaceChart.OPENED_CONVERSATION,
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
  const isNotEnoughData = data?.isNotEnoughData;
  if (isNotEnoughData) {
    return <EmptyReport />;
  }
  return (
    <>
      <ReportHeader />
      <section className="relative h-fit w-full bg-[#FCFCFC] md:space-y-4">
        <ReportCards
          data={data?.analysis}
          loading={isFetching}
          domain={searchParams.domain}
          memberId={searchParams.memberId}
        />
        {chartsOrderList.map((chart) => {
          let chartUnit =
            t(`EXTENSION.CHART_UNIT.${chart.toUpperCase()}`) || '';
          const chartData = [...(data?.chart?.[chart] || [])];
          let formattedTotal: number | string =
            data?.analysis[chart]?.total || 0;
          const filterBy =
            searchParams[
              CHART_AFFECTED_PARAMS[chart] as keyof typeof searchParams
            ];
          switch (chart) {
            case ESpaceChart.OPENED_CONVERSATION: {
              return (
                <div className="flex flex-col" key={chart}>
                  <BusinessLineChart
                    key={chart}
                    tooltipContent={t(
                      `EXTENSION.CHART_TOOLTIP.${chart.toUpperCase()}`,
                    )}
                    total={`${formattedTotal}`}
                    filterByKey={CHART_AFFECTED_PARAMS[chart]}
                    filterBy={filterBy}
                    title={t(`EXTENSION.CHART.${chart.toUpperCase()}`)}
                    data={chartData}
                    unit={chartUnit}
                    yAxisProps={{
                      allowDecimals: ALLOW_DECIMALS.includes(chart),
                    }}
                  />
                  <LanguageRank
                    key={chart}
                    piesData={data?.chart?.conversationLanguage || []}
                    data={data?.conversationLanguage || []}
                    isLoading={isFetching}
                  />
                  <BusinessScatter
                    key={chart}
                    data={data?.trafficTrack || []}
                    displayFilterBy={searchParams.domain}
                  />
                </div>
              );
            }
            case ESpaceChart.RESPONSE_TIME: {
              const { unit, ratio } = getProposedTimeUnit(chartData);
              chartData.forEach((item, index) => {
                chartData[index].value = Number(
                  (item.value / ratio).toFixed(0),
                );
              }, []);
              formattedTotal = chartData.reduce((acc, item) => {
                return acc + item.value;
              }, 0);
              chartUnit = t(`EXTENSION.CHART_UNIT.${unit.toUpperCase()}`) || '';
            }
            case ESpaceChart.CUSTOMER_RATING:
              formattedTotal =
                (data?.analysis[chart]?.value || 0) /
                  (data?.analysis[chart]?.total || 1) || 0;
            case ESpaceChart.NEW_VISITOR:
            case ESpaceChart.RESPONSE_MESSAGE:
              formattedTotal = `${formattedTotal} ${chartUnit}`;
              break;
            case ESpaceChart.DROP_RATE:
              {
                const { value, total } = data?.analysis[chart] || {
                  value: 0,
                  total: 1,
                };
                const rate = total
                  ? Number((value / total).toFixed(0)) * 100
                  : 0;
                formattedTotal = `${rate}%`;
              }
              break;
          }

          return (
            <BusinessLineChart
              key={chart}
              tooltipContent={t(
                `EXTENSION.CHART_TOOLTIP.${chart.toUpperCase()}`,
              )}
              total={`${formattedTotal}`}
              filterByKey={CHART_AFFECTED_PARAMS[chart]}
              filterBy={filterBy}
              title={t(`EXTENSION.CHART.${chart.toUpperCase()}`)}
              data={chartData}
              unit={chartUnit}
              yAxisProps={{
                allowDecimals: ALLOW_DECIMALS.includes(chart),
              }}
            />
          );
        })}
      </section>
    </>
  );
};

export default ReportPage;
