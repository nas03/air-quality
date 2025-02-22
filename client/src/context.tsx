import {
  AnalyticContextType,
  AuthContextType,
  ConfigContextType,
  GeoContextType,
  TimeContextType,
} from "@/types/contexts";
import { createContext } from "react";
import { MonitoringData } from "./types/consts";

export const MonitoringDataConst = Object.freeze({
  INPUT: {
    MODEL: 0,
    STATION: 1,
  } as const,
  OUTPUT: {
    AQI: 0,
    PM25: 1,
  } as const,
});

export const TimeContext = createContext<TimeContextType>({
  timeList: [],
  time: "",
});

export const GeoContext = createContext<GeoContextType>({
  type: 0,
  coordinate: undefined,
  aqi_index: null,
  pm_25: null,
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

export const AnalyticContext = createContext<AnalyticContextType>({
  dateRange: [],
  province_id: "",
  selectedDistrict: "",
  dataType: MonitoringData.OUTPUT.AQI,
  setAnalyticData: () => null,
});
