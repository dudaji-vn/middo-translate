import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@/components/actions';
import { Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { TSpace } from '../../../_components/business-spaces';
import { Typography } from '@/components/data-display';
import { deleteSpace } from '@/services/business-space.service';
import { ROUTE_NAMES } from '@/configs/route-name';



export const DeleteSpaceModal = ({
    space,
}: {
    space: Omit<TSpace, 'owner'>;
    deleteBtnProps?: ButtonProps;
}) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { t } = useTranslation('common')
    const form = useFormContext();
    const { formState: { errors } } = form;

    const onSubmitDeleteSpaceName = async () => {
        if (!space._id) return;
        try {
            await deleteSpace(space._id).then(res => {
                if (res.data) {
                    toast.success('Space name deleted successfully');
                    router.push(ROUTE_NAMES.SPACES);
                    setOpen(false);
                    return;
                }
            }).catch(err => {
                toast.error('Error on delete space. Please try again');
            })
        }
        catch (error) {
            console.error('Error on deleteSpace:', error)
            toast.error('Error on delete space')
        }
    }


    return (<>
        <Button
            startIcon={<Trash2 size={15} />}
            onClick={() => setOpen(true)}
            color={'default'}
            shape={'square'}
            className='text-error  min-w-fit max-sm:hidden'
            size={'xs'}
        >
            Delete Space
        </Button>
        <ConfirmAlertModal
            title={`Delete space`}
            open={open}
            onOpenChange={setOpen}
            footerProps={{
                className: 'hidden'
            }}
        >
            <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white [&_h3]:mt-4  [&_h3]:text-[1.25rem]">
                <div className='w-full flex flex-col gap-3'>
                    <Typography className='text-left'>
                        Are you sure you want to delete &nbsp;
                        <span className='text-primary-500-main'>{space.name}</span>?
                        <br />

                        You will lose all your messages and files.
                    </Typography>
                    <div className='w-full flex flex-row gap-3 items-center justify-end'>
                        <Button
                            onClick={() => setOpen(false)}
                            color={'default'}
                            shape={'square'}
                            size={'sm'} >
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            color={'error'}
                            shape={'square'}
                            size={'sm'}
                            onClick={() => {
                                form.handleSubmit(onSubmitDeleteSpaceName)();
                                setOpen(false);
                            }}
                            loading={form.formState.isSubmitting}
                            disabled={!!errors['name']}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </ConfirmAlertModal>
    </>
    );
};
