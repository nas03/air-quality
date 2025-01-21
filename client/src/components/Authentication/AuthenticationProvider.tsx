import { signin } from "@/api";
import { AuthUser } from "@/components/Authentication/types";
import { AuthenticationContext } from "@/context";
import { AuthContextType } from "@/types/contexts";
import React, { useContext, useState } from "react";

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem("access_token");
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const signedIn = await signin(email, password);

    if (!signedIn) {
      return false;
    }

    const userData = {
      user_id: signedIn.user_id,
      username: signedIn.username,
    };

    sessionStorage.setItem("access_token", signedIn.access_token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return true;
  };

  const logout = (): void => {
    sessionStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
    document.cookie = "AUTH_REF_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
  };

  return <AuthenticationContext.Provider value={contextValue}>{children}</AuthenticationContext.Provider>;
};

export const useAuth = () => useContext(AuthenticationContext);
export default AuthenticationProvider;
