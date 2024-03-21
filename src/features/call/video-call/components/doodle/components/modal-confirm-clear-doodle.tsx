
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useDoodleContext } from '../context/doodle-context-context';
import { useTranslation } from 'react-i18next';

interface ModalConfirmClearDoodleProps {
    
    handleSubmit: () => void;
}
export const ModalConfirmClearDoodle = ({ handleSubmit }: ModalConfirmClearDoodleProps) => {
    const {isShowConfirmClear, setShowConfirmClear} = useDoodleContext();
    const {t} = useTranslation('common')
    return (
        <AlertDialog open={isShowConfirmClear} onOpenChange={() => setShowConfirmClear(false)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                    {t('MODAL.CLEAR_DOODLE.TITLE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>
                           {t('MODAL.CLEAR_DOODLE.DESCRIPTION')}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={() => handleSubmit()}
                    >
                        {t('COMMON.CLEAR')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
