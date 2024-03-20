'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { ArrowDown, ArrowUp, Info, Star, StarHalf } from 'lucide-react';
import { StatisticData } from '@/types/business-statistic.type';
import useClient from '@/hooks/use-client';
import { ceil } from 'lodash';
import { cn } from '@/utils/cn';

const ESP = 0.0001;

const StarRating = ({ value }: { value: number }) => {
    const fillCount = ceil(value || 0);
    const emptyCount = Math.max(5 - fillCount, 0);
    return (
        <div className="flex flex-row items-baseline justify-between space-x-2">
            {Array(ceil(fillCount)).fill(0).map((_, index) => {
                const isHalf = Math.abs(value - (index) - 0.5) < ESP;
                return (
                    isHalf ? <StarHalf key={index} size={20} fill='#FFD700' stroke='#FFD700' /> : <Star key={index} size={20} fill='#FFD700' stroke='#FFD700' />
                )
            })}
            {Array(emptyCount).fill(0).map((_, index) => (
                <Star key={index} size={20} className='invisible' />
            ))}
        </div>
    );
};
const Percentage = ({ value }: { value: number }) => {
    return (
        <Typography variant={'h6'} className={cn('text-base font-normal flex flex-row items-center', value > 0 ? 'text-success-700' : 'text-error-400-main')} >
            {value > 0 ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
            {`${value}%`}
        </Typography>
    );
}

const cardContents = [
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
        renderDetail: (value: number) => <Typography variant={'h6'} className='text-[2rem]'>{value}</Typography>,
        renderPercentage: (value: number) => <Percentage value={value} />,
    },
    {
        name: 'averageRating',
        title: "Average rating",
        renderDetail: (value: number) => <StarRating value={value} />,
    }
];

const ReportCards = ({ data }: { data: StatisticData }) => {
    const isClient = useClient();
    if (!data && !isClient) return null;
    console.log('data', data)

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cardContents.map(({ name, renderDetail, title, renderPercentage }, index) => {
                // @ts-ignore
                let detailValue = data[name]?.count;
                // @ts-ignore
                let percentage = data[name]?.rate;
                if (name === 'responseChat') {
                    detailValue = data.responseChat?.averageTime;
                }
                if (name === 'averageRating') {
                    percentage = data.averageRating
                }
                return (
                    <Card key={index} className="gap-2 p-5 borderrounded-[12px] border-solid hover:border-primary-500-main">
                        <CardHeader className='flex p-0 flex-row justify-between items-center text-neutral-600'>
                            <CardTitle className='text-base font-normal leading-[18px]'>{title}</CardTitle>
                            <Button.Icon
                                variant="ghost"
                                size={'xs'}
                                type="button"
                                className='text-neutral-400'
                            ><Info size={10} />
                            </Button.Icon>
                        </CardHeader>
                        <CardContent className='p-0'>
                            <div className="flex flex-row items-end justify-between space-x-4 min-h-[48px]">
                                {renderDetail && renderDetail(detailValue)}
                                {renderPercentage && renderPercentage(percentage)}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default ReportCards;
