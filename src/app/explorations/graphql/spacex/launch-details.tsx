import { Skeleton } from "@/components/ui/skeleton";
import { useLaunchDetailsQuery } from "./hooks"
import type { LaunchDetails } from "./types";
import { format } from "date-fns";
import { useMemo } from "react";
import { youtubeUrlToEmbed } from "./utils";

interface LaunchDetailsViewProps {
    details?: LaunchDetails
}

function LaunchDetailsView({ details }: LaunchDetailsViewProps) {
    if (!details) {
        return <div>No details available.</div>
    }

    const embedVideoLink = useMemo(
        () => youtubeUrlToEmbed(details.links.video_link),
        [details.links.video_link]
    )

    return (
        <div>
            <div>Name: {details.mission_name}</div>
            <div>Launch Date: {format(details.launch_date_utc, "yyyy-MM-dd")}</div>
            <div>Launch Time (Local): {format(details.launch_date_utc, "p")}</div>
            <div>Details: {details.details}</div>
            <div>Rocket: {details.rocket.rocket_name}</div>
            <div>
                <div>Video:</div>
                {
                    embedVideoLink ?
                        <iframe id="ytplayer"
                            width="640"
                            height="360"
                            src={embedVideoLink}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen /> :
                        <div>None</div>
                }
            </div>
            <div>
                <div>Photos:</div>
                <div className="flex flex-row flex-wrap gap-2">
                    {details.links.flickr_images.map((image) => <div key={image} className="w-[200px] h-auto"><img src={image} /></div>)}
                </div>
            </div>
        </div>
    )
}

interface LaunchDetailsProps {
    launchId: string
}

export function LaunchDetails({ launchId }: LaunchDetailsProps) {
    const { loading, error, data } = useLaunchDetailsQuery(launchId)

    if (error) return <div>Not Found</div>

    return loading ?
        <Skeleton className="w-full h-[400px]" /> :
        <LaunchDetailsView details={data && data.launch} />
}