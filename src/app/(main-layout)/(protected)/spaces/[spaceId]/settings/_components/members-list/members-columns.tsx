"use client"

import { Button } from "@/components/actions";
import { Typography } from "@/components/data-display";
import { cn } from "@/utils/cn";
import { ColumnDef } from "@tanstack/react-table"
import { RotateCcw, Trash2 } from "lucide-react";
import { ESpaceMemberRole } from "../../../_components/spaces-crud/sections/invite-section";

export type Member = {
    email: string;
    role: string;
    status?: 'joined' | 'invited';
}

export const membersColumns = ({ onDelete, onResendInvitation }: {
    onDelete: (member: Member) => void,
    onResendInvitation: (member: Member) => void
}) => [

    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell(props) {
            return <div className="flex flex-row items-center  gap-6">
                <Typography className={cn('text-gray-500 capitalize',
                    props.getValue() === 'joined' && 'text-primary-500-main',
                    props.getValue() === 'invited' && 'text-success-500-main'
                )} >
                    {props.getValue() as string}
                </Typography >
                {props.row.original.status === 'invited' ?
                    <Button
                        className="text-neutral-500"
                        startIcon={<RotateCcw className="text-neutral-500" />}
                        size={'xs'}
                        shape={'square'}
                        color={'default'}
                        onClick={() => onResendInvitation(props.row.original as Member)}>
                        Resend
                    </Button> : null}
            </div>

        },
    },
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

