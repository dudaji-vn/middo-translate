import { PropsWithChildren } from 'react';

export interface AddedListWrapperProps {}

export const AddedListWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="rounded-xl bg-primary-100 dark:bg-transparent">
      <div className="p-3">
        <span className="text-sm font-semibold text-neutral-600">
          Added list
        </span>
      </div>
      <div className="flex w-full flex-1 flex-col overflow-y-auto ">
        {children}
      </div>
    </div>
  );
};
