import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/landing.tsx"),
    route("apidocs", "routes/apidocs.tsx"),
    route("auth", "routes/auth.tsx"),

    layout("layouts/AuthGuardLayout.tsx", [
        ...prefix("dashboard", [
            index("routes/dashboard/dashboard.tsx"),
            route("volunteer", "routes/dashboard/volunteer.tsx"),
            route("manager", "routes/dashboard/manager.tsx")
        ])
    ])
] satisfies RouteConfig;
