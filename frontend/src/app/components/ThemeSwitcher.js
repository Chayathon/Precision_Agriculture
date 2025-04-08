import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { HiSun, HiMoon } from "react-icons/hi2";

export const ThemeSwitcher = ({size}) => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    const isDark = theme === 'dark';

    const handleThemeChange = (checked) => {
        setTheme(checked ? 'dark' : 'light');
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) return null;

    return (
        <div>
            <Switch
                isSelected={isDark}
                onValueChange={handleThemeChange}
                color="default"
                size={size}
                thumbIcon={({isSelected, className}) =>
                    isSelected ? <HiMoon className={className} /> : <HiSun className={className} />
                }
            />
        </div>
    )
};