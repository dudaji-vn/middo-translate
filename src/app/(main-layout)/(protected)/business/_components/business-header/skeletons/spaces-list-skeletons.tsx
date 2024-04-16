import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

const SpacesListSkeletons = ({
    count = 4
}: {
    count: number
}) => {
    return (
        Array.from({ length: count }).map((_, index) => (
            <Card className="space-y-2 p-2 rounded-[12px] border-none bg-primary-100 animate-pulse" key={index}>
                <CardHeader className='flex p-0 flex-row justify-between items-center text-neutral-600'>
                    <CardTitle className='text-base font-normal  flex flex-row justify-between leading-[18px] w-full'>
                        <Badge className={'bg-primary-200 w-24 h-[24px] p-0 text-opacity-0 rounded-full'}><em /></Badge>
                        <em />
                        <Skeleton className="w-1/3 h-5 rounded-md bg-neutral-100" />
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="flex flex-row justify-start items-start align-top gap-2 h-fit ">
                        <Circle className="!size-28 rounded-full stroke-primary-200 fill-primary-200" />
                        <div className='flex flex-col gap-1 w-full'>
                            <Skeleton className="w-1/2 h-4 rounded-md bg-primary-200" />
                            <Skeleton className="w-1/4 h-4 rounded-md bg-primary-200" />
                        </div>
                    </div>
                </CardContent>
            </Card>))
    )
}

export default SpacesListSkeletons