import { type Row } from "@tanstack/react-table"
import type { Launch } from "./types"
import { useLaunchesQuery, useUnboundedPageIndex } from "./hooks"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { LAUNCHES_TABLE_COLUMNS, LAUNCHES_TABLE_PAGE_SIZE } from "./constants"

export function LaunchesDataTable() {
    const navigate = useNavigate()
    const { pageIndex, decrementPageIndex, incrementPageIndex } = useUnboundedPageIndex();
    const { loading, error, data } = useLaunchesQuery(LAUNCHES_TABLE_PAGE_SIZE, LAUNCHES_TABLE_PAGE_SIZE * pageIndex)

    const controlsDisabled = loading || !data;
    const prevButtonDisabled = controlsDisabled || pageIndex === 0;
    const nextButtonDisabled = controlsDisabled || data.launches.length < LAUNCHES_TABLE_PAGE_SIZE;

    const handleRowClick = useCallback((row: Row<Launch>) => {
        console.log(`Clicked on ${row.original.id} - ${row.original.mission_name}`)
        navigate({
            to: '/explorations/graphql/spacex/launch/$launchId',
            params: { launchId: row.original.id }
        })
    }, []);

    if (error) return <div>Error : {error.message}</div>
    return (
        <>
            <div className="flex flex-row gap-2 pb-2">
                <Button disabled={prevButtonDisabled} onClick={decrementPageIndex} className={prevButtonDisabled ? "cursor-default" : "cursor-pointer"}>Previous</Button>
                <Button disabled={nextButtonDisabled} onClick={incrementPageIndex} className={nextButtonDisabled ? "cursor-default" : "cursor-pointer"}>Next</Button>
            </div>
            {
                loading ?
                    <Skeleton className="w-full h-[400px]" /> :
                    <DataTable columns={LAUNCHES_TABLE_COLUMNS} data={data ? data.launches : []} onRowClick={handleRowClick} />

            }
        </>
    )
}