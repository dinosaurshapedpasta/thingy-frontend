import { getDefaultMeta } from "~/util/defaultMeta";
import type { Route } from "./+types/auth";
import type { ReactNode } from "react";
import { AuthPage } from "~/pages/AuthPage";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta({
        title: "log in to the thing"
    });
}

export default function Auth(): ReactNode {
    return (
        <AuthPage />
    );
}
