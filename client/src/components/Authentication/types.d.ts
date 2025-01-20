export interface IPropsAuthentication {
  className?: string;
}

export type AuthTokens = {
  access_token: string | null;
  refresh_token: string | null;
};

export type AuthUser = {
  user_id: number;
  // role: string;
  username: string;
};
