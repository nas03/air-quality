import api from "@/config/api";
import { APIResponse, SignInResponse, VerifyTokenResponse } from "@/types/api";
import { User } from "@/types/db";

export const signin = async (email: string, password: string): Promise<APIResponse<SignInResponse> | false> => {
    const response = await api.post<APIResponse<SignInResponse>>("/auth/signin", {
        accountIdentifier: email,
        password,
    }, {withCredentials: true});
    if (response.data.status === "error") {
        return false;
    }

    return response.data;
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
    if (response.data.status === "fail") return { message: "Email đã được tài khoản khác sử dụng", isSuccess: false };
    if (response.data.status === "error")
        return { message: "Lỗi hệ thống, vui lòng thử lại sau ít phút", isSuccess: false };
    return { message: "", isSuccess: true };
};

export const getUserInfoByUserId = async (user_id: number | undefined) => {
    if (!user_id) return null;
    const response = await api.get<APIResponse<User | null>>(`/user/${user_id}`);

    return response.data.data;
};

export const updateUser = async (data: Partial<User>) => {
    const response = await api.put<APIResponse<User>>("/user/update-info", data);
    return response.data;
};

export const updateUserPassword = async (user_id: number, old_password: string, new_password: string) => {
    const response = await api.put<APIResponse<null>>("/user/update-password", {
        user_id,
        old_password,
        new_password,
    });
    return response.data;
};
