import { Button } from "@/components/actions";
import { XIcon } from "lucide-react";
import toast, { Toast, ToastOptions } from "react-hot-toast";

const customToastContent = (t: Toast, message: string | React.ReactNode) => {
    return <div className="flex items-center -mr-2">
        <span className="break-all line-clamp-2">
            {message}
        </span>
        <Button.Icon 
            variant={'ghost'}
            color={'default'}
            size={'ss'}
            onClick={() => toast.dismiss(t.id)} 
            className="ml-2"
        >
            <XIcon size={16} />
        </Button.Icon>
    </div>
}

const customToast = {
    success: (message: string | React.ReactNode, options ?: ToastOptions) => {
        toast.success((t)=>customToastContent(t, message), options);
    },
    error: (message: string | React.ReactNode, options ?: {}) => {
        toast.error((t)=>customToastContent(t, message), options);
    },
    default: (message: string | React.ReactNode, options ?: {}) => {
        toast((t)=>customToastContent(t, message), options);
    },
};

export default customToast;