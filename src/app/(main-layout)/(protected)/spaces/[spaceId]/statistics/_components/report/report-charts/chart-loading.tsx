import { Spinner } from '@/components/feedback';

const SkeletonChart = () => {
  return (
    <div className="z-[999] flex h-60 w-full animate-pulse items-center justify-center rounded-[12px] bg-gray-200 py-4">
      <Spinner size={'md'} className="m-auto text-primary-500-main" />
    </div>
  );
};
export default SkeletonChart;
