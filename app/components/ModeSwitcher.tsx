import { DarkModeRounded, LightModeOutlined } from "@mui/icons-material";
import { IconButton, Tooltip, useColorScheme, type IconButtonProps } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";

export const ModeSwitcher = ({ onClick, ...other }: IconButtonProps): ReactNode => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Tooltip
            title={`switch to ${mode == "light" ? "dark" : "light"} mode`}
            enterDelay={200}
            arrow
        >
            <IconButton
                aria-label="toggle light/dark mode"
                size="medium"
                disabled={!mounted}
                onClick={e => {
                    setMode(mode == "light" ? "dark" : "light");
                    onClick?.(e);
                }}
                {...other}
            >
                {mode == "light" ? <DarkModeRounded /> : <LightModeOutlined />}
            </IconButton>
        </Tooltip>
    );
};
