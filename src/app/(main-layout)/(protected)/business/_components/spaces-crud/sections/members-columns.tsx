"use client"

import { Typography } from "@/components/data-display";
import { cn } from "@/utils/cn";
import { ColumnDef } from "@tanstack/react-table"

export type Member = {
    email: string;
    role: string;
    status?: 'joined' | 'invited';
}

export const membersColumns: ColumnDef<Member>[] = [

    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell(props) {
            return <Typography className={cn('text-gray-500',
                props.getValue() === 'joined' && 'text-primary-500-main',
                props.getValue() === 'invited' && 'text-success-500-main'
            )} >
                {props.getValue() as string}
            </Typography >

        },
    }

]

