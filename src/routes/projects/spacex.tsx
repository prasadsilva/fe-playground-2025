import { SpaceX } from '@/app/projects/spacex/spacex'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/spacex')({
    component: SpaceX,
})
