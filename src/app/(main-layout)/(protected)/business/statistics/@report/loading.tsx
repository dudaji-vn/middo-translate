import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from '@/components/feedback';

const SkeletonCard = () => {
  return (
    <Card className="gap-2 p-5 border rounded-[12px] border-solid animate-pulse">
      <CardHeader className='flex p-0 flex-row justify-between items-center text-neutral-600'>
        <CardTitle className='text-base font-normal leading-[18px]'>
          <Skeleton className="h-5 w-1/2 mb-1" />
        </CardTitle>
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent className='p-0'>
        <div className="flex flex-row items-end justify-between space-x-4 min-h-[48px]">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonChart = () => {
  return (
    <div
      className=
      'w-full h-60 z-[999] py-4 flex items-center justify-center bg-gray-200 animate-pulse rounded-[12px]'
    >
      <Spinner size={'md'} className='m-auto text-primary-500-main' />
    </div>
  );
};

const ReportSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      <SkeletonChart />
    </>
  );
};

export default ReportSkeleton;
