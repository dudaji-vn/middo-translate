import { AlertCircleOutline } from "@easy-eva-icons/react";

interface AlertErrorProps {
    errorMessage?: string;
    className?: string;
}

export const AlertError = ( props: AlertErrorProps ) => {
    let { errorMessage, className } = props;

    if(!errorMessage) return null;

    return (
        <p className={`mt-4 text-error-2 w-full bg-[#F7D4D4] rounded-[12px] px-2 py-4 text-center text-sm flex items-center justify-start gap-1 ${className}`}>
            <AlertCircleOutline className="min-w-[20px] h-5 w-5 " />
            {errorMessage}
        </p>
    )
}