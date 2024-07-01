import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

const SpacesListSkeletons = ({ count = 4 }: { count: number }) => {
  return Array.from({ length: count }).map((_, index) => (
    <Card
      className="animate-pulse space-y-2 rounded-[12px] border-none bg-primary-100 p-2 dark:bg-neutral-900"
      key={index}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0 text-neutral-600">
        <CardTitle className="flex w-full  flex-row justify-between text-base font-normal leading-[18px]">
          <Badge
            className={
              'h-[24px] w-24 rounded-full bg-primary-200 p-0 text-opacity-0 dark:bg-neutral-800'
            }
          >
            <em />
          </Badge>
          <em />
          <Skeleton className="h-5 w-1/3 rounded-md bg-neutral-100 dark:bg-neutral-800" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-fit flex-row items-start justify-start gap-2 align-top ">
          <Circle className="!size-28 rounded-full fill-primary-200 stroke-primary-200 dark:fill-neutral-800 dark:stroke-neutral-800"  />
          <div className="flex w-full flex-col gap-1">
            <Skeleton className="h-4 w-1/2 rounded-md bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-1/4 rounded-md bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  ));
};

export default SpacesListSkeletons;
