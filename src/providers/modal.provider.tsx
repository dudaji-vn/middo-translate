import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';

import { useModalStore } from '@/stores/modal.store';

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
      <AlertDialogContent
        overlayProps={{
          className: 'z-[1000000]',
        }}
        className="z-[1000000]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="justify-start text-start dark:text-neutral-50">
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
