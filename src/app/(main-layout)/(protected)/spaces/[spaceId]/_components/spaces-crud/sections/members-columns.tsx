"use client"

import { Button } from "@/components/actions";
import { Typography } from "@/components/data-display";
import { cn } from "@/utils/cn";
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react";
import { ESpaceMemberRole } from "./invite-section";

export type Member = {
    email: string;
    role: string;
    status?: 'joined' | 'invited' | 'deleted';
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
        cell(props) {
            return <Typography className={cn('text-gray-500 capitalize',
                props.getValue() === ESpaceMemberRole.Admin && 'text-primary-500-main',
            )} >
                {props.getValue() as string}
            </Typography >
        }
    },
    // {
    //     accessorKey: "status",
    //     header: "Status",
    //     cell(props) {
    //         return <Typography className={cn('text-gray-500 capitalize',
    //             props.getValue() === 'joined' && 'text-primary-500-main',
    //             props.getValue() === 'invited' && 'text-success-700'
    //         )} >
    //             {props.getValue() as string}
    //         </Typography >

    //     },
    // },
    {
        accessorKey: "actions",
        header: "",
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

