import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <Button variant="outline" size="icon_sm" onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>
            {theme == "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}