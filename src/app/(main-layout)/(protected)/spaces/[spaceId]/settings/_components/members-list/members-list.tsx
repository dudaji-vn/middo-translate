
import React, { useMemo } from 'react'
import { Typography } from '@/components/data-display'
import { GripVertical, RotateCcw, Search, Trash2, UserCog, UserRound } from 'lucide-react'
import { removeMemberFromSpace, resendInvitation } from '@/services/business-space.service'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import TableSearch from '../../../statistics/_components/clients-table/table-search'
import { cn } from '@/utils/cn'
import { Button } from '@/components/actions'
import { isEmpty } from 'lodash'
import { useAuthStore } from '@/stores/auth.store'
import { Member } from '../../../_components/spaces-crud/sections/members-columns'

type MemberItemProps = {
    isOwner: boolean;
    isAdmin: boolean;
    isLoading?: boolean;
    onDelete: (member: Member) => void;
    onResendInvitation: (member: Member) => void;
} & Member & React.HTMLAttributes<HTMLDivElement>
const MemberItem = ({ role, isOwner, email, status, isAdmin, isLoading, onResendInvitation, onDelete, ...props }: MemberItemProps) => {
    const currentUser = useAuthStore((state) => state.user);
    const deleteAble = !isOwner && !isLoading && (isAdmin || currentUser?.email !== email);
    return (<div className='w-full flex justify-between flex-row items-center bg-primary-100 py-1 rounded-[12px]' {...props}>
        <div className='w-full flex justify-start flex-row items-center'>
            <div className="flex rounded-l-[12px] px-3 justify-start flex-row items-center break-words h-auto w-[400px] md:w-[500px] xl:w-[800px]">
                <Typography className="text-neutral-800">{email}</Typography>
                {isOwner && <span className="text-neutral-500 font-light pl-3">(You)</span>}
            </div>
            <div className="flex flex-row items-center justify-start  w-fit  gap-6 py-1">
                <Typography className={cn('text-gray-500 w-[100px] capitalize',
                    status === 'joined' && 'text-primary-500-main',
                    status === 'invited' && 'text-success-700'
                )} >
                    {status}
                </Typography >
                <Button
                    className={isOwner || status === 'joined' ? 'invisible' : "text-neutral-500"}
                    startIcon={<RotateCcw className="text-neutral-500" />}
                    size={'xs'}
                    shape={'square'}
                    color={'default'}
                    loading={isLoading}
                    onClick={() => onResendInvitation({
                        email,
                        role,
                        status
                    })}>

                    Resend
                </Button>
            </div>
        </div >
        <div className="min-w-10 px-4">
            <Button.Icon size={'xs'}
                className={deleteAble ? '' : 'invisible'}
                disabled={!deleteAble}
                color={'default'}
                onClick={() => onDelete({
                    email,
                    role,
                    status
                })}
            >
                <Trash2 className="text-error" />
            </Button.Icon>
        </div>
    </div>
    )

}

const ListItems = ({ data, owner, isAdmin = false, ...props }: {
    isAdmin?: boolean;
    data: Member[];
    owner: {
        _id: string;
        email: string;
    }
} & React.HTMLAttributes<HTMLDivElement>) => {
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({})
    const params = useParams();
    const router = useRouter();
    const onDelete = async (member: Member) => {
        setIsLoading(prev => ({
            ...prev,
            [member.email]: true
        }))
        try {
            const res = await removeMemberFromSpace({
                spaceId: params?.spaceId as string,
                email: member.email
            }).finally(() => {
                setIsLoading(prev => ({
                    ...prev,
                    [member.email]: false
                }))
            })
            if (res.data) {
                toast.success('Member removed successfully')
                router.refresh();
                return;
            }
        }
        catch (error) {
            console.error('Error on DeleteMember:', error)
            toast.error('Error on Delete member')
        }


    }
    const onResendInvitation = async (member: Member) => {
        setIsLoading(prev => ({
            ...prev,
            [member.email]: true
        }))
        try {
            const res = await resendInvitation({
                email: member.email,
                spaceId: params?.spaceId as string,
                role: member.role
            }).finally(() => {
                setIsLoading(prev => ({
                    ...prev,
                    [member.email]: false
                }))
            })
            toast.success('Invitation resent successfully')
            router.refresh();
        } catch (error) {
            console.error('Error on ResendInvitation:', error)
            toast.error('Error on Resend invitation')
        }
        setIsLoading(prev => ({
            ...prev,
            [member.email]: false
        }))
    }
    const isEmptyData = isEmpty(data);

    return (
        <div className='md:min-w-[400px] overflow-x-auto pr-10 flex flex-col gap-1'>
            <p className={cn('text-neutral-500 font-light text-sm italic w-full text-center py-1', !isEmptyData && "hidden")}>No members</p>
            <div className={cn('w-full py-2 flex justify-start flex-row items-center ', isEmptyData && "hidden")}>
                <div className='!w-[50px] invisible'>
                </div>
                <div className="flex  px-3 justify-start flex-row items-center break-words h-auto w-[400px] md:w-[500px] xl:w-[800px]">

                    <Typography className="text-neutral-800  text-sm font-light">Email</Typography>
                </div>
                <Typography className={cn('text-gray-500 w-[100px] capitalize text-sm font-light')} >
                    status
                </Typography >
            </div>
            {data.map((member, index) => {
                return <div className='w-full grid grid-cols-[48px_auto]' key={member.email}>
                    <div className='!w-fit p-1 py-2 bg-white '>
                        <Button.Icon size={'xs'} shape={'square'} variant={'ghost'} color={'default'}>
                            <GripVertical className='stroke-neutral-500 fill-neutral-500' />
                        </Button.Icon>
                    </div>
                    <MemberItem
                        {...member}
                        isAdmin={isAdmin}
                        isOwner={member.email === owner.email}
                        onResendInvitation={onResendInvitation}
                        onDelete={onDelete}
                        isLoading={isLoading[member.email]}
                        {...props}
                    />
                </div>
            })}
        </div >
    )

}

const MembersList = ({
    members,
    owner
}: {
    members: Member[],
    owner: {
        _id: string;
        email: string;
    }
}) => {
    const [search, setSearch] = React.useState('');

    const onSearchChange = (search: string) => {
        setSearch(search.trim());
    }

    const { adminsData, membersData } = useMemo(() => {

        const filteredMembers = search ? members.filter(member => {
            return member.email.toLowerCase().includes(search.toLowerCase()) || member.role.toLowerCase().includes(search.toLowerCase())
        }) : members;
        return filteredMembers.reduce((acc, member: Member) => {
            if (member.role === 'admin') {
                acc.adminsData.push(member)
            } else {
                acc.membersData.push(member)
            }
            return acc
        }, {
            adminsData: [] as Member[],
            membersData: [] as Member[]
        })
    }, [members, search])


    return (<section className='flex flex-col gap-5 w-full items-end'>
        <div className='md:w-96 w-60 relative px-4 '>
            <TableSearch
                className='py-2 min-h-[44px] w-full outline-neutral-100'
                onSearch={onSearchChange}
                search={search} />
            <Search size={16} className='text-neutral-700 stroke-[3px] absolute top-1/2 right-6 transform -translate-y-1/2' />
        </div>
        <div className='flex flex-col gap-1 w-full'>
            <div className='w-full  py-4 sm:p-[20px_40px] flex flex-row gap-3 items-center font-semibold bg-[#fafafa]'>
                <UserCog size={16} className='text-primary-500-main stroke-[3px]' />
                <Typography className='text-primary-500-main '>
                    Admin role
                </Typography>
            </div>
            <ListItems data={adminsData} owner={owner} isAdmin />
        </div>
        <div className='flex flex-col gap-1 w-full'>
            <div className='w-full py-4 sm:p-[20px_40px]  flex flex-row  gap-3 items-center font-semibold  bg-[#fafafa]'>
                <UserRound size={16} className='text-primary-500-main stroke-[3px]' />
                <Typography className='text-primary-500-main'>
                    Member role
                </Typography>
            </div>
            <ListItems data={membersData} owner={owner} />
        </div>
    </section>
    )
}

export default MembersList