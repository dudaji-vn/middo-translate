import { AlertCircleIcon } from 'lucide-react';

interface AlertErrorProps {
  errorMessage?: string;
  className?: string;
}

export const AlertError = (props: AlertErrorProps) => {
  let { errorMessage, className } = props;

  if (!errorMessage) return null;

  return (
    <p
      className={`mt-4 flex w-full items-center justify-start gap-1 rounded-[12px] bg-[#F7D4D4] px-2 py-4 text-center text-sm text-error-2 ${className}`}
    >
      <AlertCircleIcon className="h-5 w-5 min-w-[20px] " />
      {errorMessage}
    </p>
  );
};
