import { getDefaultMeta } from "~/util/defaultMeta";
import type { Route } from "./+types/volunteer";
import type { ReactNode } from "react";
import { Typography } from "@mui/material";
import { VolunteerDashboard } from "~/pages/VolunteerDashboard";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta({
        title: "you logged into the thing"
    });
}

export default function Volunteer(): ReactNode {
    return (
        <VolunteerDashboard />
    );
}
