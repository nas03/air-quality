// Types
import {
    AlertRegistrationContextType,
    AnalyticContextType,
    AuthContextType,
    ConfigContextType,
    GeoContextType,
    TimeContextType,
} from "@/types/contexts";

// React
import { createContext } from "react";

// Constants
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
    wind_speed: 0,
    time: "",
    district_id: "",
});

export const ConfigContext = createContext<ConfigContextType>({
    setLayer: () => {},
    layer: {
        station: true,
        model: true,
        wind: true,
    },
    mapRef: { current: null },
    markerRef: { current: null },
    setMarker: () => {},
    setMap: () => {},
    currentCoordinate: [0, 0],
    setCurrentCoordinate: () => {},
});

export const AuthenticationContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => {
        return { message: "", success: true };
    },
    logout: () => null,
});

export const AnalyticContext = createContext<AnalyticContextType>({
    dateRange: [],
    province_id: "",
    selectedDistrict: "",
    dataType: MonitoringData.OUTPUT.AQI,
    setAnalyticData: () => null,
});

export const AlertRegistrationContext = createContext<AlertRegistrationContextType>({
    currentStep: 0,
    setCurrentStep: () => {},
    maxStep: 3,
    registrationLoading: false,
    setRegistrationLoading: () => {},
    registerAlert: async () => {},
});
