import { LaunchesDataTable } from '@/app/explorations/graphql/spacex/launches-table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explorations/graphql/spacex/')({
    component: LaunchesDataTable,
})
