import { Home, Info, type LucideIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarLink {
    title: string,
    url: string,
    icon: LucideIcon
}

interface SidebarGroup {
    title: string,
    links: SidebarLink[]
}

const groups: SidebarGroup[] = [
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
    }
]

export function AppSidebar() {
    return (
        <Sidebar className="p-3 bg-sidebar">
            <SidebarHeader>FE Playground 2025</SidebarHeader>
            <SidebarContent>
                {groups.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.links.map((link) => (
                                    <SidebarMenuItem key={link.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={link.url}>
                                                <link.icon />
                                                <span>{link.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <ThemeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}