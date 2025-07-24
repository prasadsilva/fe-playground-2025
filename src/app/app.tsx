import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/components/theme-provider";

export function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <SidebarProvider>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        <Outlet />
                        {/* <TanStackRouterDevtools /> */}
                    </main>
                </SidebarProvider>
            </ThemeProvider>
        </>
    )
}