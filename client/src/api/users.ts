import api from "@/config/api";
import { APIResponse, SignInResponse, VerifyTokenResponse } from "@/types/api";
import { User } from "@/types/db";

export const signin = async (email: string, password: string): Promise<SignInResponse | false> => {
    const response = await api.post<APIResponse<SignInResponse>>("/auth/signin", {
        accountIdentifier: email,
        password,
    });
    if (response.data.status === "error") {
        return false;
    }

    return response.data.data;
};

export const verifyToken = async (token: string): Promise<boolean> => {
    const response = await api.post<APIResponse<VerifyTokenResponse>>("/auth/verify-token", { token });

    return !(response.data.status === "error" || response.data.status === "fail");
};

export type CreateUserParams = {
    username: string;
    email: string;
    phone_number: string;
    password: string;
};
export const createUser = async (payload: CreateUserParams) => {
    const response = await api.post<APIResponse<null>>("/users/signup", {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        phone_number: payload.phone_number,
    });

    if (["fail", "error"].includes(response.data.status)) {
        throw Error("Error creating new user");
    }
    return null;
};

export const getUserInfoByUserId = async (user_id: number | undefined) => {
    if (!user_id) return null;
    const response = await api.get<APIResponse<User | null>>(`/user/${user_id}`);

    return response.data.data;
};
