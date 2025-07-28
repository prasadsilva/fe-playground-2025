import { LaunchDetails } from '@/app/explorations/graphql/spacex/launch-details';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explorations/graphql/spacex/launch/$launchId')(
    {
        component: () => {
            const { launchId } = Route.useParams();
            return <LaunchDetails launchId={launchId} />
        },
    },
)

