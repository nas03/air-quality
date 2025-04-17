import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import React, { SetStateAction } from "react";
import { AnalyticData, MonitoringOutputDataType } from "./types";

export interface TimeContextType {
    timeList: string[];
    time: string;
}

export interface GeoContextType {
    type: 0 | 1;
    coordinate: [number, number] | undefined;
    aqi_index: number | null;
    pm_25: number | null;
    location: string;
    wind_speed: number;
    time?: string;
}

export interface ConfigContextType {
    setLayer: React.Dispatch<
        React.SetStateAction<{
            station: boolean;
            model: boolean;
            wind: boolean;
        }>
    >;
    layer: {
        station: boolean;
        model: boolean;
        wind: boolean;
    };
    currentCoordinate: Coordinate;
    setCurrentCoordinate: React.Dispatch<SetStateAction<Coordinate>>;
    setMap: (map: Map) => void;
    mapRef: React.MutableRefObject<Map | null>;
    setMarker: (marker) => void;
    markerRef: React.MutableRefObject<VectorLayer | null>;
}

export type AuthUser = {
    user_id: number;
    username: string;
};

export interface AuthContextType {
    user?: AuthUser | null;
    token?: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

export interface AnalyticContextType {
    setAnalyticData: React.Dispatch<React.SetStateAction<AnalyticData>>;
    dateRange: string[];
    province_id: string;
    dataType: MonitoringOutputDataType;
    selectedDistrict: string;
}

export interface AlertRegistrationContextType {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    maxStep: number;
    registrationLoading: boolean;
    setRegistrationLoading: React.Dispatch<React.SetStateAction<boolean>>;
    registerAlert: () => Promise<void>;
}
