import type { ColumnDef } from "@tanstack/react-table"
import type { LaunchInfo } from "./types"
import { format } from "date-fns"

export const LAUNCHES_TABLE_COLUMNS: ColumnDef<LaunchInfo>[] = [
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
    }
]

export const LAUNCHES_TABLE_PAGE_SIZE = 10