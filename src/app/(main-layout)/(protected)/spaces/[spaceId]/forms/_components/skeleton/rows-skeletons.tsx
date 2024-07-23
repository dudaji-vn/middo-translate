import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const RowsSkeletons = ({ rows = 10 }: { rows: number }) => {
  return (
    <div className="flex size-full max-h-full flex-col items-end justify-between gap-3 p-6">
      {[...Array(rows)].map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
};

export default RowsSkeletons;
