import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { sidebarGroups } from "@/data/sidebar-data"

export function AppSidebar() {
    return (
        <Sidebar className="p-3 bg-sidebar">
            <SidebarHeader>FE Playground 2025</SidebarHeader>
            <SidebarContent>
                {sidebarGroups.map((group) => (
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