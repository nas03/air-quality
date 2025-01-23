import { AuthenticationContext } from "@/context";
import { useContext } from "react";

export const useAuth = () => useContext(AuthenticationContext);
