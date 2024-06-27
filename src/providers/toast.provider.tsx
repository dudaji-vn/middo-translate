import { useAppStore } from '@/stores/app.store';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  const isMobile = useAppStore((state) => state.isMobile);
  return (
    <Toaster
      position={isMobile ? 'top-center' : 'bottom-center'}
      toastOptions={{
        error: {
          className:
            '!bg-error-100 !text-neutral-800 !border !border-error dark:!bg-error-900 dark:!border-error-400 dark:!text-neutral-50 !max-w-full',
        },
        success: {
          className:
            '!bg-success-200 !text-neutral-800 !border !border-success-700 dark:!bg-success-900 dark:!border-success-700 dark:!text-neutral-50 !max-w-full',
        },
        loading: {
          className:
            '!bg-neutral-50 !text-neutral-800 !border !border-neutral-300 dark:!bg-neutral-900 dark:!border-neutral-600 dark:!text-neutral-50 !max-w-full',
        },
        blank: {
          className:
            '!bg-neutral-50 !text-neutral-800 !border !border-neutral-300 dark:!bg-neutral-900 dark:!border-neutral-600 dark:!text-neutral-50 !max-w-full',
        },
        duration: 3000,
      }}
    />
  );
};
