export interface Rocket {
    rocket_name: string,
}

export interface Links {
    video_link: string,
    flickr_images: string,
}

export interface Launch {
    id: string,
    launch_year: string,
    mission_name: string,
    details: string,
    launch_date_utc: string,
    rocket: Rocket,
    links: Links,
}

export interface Launches {
    launches: Launch[]
}