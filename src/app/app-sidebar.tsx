import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { sidebarMenuData, type SidebarLinkData } from "@/data/sidebar-data"

interface AppSidebarLinkProps {
    link: SidebarLinkData
}
export function AppSidebarMenuLink({ link }: AppSidebarLinkProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link to={link.url}>
                    <link.icon />
                    <span>{link.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function AppSidebar() {
    return (
        <Sidebar className="p-3 bg-sidebar">
            <SidebarHeader>FE Playground 2025</SidebarHeader>
            <SidebarContent>
                {sidebarMenuData.map((menu) => (
                    <SidebarGroup key={menu.title}>
                        <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menu.links && menu.links.map((link) => <AppSidebarMenuLink key={link.title} link={link} />)}
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