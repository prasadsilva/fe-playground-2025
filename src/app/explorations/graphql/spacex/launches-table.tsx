import { type ColumnDef } from "@tanstack/react-table"
import type { Launch } from "./types"
import { useLaunchesQuery } from "./hooks"
import { DataTable } from "@/components/ui/data-table"

const columns: ColumnDef<Launch>[] = [
    {
        accessorKey: "mission_name",
        header: "Mission Name"
    },
    {
        accessorKey: "details",
        header: "Details"
    }
]

export function LaunchesDataTable() {
    const { loading, error, data } = useLaunchesQuery()

    if (loading || !data) return <div>Loading...</div>
    if (error) return <div>Error : {error.message}</div>

    // TODO: Remove
    console.log(data);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data.launches} />
        </div>
    )
}