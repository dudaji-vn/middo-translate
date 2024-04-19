import React from 'react'
import UploadSpaceImage from '../../../_components/spaces-crud/sections/upload-space-image'
import { TEditSpaceFormValues } from '../setting-header/setting-header';
import { useFormContext } from 'react-hook-form';
import { createOrEditSpace } from '@/services/business-space.service';

const EditSpaceImage = () => {
    const { getValues } = useFormContext<TEditSpaceFormValues>();
    const onSubmitEditSpaceAvatar = async () => {
        const payload = getValues();
        try {
          await createOrEditSpace(payload);
        } catch (error) {
            console.error('Error on Edit Space Image:', error)
        }
    };
    return (
        <UploadSpaceImage nameField='avatar' clearAble={false} uploadAble={true} onUploadDone={onSubmitEditSpaceAvatar} />
    )
}

export default EditSpaceImage