import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explorations/graphql/spacex/launch/$launchId')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const { launchId } = Route.useParams();
    return <div>Hello "/explorations/graphql/spacex/launch/$id" ({launchId})!</div>
}
