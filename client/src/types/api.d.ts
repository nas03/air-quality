export type APIResponse<T> = {
  status: string;
  data: T;
  message?: string;
};

interface SignInResponse {
  user_id: number;
  username: string;
  access_token: string;
}

interface VerifyTokenResponse {
  verified: boolean;
  user_id: number;
  role: string;
}
