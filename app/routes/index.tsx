import type { ReactNode } from "react";
import type { Route } from "./+types/index";
import { getDefaultMeta } from "~/util/defaultMeta";
import { Stack, Typography } from "@mui/material";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta({
        title: "thingy thing"
    });
}

export default function Index(): ReactNode {
    return (
        <Stack
            direction="column"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            sx={{
                px: 2
            }}
        >

        </Stack>
    );
}
