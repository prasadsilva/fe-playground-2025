import { gql, useQuery } from "@apollo/client";
import type { Launches } from "./types";

export const GET_LAUNCHES = gql`
    query GetLaunches($limit: Int!, $offset: Int!) {
        launches(limit: $limit, offset: $offset) {
            id
            launch_year
            mission_name
            details
            launch_date_utc
            rocket {
                rocket_name
            }
            links {
                video_link
                flickr_images
            }
        }
    }
`
export function useLaunchesQuery(limit: number = 10, offset: number = 0) {
    return useQuery<Launches>(GET_LAUNCHES, { variables: { limit, offset } })
}
