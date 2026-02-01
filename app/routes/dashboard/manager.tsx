import { getDefaultMeta } from "~/util/defaultMeta";
import type { Route } from "./+types/manager";
import type { ReactNode } from "react";
import { Typography } from "@mui/material";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta({
        title: "you logged into the thing"
    });
}

export default function Manager(): ReactNode {
    return (
        <Typography>
            manager dashboard
        </Typography>
    );
}
