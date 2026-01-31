import { CssBaseline } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { Theme } from "~/theme/Theme";

export const RootNode = ({ children }: PropsWithChildren): ReactNode => {
    return (
        <Theme>
            <CssBaseline />
            {children}
        </Theme>
    );
};
