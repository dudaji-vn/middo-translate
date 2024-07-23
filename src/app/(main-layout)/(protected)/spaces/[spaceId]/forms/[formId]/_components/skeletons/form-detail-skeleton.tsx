import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const FormDetailSkeleton = ({ rows }: { rows: number }) => {
  return (
    <div className="flex size-full flex-row items-end justify-between space-x-4 p-10">
      {[...Array(rows)].map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
};

export default FormDetailSkeleton;
