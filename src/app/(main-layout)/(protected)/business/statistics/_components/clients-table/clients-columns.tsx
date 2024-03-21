"use client"

import { User } from "@/features/users/types"
import { ColumnDef } from "@tanstack/react-table"

export type Client = Pick<User, "_id" | "email" | "name" | "phoneNumber"> & {
    firstConnectDate: string
    lastConnectDate: string
}

export const clientsColumns: ColumnDef<Client>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        accessorKey: "firstConnectDate",
        header: "First Connect Date",
    },
    {
        accessorKey: "lastConnectDate",
        header: "Last Connect Date",
    },
]

