import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';

import { useModalStore } from '@/stores/modal-store';

export interface ModalProviderProps {}

export const ModalProvider = (props: ModalProviderProps) => {
  const { description, hide, isShow, title } = useModalStore();
  return (
    <AlertDialog
      open={isShow}
      onOpenChange={(open) => {
        if (!open) {
          hide();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="justify-start text-start">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
