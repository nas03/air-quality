import { GeoContextType } from "@/types/contexts";
import { MonitoringData } from "./consts";

export type MarkData = GeoContextType & { time: string; wind_speed: number | null; district_id: string };
export interface AirQualityData {
    aqi_index: number;
    pm_25: number;
    status: string;
    time: string;
    name: string;
    location: string | string[];
    recommendation: string;
    wind_speed: number;
 
}

export type MonitoringOutputDataType = (typeof MonitoringData.OUTPUT)[keyof typeof MonitoringData.OUTPUT];
export type MonitoringInputDataType = (typeof MonitoringData.INPUT)[keyof typeof MonitoringData.INPUT];
export type AnalyticData = {
    dateRange: string[];
    province_id: string;
    dataType: MonitoringOutputDataType;
    selectedDistrict: string;
};
