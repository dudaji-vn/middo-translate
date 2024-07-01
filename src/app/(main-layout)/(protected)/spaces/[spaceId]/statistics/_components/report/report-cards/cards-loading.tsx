import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/data-display';

const SkeletonCard = () => {
  return (
    <Card className="animate-pulse gap-2 rounded-[12px] border border-solid p-5 dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between p-0 text-neutral-600">
        <CardTitle className="text-base font-normal leading-[18px]">
          <Skeleton className="mb-1 h-5 w-2/3" />
        </CardTitle>
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex min-h-[64px] flex-row items-end justify-between space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

const CardsLoading = () => {
  return (
    <section className="relative w-full space-y-4 bg-white dark:bg-neutral-900 px-4 py-5 md:px-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3 ">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
};

export default CardsLoading;
