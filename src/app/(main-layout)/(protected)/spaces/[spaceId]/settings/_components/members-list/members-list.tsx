import { DataTable, DataTableProps } from '@/components/ui/data-table'
import React, { useMemo } from 'react'
import { Member, membersColumns } from './members-columns'
import { Typography } from '@/components/data-display'
import { Search, UserCog, UserRound } from 'lucide-react'
import { removeMemberFromSpace, resendInvitation } from '@/services/business-space.service'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import TableSearch from '../../../statistics/_components/clients-table/table-search'


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
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({})
    const [search, setSearch] = React.useState('');
    const params = useParams();
    const router = useRouter();
    const onSearchChange = (search: string) => {
        setSearch(search.trim());
    }
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
    const memberTableBaseProps: Omit<DataTableProps<
        Member,
        keyof Member
    >, 'data'> = {
        tableHeadProps: {
            className: 'bg-transparent px-0 font-light'
        },
        rowProps: {
            className: 'rounded-full odd:bg-white even:bg-white p-0'
        },
        cellProps: {
            className: 'p-0 py-3'
        },
        columns: membersColumns({
            onDelete: onDelete,
            onResendInvitation: onResendInvitation,
            isOwner: (email) => {
                return email === owner.email
            },
            isLoading,
        })

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


    return (<section className='flex flex-col gap-5 w-full items-end [&_div]:w-full'>
        <div className='!w-96 relative'>
            <TableSearch
                className='py-2 min-h-12 w-full outline-neutral-100'
                onSearch={onSearchChange}
                search={search} />
            <Search size={16} className='text-neutral-700 stroke-[3px] absolute top-1/2 right-3 transform -translate-y-1/2' />
        </div>
        <div>
            <div className='w-full p-2 flex flex-row gap-3 items-center font-semibold bg-[#fafafa]'>
                <UserCog size={16} className='text-primary-500-main stroke-[3px]' />
                <Typography className='text-primary-500-main '>
                    Admin role
                </Typography>
            </div>
            <DataTable
                {...memberTableBaseProps}
                data={adminsData}
            />
        </div>
        <div>
            <div className='w-full  p-2 flex flex-row  gap-3 items-center font-semibold  bg-[#fafafa]'>
                <UserRound size={16} className='text-primary-500-main stroke-[3px]' />
                <Typography className='text-primary-500-main'>
                    Member role
                </Typography>
            </div>
            <DataTable
                {...memberTableBaseProps}
                data={membersData}
            />
        </div>
    </section>
    )
}

export default MembersList