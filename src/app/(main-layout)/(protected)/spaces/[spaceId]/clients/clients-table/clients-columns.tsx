"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client } from "../page"

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

