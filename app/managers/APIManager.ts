import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import config from "../../config/config.json";

export enum UserType {
    Volunteer = 0,
    Manager = 1
}

export type UserObject = {
    id: string;
    name: string;
    karma: number;
    maxVolume: number;
    userType: UserType;
};

export type ItemObject = {
    id: string;
    name: string;
    volume: number;
};

export type PickupObject = {
    id: string;
    name: string;
    location: string;
};

export type StorageObject = {
    id: string;
    name: string;
    maxVolume: number;
    location: string;
};

export type PickupRequestObject = {
    id: string;
    pickupPointID: string;
};

enum ResponseType {
    Accept = "accept",
    Deny = "deny"
}

export type PickupRequestResponseObject = {
    userID: string;
    response: ResponseType;
};

export type DropOffObject = {
    id: string;
    name: string;
    location: string;
};

export class APIManager {
    static #axios?: AxiosInstance;
    static #initialised = false;

    /**
     * Initialise the API manager.
     */
    static init() {
        APIManager.#axios = axios.create({
            baseURL: config.apiLocation,
            allowAbsoluteUrls: false,
            timeout: 10000,
            headers: {
                Accept: "application/json",
                "X-Api-Key": localStorage.getItem("apiKey")
            },
            withCredentials: true
        });

        APIManager.#initialised = true;
    }

    static async request(data: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any> | undefined> {
        if (!APIManager.#initialised) APIManager.init();
        return await APIManager.#axios?.request(data);
    }

    static setKey(key: string) {
        localStorage.setItem("apiKey", key);
    }

    static async test(): Promise<Object | undefined> {
        try {
            let res = await APIManager.request({
                method: "get",
                url: "/test"
            });

            return res;
        } catch (e) {
            return false;
        }
    }

    static PickupRequest = class {
        static async getActive(): Promise<Array<PickupRequestObject> | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/pickuprequests`
                });

                if (res?.status == 200) return res.data;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async create(request: PickupRequestObject): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: `/pickuprequests`,
                    data: request
                });

                if (res?.status == 200) return res.data;
                else return false;
            } catch {
                return false;
            }
        }

        static async delete(id: string): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "delete",
                    url: `/pickuprequests/${encodeURIComponent(id)}`
                });

                if (res?.status == 200) return res.data;
                else return false;
            } catch {
                return false;
            }
        }

        static async getResponses(id: string): Promise<Array<PickupRequestResponseObject> | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/pickuprequests/${encodeURIComponent(id)}/responses`
                });

                if (res?.status == 200) return res.data;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async accept(id: string): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: `/pickuprequests/${encodeURIComponent(id)}/accept`
                });

                if (res?.status == 200) return res.data;
                else return false;
            } catch {
                return false;
            }
        }

        static async deny(id: string): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: `/pickuprequests/${encodeURIComponent(id)}/deny`
                });

                if (res?.status == 200) return res.data;
                else return false;
            } catch {
                return false;
            }
        }
    };

    static Pickup = class {
        static async get(id: string): Promise<PickupObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/pickup/${encodeURIComponent(id)}`
                });

                if (res?.status == 200) return res.data as PickupObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async patch(pickup: PickupObject): Promise<PickupObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/pickup/${encodeURIComponent(pickup.id)}`
                });

                if (res?.status == 200) return res.data as PickupObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async post(pickup: PickupObject): Promise<PickupObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: "/pickup",
                    data: pickup
                });

                if (res?.status == 200) return res.data as PickupObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async getItems(pickupID: string): Promise<Array<{ id: string; quantity: number; }> | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/pickup/${encodeURIComponent(pickupID)}/items`,
                });

                if (res?.status == 200) return res.data;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async setItemQuantity(pickupID: string, itemID: string, quantity: number): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/pickup/${pickupID}/items/${itemID}`,
                    data: {
                        quantity
                    }
                });

                if (res?.status == 200) return true;
                else return false;
            } catch {
                return false;
            }
        }
    };

    static Storage = class {
        static async get(id: string): Promise<PickupObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/pickup/${encodeURIComponent(id)}`
                });

                if (res?.status == 200) return res.data as PickupObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async patch(pickup: PickupObject): Promise<PickupObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/pickup/${encodeURIComponent(pickup.id)}`
                });

                if (res?.status == 200) return res.data as PickupObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async post(pickup: PickupObject): Promise<PickupObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: "/pickup",
                    data: pickup
                });

                if (res?.status == 200) return res.data as PickupObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }
        static async getItems(storageID: string): Promise<Array<{ id: string; quantity: number; }> | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/storage/${encodeURIComponent(storageID)}/items`,
                });

                if (res?.status == 200) return res.data;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async setItemQuantity(storageID: string, itemID: string, quantity: number): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/storage/${storageID}/items/${itemID}`,
                    data: {
                        quantity
                    }
                });

                if (res?.status == 200) return true;
                else return false;
            } catch {
                return false;
            }
        }
    };

    static Item = class {
        static async get(id: string): Promise<ItemObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/item/${encodeURIComponent(id)}`
                });

                if (res?.status == 200) return res.data as ItemObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async patch(item: ItemObject): Promise<ItemObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/item/${encodeURIComponent(item.id)}`
                });

                if (res?.status == 200) return res.data as ItemObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async post(item: ItemObject): Promise<ItemObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: "/item",
                    data: item
                });

                if (res?.status == 200) return res.data as ItemObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }
    };

    static DropOff = class {
        static async get(id: string): Promise<DropOffObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/dropoff/${encodeURIComponent(id)}`
                });

                if (res?.status == 200) return res.data as DropOffObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async patch(dropoff: DropOffObject): Promise<DropOffObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/dropoff/${encodeURIComponent(dropoff.id)}`
                });

                if (res?.status == 200) return res.data as DropOffObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async post(dropoff: DropOffObject): Promise<DropOffObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: "/dropoff",
                    data: dropoff
                });

                if (res?.status == 200) return res.data as DropOffObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }
    };

    static User = class {
        /**
         * Get the current user.
         * @returns The user object if logged in, undefined if not.
         */
        static async me(): Promise<UserObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: "/user/me"
                });

                if (res) return res.data as UserObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async get(id: string): Promise<UserObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/user/${encodeURIComponent(id)}`
                });

                if (res) return res.data as UserObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async patch(user: UserObject): Promise<UserObject | undefined> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/user/${encodeURIComponent(user.id)}`,
                    data: user
                });

                if (res?.status == 200) return res.data as UserObject;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async sendLocation(loc: string): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "post",
                    url: "/user/me/location",
                    data: {
                        location: loc
                    }
                });

                if (res?.status == 200) return true;
                return false;
            } catch {
                return false;
            }
        }

        static async getItems(userID: string): Promise<Array<{ id: string; quantity: number; }> | undefined> {
            try {
                let res = await APIManager.request({
                    method: "get",
                    url: `/user/${encodeURIComponent(userID)}/items`,
                });

                if (res?.status == 200) return res.data;
                else return undefined;
            } catch {
                return undefined;
            }
        }

        static async setItemQuantity(userID: string, itemID: string, quantity: number): Promise<boolean> {
            try {
                let res = await APIManager.request({
                    method: "patch",
                    url: `/user/${userID}/items/${itemID}`,
                    data: {
                        quantity
                    }
                });

                if (res?.status == 200) return true;
                else return false;
            } catch {
                return false;
            }
        }
    };
}
