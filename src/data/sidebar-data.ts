import { Home, Info, Rocket, type LucideIcon } from "lucide-react"

interface SidebarLink {
    title: string,
    url: string,
    icon: LucideIcon
}

interface SidebarGroup {
    title: string,
    links: SidebarLink[]
}

export const sidebarGroups: SidebarGroup[] = [
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
        title: 'Projects',
        links: [
            {
                title: "SpaceX Launches",
                url: "/projects/spacex",
                icon: Rocket
            }
        ]
    }
]
