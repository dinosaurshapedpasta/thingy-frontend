import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/landing.tsx"),
    route("apidocs", "routes/apidocs.tsx"),
    route("auth", "routes/auth.tsx"),

    layout("layouts/AuthGuardLayout.tsx", [

    ])
] satisfies RouteConfig;
