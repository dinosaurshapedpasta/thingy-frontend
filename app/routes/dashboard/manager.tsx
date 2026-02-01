import { getDefaultMeta } from "~/util/defaultMeta";
import type { Route } from "./+types/manager";
import type { ReactNode } from "react";
import { Typography } from "@mui/material";
import { ManagementDashboard } from "~/pages/ManagementDashboard";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta({
        title: "you logged into the thing"
    });
}

export default function Manager(): ReactNode {
    return (
        <ManagementDashboard />
    );
}
