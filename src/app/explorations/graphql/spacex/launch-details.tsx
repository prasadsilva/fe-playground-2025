import { Skeleton } from "@/components/ui/skeleton";
import { useLaunchDetailsQuery } from "./hooks"

interface LaunchDetailsProps {
    launchId: string
}

export function LaunchDetails({ launchId }: LaunchDetailsProps) {
    const { loading, error, data } = useLaunchDetailsQuery(launchId)

    if (error) return <div>Not Found</div>

    console.log(data);
    return loading ?
        <Skeleton className="w-full h-[400px]" /> :
        <div>Hello "/explorations/graphql/spacex/launch/$id" ({launchId})!</div>
}