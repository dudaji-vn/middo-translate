import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import InviteMembers from '../../../_components/spaces-crud/sections/invite-section';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member } from '../members-list/members-columns';
import UploadSpaceImage from '../../../_components/spaces-crud/sections/upload-space-image';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form } from '@/components/ui/form';
import { Typography } from '@/components/data-display';
import toast from 'react-hot-toast';


const editSpaceSchema = z.object({
    name: z.string().min(1, {
        message: 'Space name is required.'
    }).max(30, {
        message: 'Space name is too long, maximum 30 characters.'
    }),
    avatar: z.string().min(1, {
        message: 'Space avatar is required.'
    }),
    backgroundImage: z.string().optional(),

});

type TEditSpaceFormValues = z.infer<typeof editSpaceSchema>;

export const EditSpaceModal = () => {
    const [open, setOpen] = useState(false);
    const [newMembers, setNewMembers] = useState<Member[]>([]);
    const router = useRouter();
    const params = useParams();
    const { t } = useTranslation('common')
    const spaceId = params?.spaceId as string;
    const { data: space } = useGetSpaceData({ spaceId });
    const formEditSpace = useForm<TEditSpaceFormValues>({
        mode: 'onChange',
        defaultValues: {
            name: space?.name || '',
            avatar: space?.avatar || '/avatar.svg',
            backgroundImage: space?.backgroundImage,
        },
        resolver: zodResolver(editSpaceSchema),
    });

    useEffect(() => {
        formEditSpace.reset({
            name: space?.name || '',
            avatar: space?.avatar || '/avatar.svg',
            backgroundImage: space?.backgroundImage,
        });
    }, [space, open]);

    const onAddNewMember = (member: Member) => {
        if (space?.members && space?.members.find((mem: Member) => mem.email === member.email)) {
            toast.error('Member already exists in the space');
            return;
        }
        setNewMembers([...newMembers, member]);
    };
    const onSubmit = async (values: TEditSpaceFormValues) => {
        console.log('values', values)
        // await updateSpace(spaceId, values);
        setOpen(false);
    };

    return (<>
        <Button
            onClick={() => setOpen(true)}
            color={'secondary'}
            className='flex flex-row gap-2 h-10'
            shape={'square'}
            size={'sm'} >
            Edit <Pen size={15} />
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-fit  max-w-screen-md">
                <DialogTitle className="flex h-[48px] flex-row items-center justify-between py-4 pr-2 text-2xl font-semibold tracking-tight">
                    Editing Space
                </DialogTitle>
                <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white [&_h3]:mt-4  [&_h3]:text-[1.25rem]">

                    <Form {...formEditSpace}>
                        <form onSubmit={formEditSpace.handleSubmit(onSubmit)} className='w-full flex flex-col gap-3'>
                            <div className='w-full flex flex-row gap-3 p-3 bg-primary-100 items-center rounded-[12px]'>
                                <UploadSpaceImage nameField='avatar' />
                                <RHFInputField name='name'
                                    formItemProps={{
                                        className: 'w-full'
                                    }}
                                    inputProps={{
                                        placeholder: 'Enter space name',
                                        required: true,
                                    }} />
                            </div>
                            <Typography className='text-neutral-600 text-xl'>
                                Add new members to the space
                            </Typography>
                            <InviteMembers
                                headerTitleProps={{
                                    className: 'hidden'
                                }}
                                className='h-auto py-3'
                                spacePreviewProps={{ className: 'hidden' }}
                                space={{
                                    name: formEditSpace.watch('name'),
                                    avatar: formEditSpace.watch('avatar'),
                                    members: newMembers
                                }}
                                onAddMember={onAddNewMember}
                                setMembers={(members: Member[]) => {
                                    console.log('members', members)
                                    setNewMembers(members)
                                }}
                            />
                            <div className='w-full flex flex-row gap-3 items-center justify-end'>
                                {/* <Button
                                    onClick={() => setOpen(false)}
                                    color={'default'}
                                    shape={'square'}
                                    size={'sm'} >
                                    Cancel
                                </Button> */}
                                <Button
                                    type='submit'
                                    color={'primary'}
                                    shape={'square'}
                                    size={'sm'}
                                    loading={formEditSpace.formState.isSubmitting}
                                    disabled={!formEditSpace.formState.isValid}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
};
