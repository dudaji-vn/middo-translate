import { DataTable, DataTableProps } from '@/components/ui/data-table'
import React, { useMemo } from 'react'
import { Member, membersColumns } from './members-columns'
import { Typography } from '@/components/data-display'
import { UserCog, UserRound } from 'lucide-react'


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

    const onDelete = (member: Member) => {
        console.log('delete', member)
    }
    const onResendInvitation = (member: Member) => {
        console.log('resend', member)
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