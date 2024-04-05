'use client'

import React, { ReactNode, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from '@/components/data-display';
import { ArrowDown, ArrowUp, Info, Star, StarHalf } from 'lucide-react';
import { StatisticData, TChartKey } from '@/types/business-statistic.type';
import useClient from '@/hooks/use-client';
import { ceil } from 'lodash';
import { cn } from '@/utils/cn';
import { BusinessLineChart } from './report-chart/business-line-chart';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { accurateHumanize } from '@/utils/moment';


const StarRating = ({ value }: { value: number }) => {
    const fillCount = ceil(value || 0);
    const emptyCount = Math.max(5 - fillCount, 0);
    return (
        <div className="flex flex-row items-baseline justify-between space-x-2">
            {Array(ceil(fillCount)).fill(0).map((_, index) => {
                const diff = value * 1.0 - (index) * 1.0
                const isHalf = diff > 0 && diff < 1.0;
                return (
                    isHalf ?
                        <div key={index} className='relative w-fit'>
                            <StarHalf size={24} fill='#FFD700' stroke='#FFD700' className='absolute inset-0' />
                            <Star size={24} fill='#f2f2f2' stroke='#f2f2f2' />
                        </div>
                        : <Star key={index} size={24} fill='#FFD700' stroke='#FFD700' />
                )
            })}
            {Array(emptyCount).fill(0).map((_, index) => (
                <Star key={index} size={24} fill='#f2f2f2' stroke='#f2f2f2' />
            ))}
        </div>
    );
};
const Percentage = ({ value = 0, suffix = '%', prefix }: { value: number | string, suffix?: String | ReactNode, prefix?: String | ReactNode }) => {
    const prefixComp = useMemo(() => {
        if (typeof value !== 'number') return null;
        return typeof prefix !== 'undefined' ? prefix : value > 0 ? <ArrowUp size={15} /> : <ArrowDown size={15} />
    }, [value, prefix]);
    const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
    return (
        <p className={cn('text-base font-normal flex flex-row  items-center', typeof value === 'number' ? (value >= 0 ? 'text-success-700' : 'text-error-400-main') : 'text-neutral-600')} >
            {prefixComp}
            {`${displayValue}`}<span className='ml-[2px]'>{suffix}</span>
        </p>
    );
}
const tooltipContent = {
    client: 'The number of new clients in the picked time range',
    completedConversation: 'The number of conversations that have been completed in the picked time range',
    responseChat: 'The average response time of the chat in the picked time range',
    averageRating: 'The average rating of the customer in the picked time range',
}



const cardContents: Array<{
    name: TChartKey;
    title: string;
    renderDetail?: (value: number) => JSX.Element;
    renderPercentage?: (value: any) => JSX.Element;
}> = [
        {
            name: 'client',
            title: 'New Clients',
            renderDetail: (value: number) => <Typography variant={'h6'} className='text-[2rem]'>{value}</Typography>,
            renderPercentage: (value: number) => <Percentage value={value} />,
        },
        {
            name: 'completedConversation',
            title: 'Completed conversations',
            renderDetail: (value: number) => <Typography variant={'h6'} className='text-[2rem]'>{value}</Typography>,
            renderPercentage: (value: number) => <Percentage value={value} />,
        },
        {
            name: 'responseChat',
            title: "Response time",
            renderDetail: (value: number) => {
                const displayTime = accurateHumanize(moment.duration(value, 'milliseconds'), 1).accuratedTime || '0';
                return <Typography variant={'h6'} className='text-[2rem]'>{displayTime}</Typography>
            },
            renderPercentage: (value: number) => <Percentage value={value} />,
        },
        {
            name: 'averageRating',
            title: "Customer rating",
            renderDetail: (value: number) => <StarRating value={value} />,
            // renderPercentage: (value: string) => <Percentage suffix={''} prefix={''} value={value} />,
        }
    ];

const Report = ({ data }: { data: StatisticData }) => {
    const isClient = useClient();
    const { t } = useTranslation('common')
    const [chartKey, setChartKey] = React.useState<TChartKey>('client');
    if (!data && !isClient) return null;
    const handleChartKeyChange = (key: TChartKey) => {
        setChartKey(key);
    }
console.log('data', data)
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-4">
                {cardContents.map(({ name, renderDetail, title, renderPercentage }, index) => {
                    // @ts-ignore
                    let detailValue = data[name]?.count || 0;
                    // @ts-ignore
                    let percentage = data[name]?.rate || 0;
                    if (name === 'responseChat') {
                        detailValue = data.responseChat?.averageTime;
                    }
                    const displayTitle = t(`BUSINESS.CHART.${name.toUpperCase()}`)
                    return (
                        <Card
                            key={index}
                            className={cn("gap-2 p-5 borderrounded-[12px] border-solid hover:border-primary-300 cursor-pointer transition-all duration-300 ease-in-out",
                                name === chartKey && 'border-primary-500-main shadow-[2px_6px_16px_2px_#1616161A]')}
                            onClick={() => {
                                handleChartKeyChange(name);
                            }}>
                            <CardHeader className='flex p-0 flex-row justify-between items-center text-neutral-600'>
                                <CardTitle className='text-base font-normal leading-[18px]'>{displayTitle}</CardTitle>
                                <Tooltip
                                    title={tooltipContent[name]}
                                    contentProps={{
                                        className: 'text-neutral-800',
                                    }}
                                    triggerItem={
                                        <div className='text-neutral-300 hover:bg-neutral-50 rounded-full w-fit h-fit p-2'>
                                            <Info size={20} className='' />
                                        </div>
                                    }
                                />
                            </CardHeader>
                            <CardContent className='p-0'>
                                <div className="flex flex-row  items-end justify-between space-x-4 min-h-[48px]">
                                    {renderDetail && renderDetail(detailValue)}
                                    {renderPercentage && renderPercentage(percentage)}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <BusinessLineChart reportData={data} keyData={chartKey} />
        </>
    );
};

export default Report;
