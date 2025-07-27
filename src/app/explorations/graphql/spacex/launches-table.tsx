import { type ColumnDef } from "@tanstack/react-table"
import type { Launch } from "./types"
import { useLaunchesQuery } from "./hooks"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"

const columns: ColumnDef<Launch>[] = [
    {
        accessorKey: "mission_name",
        header: "Mission Name",
        cell: ({ row }) => {
            return <div className="whitespace-nowrap">{row.getValue("mission_name")}</div>
        }
    },
    {
        accessorKey: "details",
        header: "Details"
    }
]

export function LaunchesDataTable() {
    const { loading, error, data } = useLaunchesQuery()

    if (error) return <div>Error : {error.message}</div>

    return (
        loading ?
            <Skeleton className="min-w-full h-[200px]" /> :
            <DataTable columns={columns} data={data ? data.launches : []} />
    )
}