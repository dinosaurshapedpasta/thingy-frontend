import { APIManager, UserType } from "~/managers/APIManager";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";
import type { ReactNode } from "react";

export async function clientLoader({ }: Route.ClientLoaderArgs) {
    let me = await APIManager.User.me();

    if (!me) {
        return redirect("/auth?error=invalid key");
    }

    switch (me?.userType) {
        case UserType.Manager:
            return redirect("/dashboard/manager");
        case UserType.Volunteer:
            return redirect("/dashboard/volunteer");
    }
}

export default function Dashboard(): ReactNode {
    return (
        <></>
    );
}
