import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { z } from 'zod';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { TConversationTag } from '../../../_components/business-spaces';
import { DEFAULT_THEME } from '../extension-creation/sections/options';
import { createOrEditTag, deleteTag } from '@/services/business-space.service';
import { isEqual } from 'lodash';

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
            toast.success(t('Tag deleted successfully'));
            onOpenChange(false);
        } catch (error) {
            toast.error(t('Failed to delete tag'));
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
