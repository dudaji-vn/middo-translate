import { DataTable, DataTableProps } from '@/components/ui/data-table'
import React, { useMemo } from 'react'
import { Member, membersColumns } from './members-columns'
import { Typography } from '@/components/data-display'
import { UserCog, UserRound } from 'lucide-react'
import { removeMemberFromSpace, resendInvitation } from '@/services/business-space.service'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'


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
    console.log('owner', owner)
    const params = useParams();
    const router = useRouter();
    const onDelete = async (member: Member) => {
        try {
            const res = await removeMemberFromSpace({
                spaceId: params?.spaceId as string,
                email: member.email
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
        try {
            const res = await resendInvitation({
                email: member.email,
                spaceId: params?.spaceId as string,
                role: member.role
            })
            toast.success('Invitation resent successfully')
            router.refresh();

        } catch (error) {
            console.error('Error on ResendInvitation:', error)
            toast.error('Error on Resend invitation')
        }

    }
    const memberTableBaseProps: Omit<DataTableProps<
        Member,
        keyof Member
    >, 'data'> = {
        tableHeadProps: {
            className: 'bg-transparent px-0'
        },
        rowProps: {
            className: 'rounded-full odd:bg-white even:bg-white p-0'
        },
        cellProps:{
            className:'p-0 py-3'
        },
        columns: membersColumns({
            onDelete: onDelete,
            onResendInvitation: onResendInvitation,
            isOwner: (email) => {
                return email === owner.email
            }
        })

    }
    const { adminsData, membersData } = members.reduce((acc, member: Member) => {
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
    return (<>
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
    </>
    )
}

export default MembersList