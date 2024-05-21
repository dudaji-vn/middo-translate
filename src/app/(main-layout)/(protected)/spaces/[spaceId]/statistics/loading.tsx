import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/feedback';

const SkeletonCard = () => {
  return (
    <Card className="animate-pulse gap-2 rounded-[12px] border border-solid p-5">
      <CardHeader className="flex flex-row items-center justify-between p-0 text-neutral-600">
        <CardTitle className="text-base font-normal leading-[18px]">
          <Skeleton className="mb-1 h-5 w-2/3" />
        </CardTitle>
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex min-h-[48px] flex-row items-end justify-between space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonChart = () => {
  return (
    <div className="z-[999] flex h-60 w-full animate-pulse items-center justify-center rounded-[12px] bg-gray-200 py-4">
      <Spinner size={'md'} className="m-auto text-primary-500-main" />
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
