import { AuthContextType, ConfigContextType, GeoContextType, TimeContextType } from "@/types";
import { createContext } from "react";

export const TimeContext = createContext<TimeContextType>({
  timeList: [],
  time: "",
});

export const GeoContext = createContext<GeoContextType>({
  coordinate: undefined,
  value: undefined,
  location: "",
});

export const ConfigContext = createContext<ConfigContextType>({
  setLayer: () => {},
  layer: {
    station: true,
    model: true,
  },
});

const DEFAULT_AUTH_CONTEXT: AuthContextType = {
  user: null,
  token: null,
  login: async () => true,
  logout: () => null,
};

export const AuthenticationContext = createContext<AuthContextType>(DEFAULT_AUTH_CONTEXT);
