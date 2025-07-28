import { SpaceX } from '@/app/explorations/graphql/spacex/spacex'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explorations/graphql/spacex')({
    component: SpaceX,
})
