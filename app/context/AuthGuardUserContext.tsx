import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserObject } from "~/managers/APIManager";

export type AuthGuardUserContextValue = {
    me: UserObject;
    setMe: Dispatch<SetStateAction<UserObject | undefined>>;
};

export const AuthGuardUserContext = createContext<AuthGuardUserContextValue | undefined>(undefined);
