// components/ThemeSwitcher.js
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = (checked) => {
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <div>
            <Switch
                onValueChange={handleThemeChange}
                color="default"
                size="sm"
                thumbIcon={({isSelected}) =>
                    isSelected ? "🌕" : "☀️"
                }
            />
        </div>
    )
};