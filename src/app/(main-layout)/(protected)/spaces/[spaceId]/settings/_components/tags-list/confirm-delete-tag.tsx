import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { TConversationTag } from '../../../_components/business-spaces';
import { deleteTag } from '@/services/business-space.service';
import customToast from '@/utils/custom-toast';

export const ConfirmDeleteTag = ({
    open,
    onOpenChange,
    spaceId,
    tag,
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    spaceId: string,
    tag: TConversationTag
}) => {
    const router = useRouter();
    const { t } = useTranslation('common')

    const onSubmit = async () => {
        try {
            await deleteTag({
                spaceId,
                tagId: tag?._id
            });
            router.refresh();
            customToast.success(t('Tag deleted successfully'));
            onOpenChange(false);
        } catch (error) {
            customToast.error(t('Failed to delete tag'));
        }
    }
    return (
        <ConfirmAlertModal
            title={`Delete tag`}
            description={`Are you sure you want to delete the tag ${tag?.name}?`}
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={onSubmit}
            onCancel={() => onOpenChange(false)}
        />

    );
};
