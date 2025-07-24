import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <NavigationMenu viewport>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/">
                                Home
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/about">
                                About
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    )
})