import { Button } from '@/components/actions';
import { Item } from '@/components/data-display';
import { Input } from '@/components/data-entry';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { deleteAccount } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'usehooks-ts';

export interface DeleteAccountProps {}

export const DeleteAccount = (props: DeleteAccountProps) => {
  const { t } = useTranslation('common');
  const { value, setTrue, setValue } = useBoolean(false);
  const { user, setData } = useAuthStore();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const router = useRouter();
  const { postMessage } = useReactNativePostMessage();

  const { mutate } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      setData({
        user: {
          ...user,
          email: '',
          phone: '',
          name: '',
          avatar: '',
          isDeleted: true,
        },
      });
      toast.success('delete account success');
      router.push('/account-deleted');
      postMessage({ type: 'Trigger', data: { event: 'sign-out' } });
    },
  });

  return (
    <>
      <Item
        onClick={setTrue}
        danger
        leftIcon={<Trash2Icon />}
        className="gap-4 px-5 font-medium dark:bg-neutral-900 border-t dark:border-neutral-800"
      >
        {t('COMMON.DELETE_ACCOUNT')}
      </Item>
      <AlertDialog open={value} onOpenChange={setValue}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('MODAL.DELETE_ACCOUNT.TITLE')}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 md:mt-0 dark:text-neutral-50">
              {t('MODAL.DELETE_ACCOUNT.DESCRIPTION')}
            </AlertDialogDescription>
            {step !== 0 && (
              <>
                <AlertDialogDescription
                  dangerouslySetInnerHTML={{
                    __html: t('MODAL.DELETE_ACCOUNT.CONFIRM_RETYPE', {
                      code: user?.email,
                    }),
                  }}
                  className="mt-2 select-none md:mt-2"
                />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="mt-4"
                />
              </>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setStep(0);
              }}
              className="sm:mr-3"
            >
              {t('COMMON.CANCEL')}
            </AlertDialogCancel>
            <Button
              disabled={step === 1 && input !== user?.email}
              shape="square"
              color="error"
              onClick={() => {
                if (step === 0) {
                  setStep(1);
                  return;
                }
                mutate();
              }}
            >
              {step === 0
                ? t('COMMON.DELETE')
                : t('MODAL.DELETE_ACCOUNT.CONFIRM')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
