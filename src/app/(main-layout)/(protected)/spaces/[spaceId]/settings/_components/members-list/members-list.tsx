import { DataTable, DataTableProps } from '@/components/ui/data-table'
import React, { useMemo } from 'react'
import { Member, membersColumns } from './members-columns'
import { Typography } from '@/components/data-display'
import { UserCog, UserRound } from 'lucide-react'
import { removeMemberFromSpace, resendInvitation } from '@/services/business-space.service'
import { useParams } from 'next/navigation'


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
    const params = useParams();
    const onDelete = (member: Member) => {
        try {
            removeMemberFromSpace({
                spaceId: params?.spaceId as string,
                email: member.email
            })
        }
        catch (error) {
            console.error('Error on DeleteMember:', error)
        }

    }
    const onResendInvitation = async (member: Member) => {
        try {
            await resendInvitation({
                email: member.email,
                spaceId: member._id,
                role: member.role
            })
        } catch (error) {
            console.error('Error on ResendInvitation:', error)
        }

    }
    const memberTableBaseProps: Omit<DataTableProps<
        Member,
        keyof Member
    >, 'data'> = {
        tableHeadProps: {
            className: 'bg-transparent'
        },
        rowProps: {
            className: 'rounded-full odd:bg-white even:bg-white'
        },
        columns: membersColumns({
            onDelete: onDelete,
            onResendInvitation: onResendInvitation,
            isOwner: (id) => id === owner._id
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