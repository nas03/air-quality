import { signin } from "@/api";
import { AuthenticationContext } from "@/context";
import { AuthContextType, AuthUser } from "@/types/contexts";
import React, { useCallback, useState } from "react";

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("access_token"));

    const login = useCallback(
        async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
            try {
                const signedIn = await signin(email, password);

                if (!signedIn) {
                    return { success: false, message: "" };
                } else if (signedIn.message) {
                    return { message: signedIn.message, success: true };
                } else {
                    const userData = {
                        user_id: signedIn.data.user_id,
                        username: signedIn.data.username,
                    };

                    sessionStorage.setItem("access_token", signedIn.data.access_token);
                    sessionStorage.setItem("user", JSON.stringify(userData));

                    setUser(userData);
                    setToken(signedIn.data.access_token);
                    return { message: "", success: true };
                }
            } catch (error) {
                console.error("Login failed:", error);
                return { success: false, message: "" };
            }
        },
        [],
    );

    const logout = useCallback((): void => {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        setUser(null);
        setToken(null);
        document.cookie = "AUTH_REF_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }, []);

    const contextValue: AuthContextType = {
        user,
        token,
        login,
        logout,
    };

    return <AuthenticationContext.Provider value={contextValue}>{children}</AuthenticationContext.Provider>;
};

export default AuthenticationProvider;
