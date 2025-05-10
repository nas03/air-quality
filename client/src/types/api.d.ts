export type APIResponse<T> = {
    status: "error" | "fail" | "success";
    data: T;
    message?: string;
};

interface SignInResponse {
    user_id: number;
    username: string;
    access_token: string;
    role: number;
}

interface VerifyTokenResponse {
    verified: boolean;
    user_id: number;
    role: string;
}
