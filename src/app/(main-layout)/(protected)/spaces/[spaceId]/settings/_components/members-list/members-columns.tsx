"use client"

import { Button } from "@/components/actions";
import { Typography } from "@/components/data-display";
import { cn } from "@/utils/cn";
import { ColumnDef } from "@tanstack/react-table"
import { GripVertical, RotateCcw, Trash2 } from "lucide-react";

export type Member = {
    email: string;
    role: string;
    status?: 'joined' | 'invited' | 'deleted';
}

export const membersColumns = ({ onDelete, onResendInvitation, isOwner }: {
    onDelete: (member: Member) => void,
    onResendInvitation: (member: Member) => void,
    isOwner: (email: string) => boolean
}) => [
    {
        accessorKey: "_id",
        header: "",
        cell(props) {
            return <GripVertical className="text-neutral-500" />
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell(props) {
            return <div className="flex flex-row items-center  w-[240px] gap-1">
                <Typography className="text-neutral-800">{props.getValue() as string}</Typography>
                {isOwner(props.row.original.email) && <span className="text-neutral-500">(you)</span>}
            </div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell(props) {
            return <div className="flex flex-row items-center  w-[120px] gap-6">
                <Typography className={cn('text-gray-500 min-w-[60px] capitalize',
                    props.getValue() === 'joined' && 'text-primary-500-main',
                    props.getValue() === 'invited' && 'text-success-500-main'
                )} >
                    {props.getValue() as string}
                </Typography >
                {props.row.original.status !== 'joined' ?
                    <Button
                        className={isOwner(props.row.original.email) ? 'hidden' : "text-neutral-500"}
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
            const { email, status } = props.row.original || {};
            return <div className="flex gap-2">
                <Button.Icon size={'xs'}
                    className={isOwner(email) || (status === 'deleted')  ? 'hidden' : ''}
                    color={'default'}
                    onClick={() => onDelete(props.row.original as Member)}
                >
                    <Trash2 className="text-error" />
                </Button.Icon>
            </div>
        }
    }

] as ColumnDef<Member>[]

