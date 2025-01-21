import api from "@/config/api";
import { APIResponse, SignInResponse, VerifyTokenResponse } from "@/types/api";

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

  return !(response.data.status === "error" || response.data.status === "failed");
};
