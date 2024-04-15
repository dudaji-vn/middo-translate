import { Button } from '@/components/actions'
import { Avatar, Typography } from '@/components/data-display'
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField'
import { Form, FormLabel } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Plus } from 'lucide-react'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { TSpace } from '../../business-header/business-spaces'
import { DataTable } from '@/components/ui/data-table'
import { Member, membersColumns } from './members-columns'
import { inviteMemberService } from '@/services/business-space.service'
import toast from 'react-hot-toast'

const addingSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address'
    }),
    role: z.string()
})

type TAddingmember = z.infer<typeof addingSchema>

const items = [
    {
        name: 'Admin',
        icon: <Avatar src='/avatar.png' alt='avatar' className='w-6 h-6' />,
    },
    {
        name: 'Member',
        icon: <Avatar src='/avatar.png' alt='avatar' className='w-6 h-6' />,
    },
]

const InviteMembers = ({ space }: {
    space: TSpace
}) => {
    const [invitedMembers, setInvitedMembers] = React.useState<Array<Member>>(space?.members.map(member => ({
        email: member.email,
        role: member.role,
        status: member.status
    })) || []
    );
    const formAdding = useForm<TAddingmember>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            role: 'member',
        },
        resolver: zodResolver(addingSchema),
    });
    const submit = async (data: TAddingmember) => {
        if (invitedMembers.find(member => member.email === data.email)) {
            toast.error('This email is already invited');
            return;
        }
        try {
            const res = await inviteMemberService({
                email: data.email,
                role: data.role
            })
            setInvitedMembers((prev) => [...prev, {
                email: data.email,
                role: data.role,
                status: 'invited'
            }])
            console.log('res', res);
        } catch (error) {
            toast.error('failed to invite member');
        }

        formAdding.setValue('email', '')
    }

    return (
        <section
            className='max-w-6xl h-[calc(100vh-200px)] min-h-80  flex flex-col items-center justify-center gap-8'
        >
            <div className='w-full flex flex-col  gap-3'>
                <Typography className='text-neutral-800 text-[32px] font-semibold leading-9'>
                    <span className='text-primary-500-main mr-2'>Invite</span>other to join your space <span className='text-[24px] font-normal'>(optional)</span>
                </Typography>
                <Typography className='text-neutral-600 flex gap-2 font-light'>
                    You can only invite 2 members in a Free plan account.
                    <span className='text-primary-500-main font-normal'>
                        upgrade plan.
                    </span>
                </Typography>
            </div>
            <Form {...formAdding}>
                <form onSubmit={formAdding.handleSubmit(submit)} className='w-full'>
                    <div className='flex flex-row gap-3 items-start w-full justify-between'>
                        <RHFInputField
                            name='email'
                            formLabel='Email'
                            formLabelProps={{
                                className: 'text-neutral-600'
                            }}
                            inputProps={{
                                placeholder: 'Enter email address',
                                className: 'h-10'
                            }}
                            formItemProps={{
                                className: 'w-full',
                            }}
                        />
                        <DropdownMenu >
                            <DropdownMenuTrigger className='flex flex-col gap-3 py-2'>
                                <FormLabel className='text-neutral-600'>Role</FormLabel>
                                <Button
                                    endIcon={<ChevronDown className='h-4 w-4' />}
                                    shape={'square'}
                                    type='button'
                                    disabled={formAdding.formState.isSubmitting}
                                    color={'default'}
                                    size={'xs'}>
                                    {formAdding.watch('role') || 'Member'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {items.map(option => (
                                    <DropdownMenuItem key={option.name} onSelect={() => {
                                        formAdding.setValue('role', option.name)
                                    }}
                                        className='flex flex-row gap-2 text-neutral-600'>
                                        {option.icon}
                                        {option.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className='flex flex-col gap-3 py-2'>
                            <FormLabel className='text-neutral-600 invisible'>Invite</FormLabel>
                            <Button
                                color="secondary"
                                shape="square"
                                type="submit"

                                loading={formAdding.formState.isSubmitting}
                                endIcon={<Plus className="h-4 w-4 mr-1" />}
                                className='h-10'
                            >
                                Invite
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
            <div className='w-full flex flex-row gap-3 p-3 bg-primary-100 items-center rounded-[12px]'>
                <Avatar src={space?.avatar || '/avatar.png'}
                    alt='avatar' className='size-[88px] cursor-pointer p-0' />
                <div className='w-full flex flex-col gap-1'>
                    <Typography className='text-neutral-800 text-[18px] font-semibold'>
                        {space?.name}
                    </Typography>
                    <Typography className='text-neutral-600 font-normal'>
                        {space?.members?.length} members
                    </Typography>
                </div>
            </div>
            <DataTable
                columns={membersColumns} data={invitedMembers} />
        </section>
    )
}

export default InviteMembers