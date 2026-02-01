import { useEffect, type ReactNode } from "react";
import type { Route } from "./+types/landing";
import { getDefaultMeta } from "~/util/defaultMeta";
import { Button, Stack, Typography } from "@mui/material";
import { APIManager } from "~/managers/APIManager";
import { ModeSwitcher } from "~/components/ModeSwitcher";
import { ArrowForwardRounded } from "@mui/icons-material";
import { useNavigate } from "react-router";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta({
        title: "thingy thing"
    });
}

export default function Landing(): ReactNode {
    const navigate = useNavigate();

    return (
        <Stack
            direction="column"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{
                px: 2
            }}
        >
            <Typography
                variant="h1"
            >
                THIS IS A LANDING PAGE
            </Typography>
            <Typography>
                trust me
            </Typography>
            <Button
                endIcon={
                    <ArrowForwardRounded />
                }
                variant="contained"
                onClick={e => {
                    navigate("/auth");
                }}
            >
                go
            </Button>
            <ModeSwitcher
                sx={{
                    mt: 1
                }}
            />
        </Stack>
    );
}
