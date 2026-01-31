import { getDefaultMeta } from "~/util/defaultMeta";
import type { Route } from "./+types/apidocs";
import type { ReactNode } from "react";
// @ts-ignore
import SwaggerUI from "swagger-ui-react";

import "swagger-ui-react/swagger-ui.css";
import { CssBaseline } from "@mui/material";

export function meta(): Route.MetaDescriptors {
    return getDefaultMeta();
}

export default function Swagger(): ReactNode {
    return (
        <CssBaseline>
            <SwaggerUI
                url="/assets/specification.json"
            />
        </CssBaseline>
    );
}
