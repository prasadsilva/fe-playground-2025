import { gql, useQuery } from "@apollo/client";
import type { Launches } from "./types";
import { useCallback, useState } from "react";

// TODO: Trim this down just to id, launch_date_utc and mission_name
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

export function useUnboundedPageIndex(initialPageIndex: number = 0) {
    const [pageIndex, setPageIndex] = useState(initialPageIndex);

    const incrementPageIndex = useCallback(() => {
        setPageIndex(pageIndex + 1);
    }, [pageIndex])

    const decrementPageIndex = useCallback(() => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        } else {
            console.warn("Attempting to decrement page index already at 0");
        }
    }, [pageIndex])

    return {
        pageIndex,
        incrementPageIndex,
        decrementPageIndex
    }
}