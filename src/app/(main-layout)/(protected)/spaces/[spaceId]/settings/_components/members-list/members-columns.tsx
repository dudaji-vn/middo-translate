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

export const membersColumns = ({ onDelete, onResendInvitation, isOwner, isLoading }: {
    onDelete: (member: Member) => void,
    onResendInvitation: (member: Member) => void,
    isOwner: (email: string) => boolean,
    isLoading: Record<string, boolean>
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
            return <div className="flex flex-row items-center break-words h-auto min-w-fit sm:w-[400px] md:min-w-[500px] xl:min-w-[800px] gap-1">
                <Typography className="text-neutral-800">{props.getValue() as string}</Typography>
                {isOwner(props.row.original.email) && <span className="text-neutral-500">(you)</span>}
            </div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell(props) {
            return <div className="flex flex-row items-center  w-fit  gap-6">
                <Typography className={cn('text-gray-500 w-[100px] capitalize',
                    props.getValue() === 'joined' && 'text-primary-500-main',
                    props.getValue() === 'invited' && 'text-success-500-main'
                )} >
                    {props.getValue() as string}
                </Typography >
                <Button
                    className={isOwner(props.row.original.email) || props.row.original.status === 'joined' ? 'invisible' : "text-neutral-500"}
                    startIcon={<RotateCcw className="text-neutral-500" />}
                    size={'xs'}
                    shape={'square'}
                    color={'default'}
                    disabled={isLoading[props.row.original.email]}
                    onClick={() => onResendInvitation(props.row.original as Member)}>
                    Resend
                </Button>
            </div>

        },
    },
    {
        accessorKey: "actions",
        header: "",
        cell(props) {
            const { email, status } = props.row.original || {};
            const deleteAble = !isOwner(email) && status !== 'deleted' && !isLoading[email];
            return <div className="flex gap-2  min-w-10 px-2">
                <Button.Icon size={'xs'}
                    className={deleteAble ? '' : 'invisible'}
                    disabled={!deleteAble}
                    color={'default'}
                    onClick={() => onDelete(props.row.original as Member)}
                >
                    <Trash2 className="text-error" />
                </Button.Icon>
            </div>
        }
    }

] as ColumnDef<Member>[]

