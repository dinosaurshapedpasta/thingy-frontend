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
            <Typography
                variant="h1"
                align="center"
            >
                OMG IT'S A TEST PAGEEEE
            </Typography>
            <Typography
                align="center"
            >
                yeah if you can see this in the center of the page that means things are working
            </Typography>
            <img
                src="https://ichack.org/favicon.ico"
                style={{
                    height: 64,
                    marginTop: 32
                }}
            />
        </Stack>
    );
}
