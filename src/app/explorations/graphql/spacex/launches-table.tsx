import { type ColumnDef } from "@tanstack/react-table"
import type { Launch } from "./types"
import { useLaunchesQuery } from "./hooks"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

const columns: ColumnDef<Launch>[] = [
    {
        accessorKey: "launch_date_utc",
        header: "Launch Date",
        cell: ({ row }) => {
            return <div>{format(row.getValue("launch_date_utc"), "yyyy-MM-dd")}</div>
        }
    },
    {
        accessorKey: "launch_date_utc",
        header: "Launch Time (Local)",
        cell: ({ row }) => {
            return <div>{format(row.getValue("launch_date_utc"), "p")}</div>
        }
    },
    {
        accessorKey: "mission_name",
        header: "Mission Name",
        cell: ({ row }) => {
            return <div>{row.getValue("mission_name")}</div>
        }
    }
]

export function LaunchesDataTable() {
    const { loading, error, data } = useLaunchesQuery()

    if (error) return <div>Error : {error.message}</div>

    return (
        loading ?
            <Skeleton className="w-full h-[200px]" /> :
            <DataTable columns={columns} data={data ? data.launches : []} />
    )
}