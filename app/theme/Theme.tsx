import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMemo, type PropsWithChildren, type ReactNode } from "react";
import { colorSchemes, typography, shadows, shape } from "./theme";
import { surfaces } from "./customisations/surfaces";
import { navigation } from "./customisations/navigation";
import { inputs } from "./customisations/inputs";
import { feedback } from "./customisations/feedback";
import { display } from "./customisations/display";

export const Theme = ({ children }: PropsWithChildren): ReactNode => {
    const theme = useMemo(() => {
        return createTheme({
            cssVariables: {
                cssVarPrefix: "passage",
                colorSchemeSelector: "class"
            },
            colorSchemes,
            typography,
            shadows,
            shape,
            components: {
                ...surfaces,
                ...navigation,
                ...inputs,
                ...feedback,
                ...display
            }
        });
    }, []);

    return (
        <ThemeProvider
            theme={theme}
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
};
