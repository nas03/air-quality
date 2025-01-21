import { AuthContextType, ConfigContextType, GeoContextType, TimeContextType } from "@/types/contexts";
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

export const AuthenticationContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => true,
  logout: () => null,
});
