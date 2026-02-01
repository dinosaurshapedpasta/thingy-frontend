import { useEffect, useState, type ReactNode } from "react";
import { Outlet, useNavigate } from "react-router";
import { AuthGuardUserContext } from "~/context/AuthGuardUserContext";
import { APIManager, UserType, type UserObject } from "~/managers/APIManager";

export default function AuthGuardLayout(): ReactNode {
    const [me, setMe] = useState<UserObject | undefined>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        APIManager.User.me().then(x => {
            if (x) setMe(x);
            else setMe({
                id: "testID",
                karma: 0,
                maxVolume: 1,
                name: "test user",
                userType: UserType.Volunteer
            });
            setLoading(false);
        }).catch(() => {
            // navigate("/auth");
        });
    }, []);

    if (loading || !me) {
        return (
            <></>
        );
    }

    return (
        <AuthGuardUserContext
            value={{
                me,
                setMe
            }}
        >
            <Outlet />
        </AuthGuardUserContext>
    );
}
