import { type ColumnDef, type Row } from "@tanstack/react-table"
import type { Launch } from "./types"
import { useLaunchesQuery, useUnboundedPageIndex } from "./hooks"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"

const columns: ColumnDef<Launch>[] = [
    {
        accessorFn: (row) => format(row.launch_date_utc, "yyyy-MM-dd"),
        header: "Launch Date",
    },
    {
        accessorFn: (row) => format(row.launch_date_utc, "p"),
        header: "Launch Time (Local)",
    },
    {
        accessorKey: "mission_name",
        header: "Mission Name",
        cell: ({ row }) => {
            return <div>{row.getValue("mission_name")}</div>
        }
    }
]

const PAGE_SIZE = 10

export function LaunchesDataTable() {
    const { pageIndex, decrementPageIndex, incrementPageIndex } = useUnboundedPageIndex();
    const { loading, error, data } = useLaunchesQuery(PAGE_SIZE, PAGE_SIZE * pageIndex)

    if (error) return <div>Error : {error.message}</div>

    const disableControls = loading || !data;
    const prevButtonDisabled = disableControls || pageIndex === 0;
    const nextButtonDisabled = disableControls || data.launches.length < PAGE_SIZE;

    const handleRowClick = useCallback((row: Row<Launch>) => {
        console.log(`Clicked on ${row.original.id} - ${row.original.mission_name}`)
    }, []);

    return (
        <>
            <div className="flex flex-row gap-2 pb-2">
                <Button disabled={prevButtonDisabled} onClick={decrementPageIndex} className={prevButtonDisabled ? "cursor-default" : "cursor-pointer"}>Previous</Button>
                <Button disabled={nextButtonDisabled} onClick={incrementPageIndex} className={nextButtonDisabled ? "cursor-default" : "cursor-pointer"}>Next</Button>
            </div>
            {
                loading ?
                    <Skeleton className="w-full h-[400px]" /> :
                    <DataTable columns={columns} data={data ? data.launches : []} onRowClick={handleRowClick} />

            }
        </>
    )
}