import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("apidocs", "routes/apidocs.tsx")
] satisfies RouteConfig;
