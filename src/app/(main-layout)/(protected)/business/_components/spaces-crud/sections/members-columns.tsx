"use client"

import { Button } from "@/components/actions";
import { Typography } from "@/components/data-display";
import { cn } from "@/utils/cn";
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react";

export type Member = {
    email: string;
    role: string;
    status?: 'joined' | 'invited';
}

export const membersColumns = ({ onDelete }: {
    onDelete: (member: Member) => void
}) => [

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
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell(props) {
            return <div className="flex gap-2">
                <Button.Icon size={'xs'} color={'default'}
                    onClick={() => onDelete(props.row.original as Member)}
                >
                    <Trash2 className="text-error" />
                </Button.Icon>
            </div>
        }
    }

] as ColumnDef<Member>[]

