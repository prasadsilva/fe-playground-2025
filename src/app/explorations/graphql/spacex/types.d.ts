export interface Rocket {
    rocket_name: string,
}

export interface Links {
    video_link: string,
    flickr_images: string,
}

export interface LaunchDetails {
    id: string,
    mission_name: string,
    details: string,
    launch_date_utc: string,
    rocket: Rocket,
    links: Links,
}

export interface LaunchInfo {
    id: string,
    mission_name: string,
    launch_date_utc: string,
}

export interface Launches {
    launches: LaunchInfo[]
}