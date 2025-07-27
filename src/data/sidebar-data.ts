import { Home, Info, Rocket, type LucideIcon } from "lucide-react"

export interface SidebarLinkData {
    title: string,
    url: string,
    icon: LucideIcon
}

export interface SidebarMenuData {
    title: string,
    links?: SidebarLinkData[]
}

export const sidebarMenuData: SidebarMenuData[] = [
    {
        title: 'General',
        links: [
            {
                title: "Home",
                url: "/",
                icon: Home
            },
            {
                title: "About",
                url: "/about",
                icon: Info
            }
        ]
    },
    {
        title: 'GraphQL',
        links: [
            {
                title: "SpaceX Launches",
                url: "/explorations/graphql/spacex",
                icon: Rocket
            }
        ]
    }
]
